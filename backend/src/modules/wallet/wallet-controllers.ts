import { Context } from "hono";
import { query } from "../../utils/db";
import { initializePaystackTransaction, verifyPaystackTransaction, initiateTransfer } from "../../utils/paystack-utils";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_bankads";

const getUserId = (c: Context): string => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
}

export const getWalletBalance = async (c: Context) => {
    try {
        const userId = getUserId(c);
        let res = await query("SELECT * FROM wallets WHERE user_id = $1", [userId]);
        
        // Auto-create wallet if it doesn't exist
        if (res.rows.length === 0) {
            res = await query("INSERT INTO wallets (user_id) VALUES ($1) RETURNING *", [userId]);
        }
        
        return c.json({ balance: Number(res.rows[0].balance), currency: res.rows[0].currency });
    } catch (err: any) {
        return c.json({ error: err.message }, 401);
    }
}

export const fundWallet = async (c: Context) => {
    try {
        const userId = getUserId(c);
        const { amount } = await c.req.json(); // Amount in NGN
        
        if (!amount || amount <= 0) return c.json({ error: "Invalid amount" }, 400);

        const userRes = await query("SELECT email FROM users WHERE id = $1", [userId]);
        const email = userRes.rows[0].email;

        // Ensure wallet exists
        let walletRes = await query("SELECT id FROM wallets WHERE user_id = $1", [userId]);
        if (walletRes.rows.length === 0) {
            walletRes = await query("INSERT INTO wallets (user_id) VALUES ($1) RETURNING id", [userId]);
        }
        const walletId = walletRes.rows[0].id;

        const reference = `fund_${crypto.randomBytes(8).toString('hex')}_${Date.now()}`;

        // Create pending transaction ledger entry
        await query(
            "INSERT INTO transactions (wallet_id, amount, type, reference, status, description) VALUES ($1, $2, $3, $4, $5, $6)",
            [walletId, amount, 'credit', reference, 'pending', 'Wallet Funding']
        );

        // Call Paystack API
        const paystackRes = await initializePaystackTransaction(email, amount, reference);

        return c.json({ 
            message: "Initialization successful", 
            authorization_url: paystackRes.data.authorization_url,
            reference
        });

    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
}

export const verifyFunding = async (c: Context) => {
    try {
        const { reference } = await c.req.json();
        if (!reference) return c.json({ error: "Reference required" }, 400);

        const pRes = await verifyPaystackTransaction(reference);

        if (pRes.data.status === 'success') {
            // Check if already processed
            const txRes = await query("SELECT id, status, amount, wallet_id FROM transactions WHERE reference = $1", [reference]);
            if (txRes.rows.length === 0) return c.json({ error: "Transaction not found locally" }, 404);

            const tx = txRes.rows[0];
            if (tx.status === 'success') {
                return c.json({ message: "Transaction already processed" });
            }

            // Update Transaction & Wallet
            await query("UPDATE transactions SET status = 'success' WHERE id = $1", [tx.id]);
            await query("UPDATE wallets SET balance = balance + $1, updated_at = NOW() WHERE id = $2", [tx.amount, tx.wallet_id]);

            return c.json({ message: "Wallet funded successfully" });
        } else {
             await query("UPDATE transactions SET status = 'failed' WHERE reference = $1", [reference]);
             return c.json({ error: "Payment verification failed or pending" }, 400);
        }

    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
}

// Publisher withdrawal
export const withdrawFunds = async (c: Context) => {
    try {
        const userId = getUserId(c);
        const { amount } = await c.req.json();

        if (!amount || amount < 10000) {
            return c.json({ error: "Minimum withdrawal amount is NGN 10,000" }, 400);
        }

        const walletRes = await query("SELECT id, balance FROM wallets WHERE user_id = $1", [userId]);
        if (walletRes.rows.length === 0 || Number(walletRes.rows[0].balance) < amount) {
            return c.json({ error: "Insufficient wallet balance" }, 400);
        }

        const pubRes = await query("SELECT recipient_code FROM publishers WHERE user_id = $1", [userId]);
        if (pubRes.rows.length === 0 || !pubRes.rows[0].recipient_code) {
             return c.json({ error: "Publisher payout details not configured. Please contact support." }, 400);
        }

        const walletId = walletRes.rows[0].id;
        const recipient = pubRes.rows[0].recipient_code;
        const ref = `payout_${crypto.randomBytes(8).toString('hex')}`;

        // Optimistically deduct balance and create pending transaction
        await query("UPDATE wallets SET balance = balance - $1 WHERE id = $2", [amount, walletId]);
        await query(
            "INSERT INTO transactions (wallet_id, amount, type, reference, status, description) VALUES ($1, $2, $3, $4, $5, $6)",
            [walletId, amount, 'debit', ref, 'pending', 'Withdrawal Request']
        );

        try {
            // Trigger Paystack transfer
            await initiateTransfer(amount, recipient, "Prestige Engine Ad Revenue Payout");
            await query("UPDATE transactions SET status = 'success' WHERE reference = $1", [ref]);
            return c.json({ message: "Withdrawal successful and processing."});

        } catch (err:any) {
             // Rollback on failure
             await query("UPDATE wallets SET balance = balance + $1 WHERE id = $2", [amount, walletId]);
             await query("UPDATE transactions SET status = 'failed' WHERE reference = $1", [ref]);
             return c.json({ error: "Withdrawal failed via payment provider. Funds returned to wallet." }, 500);
        }

    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
}
