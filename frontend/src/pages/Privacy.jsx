import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { FileText, WarningCircle, Scales } from '@phosphor-icons/react';

const Privacy = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-gold-500/20 text-gold-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Scales size={16} /> Legal & Terms
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white">
            Privacy Policy & <span className="text-gold-gradient">Terms</span>
          </h1>
          <p className="text-gray-500 font-medium">Last Updated: {lastUpdated}</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-14 border-white/5 space-y-12">
          
          <section>
             <h2 className="text-2xl font-black text-gold-500 mb-4 flex items-center gap-3">
               <FileText size={28} /> 1. Overview and Scope
             </h2>
             <p className="text-gray-400 font-medium leading-relaxed mb-4">
               This Privacy Policy outlines how BankAds Prestige Engine ("Company," "we," "our," or "us") manages telemetry, API routing data, and wallet transactions. Because our service acts strictly as a B2B Bidding and Ad Routing entity, our data collection is limited EXCLUSIVELY to corporate account management and anonymized target cohorts.
             </p>
          </section>

          <section>
             <h2 className="text-2xl font-black text-gold-500 mb-4 flex items-center gap-3">
               <WarningCircle size={28} /> 2. Zero PII Commitment
             </h2>
             <p className="text-gray-400 font-medium leading-relaxed mb-4">
               BankAds emphatically does NOT collect, store, or process Personally Identifiable Information (PII) of end-users clicking on the ads. The Publisher (Financial Institution) maintains sole custody of PANs, Names, Addresses, and SSNs. We only receive blinded identifiers (e.g., `user_segment=PLATINUM`).
             </p>
          </section>

          <section>
             <h2 className="text-2xl font-black text-white mb-4">3. Data We Collect</h2>
             <ul className="list-disc list-inside space-y-2 text-gray-400 font-medium mb-4 ml-2">
               <li><strong className="text-white">Corporate Contact Data:</strong> Admin names, corporate emails, and business information submitted during Signup.</li>
               <li><strong className="text-white">Wallet Data:</strong> Transaction references, NGN volumes, and Paystack settlement hashes.</li>
               <li><strong className="text-white">Impression Telemetry:</strong> Log files of API requests including latency, IP origination (of the host server), and ad delivery success/failure.</li>
             </ul>
          </section>

          <section>
             <h2 className="text-2xl font-black text-white mb-4">4. Terms of Service</h2>
             <p className="text-gray-400 font-medium leading-relaxed mb-4">
               By generating an API key or funding a Paystack wallet on BankAds, you agree that you are legally authorized to represent your Financial Institution. You agree to adhere strictly to your local financial regulatory body (e.g., CBN, SEC, FCA) regarding the display of marketing material. 
             </p>
             <p className="text-gray-400 font-medium leading-relaxed mb-4">
               Wallet balances are non-refundable once an ad impression has been successfully served and recorded in the database.
             </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
