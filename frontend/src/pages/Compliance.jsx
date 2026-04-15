import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { IdentificationCard, Fingerprint, Gavel } from '@phosphor-icons/react';

const Compliance = () => {
  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Global <span className="text-gold-gradient">Compliance</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto">
            Advertising in the financial sector requires extreme rigor. BankAds enforces strict KYC/KYB protocols to ensure only verified, licensed financial bodies participate in the network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-10 rounded-[2rem] border border-white/5 hover:border-gold-500/20 transition-colors text-center group">
             <IdentificationCard size={56} className="text-gold-500 mx-auto mb-6 group-hover:scale-110 transition-transform" weight="duotone" />
             <h3 className="text-2xl font-black mb-4">KYB Verification</h3>
             <p className="text-gray-400 font-medium leading-relaxed">
               Every publisher and advertiser account requires manual verification of corporate registration documents. Unverified entities are restricted to Sandbox environments.
             </p>
          </div>

          <div className="glass-card p-10 rounded-[2rem] border border-white/5 hover:border-gold-500/20 transition-colors text-center group">
             <Gavel size={56} className="text-gold-500 mx-auto mb-6 group-hover:scale-110 transition-transform" weight="duotone" />
             <h3 className="text-2xl font-black mb-4">Content Moderation</h3>
             <p className="text-gray-400 font-medium leading-relaxed">
               Financial ads must not be deceptive. All creatives and destination URLs undergo programmatic and manual review to ensure alignment with banking sector marketing laws.
             </p>
          </div>

          <div className="glass-card p-10 rounded-[2rem] border border-white/5 hover:border-gold-500/20 transition-colors text-center group">
             <Fingerprint size={56} className="text-gold-500 mx-auto mb-6 group-hover:scale-110 transition-transform" weight="duotone" />
             <h3 className="text-2xl font-black mb-4">Audit Trails</h3>
             <p className="text-gray-400 font-medium leading-relaxed">
               We maintain an immutable ledger of all wallet transactions (via Paystack endpoints) and ad impression telemetry, completely accessible to your internal compliance officers via CSV.
             </p>
          </div>
        </div>

        <div className="mt-20 glass-card p-10 md:p-14 rounded-[3rem] border border-gold-500/20 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-4 text-white">Need a Compliance Packet?</h2>
          <p className="text-gray-400 font-medium mb-8">
            If your risk department requires extensive documentation of our API flow and data masking procedures, our legal engineers can provide a full architecture abstraction dossier.
          </p>
          <a href="/contact" className="btn-gold px-10 py-4 rounded-2xl font-black text-black inline-block uppercase tracking-wider">
            Request Packet
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Compliance;
