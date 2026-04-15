import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { LockKey, ShieldWarning, Database, Key } from '@phosphor-icons/react';

const SecuritySuite = () => {
  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            The <span className="text-gold-gradient">Security Suite</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto">
            A zero-trust platform architecture. We built BankAds to comply with the strictest financial data regulations globally, ensuring your core banking operations are never compromised.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/5 group-hover:to-gold-500/10 transition-colors"></div>
            <LockKey size={48} className="text-gold-500 mb-6 relative z-10" weight="duotone" />
            <h3 className="text-2xl font-black mb-4 relative z-10">End-to-End Encryption</h3>
            <p className="text-gray-400 font-medium leading-relaxed relative z-10">
              All payloads between your servers and the BankAds Engine are encrypted using TLS 1.3. Internally, Paystack wallet tokens and cryptographic keys are hashed using Argon2id before storage in our Neon PostgreSQL instances.
            </p>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/5 group-hover:to-gold-500/10 transition-colors"></div>
            <ShieldWarning size={48} className="text-gold-500 mb-6 relative z-10" weight="duotone" />
            <h3 className="text-2xl font-black mb-4 relative z-10">Compliance & Regulatory Safety</h3>
            <p className="text-gray-400 font-medium leading-relaxed relative z-10">
              We operate under a Strict Abstraction policy. We do not intake, store, or process Personally Identifiable Information (PII) or Primary Account Numbers (PAN). Ad targeting relies solely on anonymized cohort data.
            </p>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/5 group-hover:to-gold-500/10 transition-colors"></div>
            <Key size={48} className="text-gold-500 mb-6 relative z-10" weight="duotone" />
            <h3 className="text-2xl font-black mb-4 relative z-10">Rotating Authorizations</h3>
            <p className="text-gray-400 font-medium leading-relaxed relative z-10">
              Publishers possess dynamic API Tokens that can be rotated instantaneously via the Dashboard in the event of a suspected leak, severing connection to edge endpoints without downtime.
            </p>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/5 group-hover:to-gold-500/10 transition-colors"></div>
            <Database size={48} className="text-gold-500 mb-6 relative z-10" weight="duotone" />
            <h3 className="text-2xl font-black mb-4 relative z-10">Decentralized Tenancy</h3>
            <p className="text-gray-400 font-medium leading-relaxed relative z-10">
              Financial data and tracking analytics are aggressively sharded. This prevents horizontal traversal attacks and guarantees that Advertiser ROI metrics remain entirely proprietary.
            </p>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default SecuritySuite;
