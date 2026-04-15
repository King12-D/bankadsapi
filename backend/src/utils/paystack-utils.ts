import { getOrThrowEnv } from "../config/config";

// Initialize Paystack transaction (for funding wallet)
export const initializePaystackTransaction = async (email: string, amount: number, reference: string) => {
  const PAYSTACK_SECRET = getOrThrowEnv.PAYSTACK_SECRET_KEY || "sk_test_dummy";
  
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Kobo
      reference,
      channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"]
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Paystack Initialization Error: ${err.message}`);
  }

  return await response.json();
};

export const verifyPaystackTransaction = async (reference: string) => {
  const PAYSTACK_SECRET = getOrThrowEnv.PAYSTACK_SECRET_KEY || "sk_test_dummy";

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to verify transaction with Paystack");
  }

  return await response.json();
};

export const createTransferRecipient = async (name: string, accountNumber: string, bankCode: string) => {
    const PAYSTACK_SECRET = getOrThrowEnv.PAYSTACK_SECRET_KEY || "sk_test_dummy";

    const response = await fetch("https://api.paystack.co/transferrecipient", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type: "nuban",
            name,
            account_number: accountNumber,
            bank_code: bankCode,
            currency: "NGN"
        })
    });

    if (!response.ok) throw new Error("Failed to create transfer recipient");
    return await response.json();
};

export const initiateTransfer = async (amount: number, recipient: string, reason: string) => {
    const PAYSTACK_SECRET = getOrThrowEnv.PAYSTACK_SECRET_KEY || "sk_test_dummy";

    const response = await fetch("https://api.paystack.co/transfer", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            source: "balance", // Transfer from Paystack balance
            amount: amount * 100, // Kobo
            recipient,
            reason
        })
    });

    if (!response.ok) throw new Error("Failed to initiate transfer");
    return await response.json();
}
