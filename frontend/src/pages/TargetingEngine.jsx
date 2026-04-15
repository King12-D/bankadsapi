import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { Crosshair, Faders, Atom } from '@phosphor-icons/react';

const TargetingEngine = () => {
  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            The <span className="text-gold-gradient">Targeting Engine</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto">
            BankAds removes the guesswork from B2B and B2C campaigns by deploying algorithms that route ads based strictly on deterministic bank data.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-16 mb-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
             <div className="flex-1">
               <h2 className="text-4xl font-black mb-6">Demographic Clustering</h2>
               <p className="text-lg text-gray-300 font-medium leading-relaxed mb-6">
                 Instead of tracking clicks across social media, the Targeting Engine hooks directly into the context of the user API request. Does the user have a high balance? Are they interacting with a mortgage calculator endpoint? Our programmatic matching pairs your campaign exclusively with your ideal financial persona.
               </p>
               <ul className="space-y-4">
                 <li className="flex items-center gap-3 text-gold-500 font-bold"><Crosshair size={24} /> High-Net-Worth Segmentation</li>
                 <li className="flex items-center gap-3 text-gold-500 font-bold"><Crosshair size={24} /> Active Credit Seekers Targeting</li>
                 <li className="flex items-center gap-3 text-gold-500 font-bold"><Crosshair size={24} /> Foreign Exchange Activity Triggers</li>
               </ul>
             </div>
             <div className="flex-1 bg-black-pure/50 p-8 rounded-3xl border border-white/10 shadow-2xl">
                <pre className="text-xs text-gold-400 font-mono overflow-x-auto">
{`{
  "request": {
    "module": "targeting_engine",
    "customer": {
      "balance_tier": "PLATINUM",
      "recent_action": "INTL_WIRE",
      "velocity": "HIGH"
    }
  },
  "response": {
    "adId": "CMP-992-B",
    "match_score": 98.4,
    "latency": "14ms"
  }
}`}
                </pre>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-10 rounded-[2rem] border border-gold-500/10 hover:border-gold-500/30">
             <Faders size={40} className="text-gold-500 mb-6" weight="fill" />
             <h3 className="text-2xl font-black mb-3">Granular Configuration</h3>
             <p className="text-gray-400 font-medium leading-relaxed">Adjust your campaigns in real time. Ramp up frequency caps for aggressive launch weeks, or restrict bidding to weekends when retail trading volumes spike.</p>
          </div>
          <div className="glass p-10 rounded-[2rem] border border-gold-500/10 hover:border-gold-500/30">
             <Atom size={40} className="text-gold-500 mb-6" weight="fill" />
             <h3 className="text-2xl font-black mb-3">AI Threat Scoring</h3>
             <p className="text-gray-400 font-medium leading-relaxed">The engine continuously filters out bot traffic and scripted API abuse. Ensure your Paystack wallet balance is only deducted for legitimate, human-driven impressions.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TargetingEngine;
