import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { ChartBar, Eye, TrendUp, Funnel } from '@phosphor-icons/react';

const AnalyticsCloud = () => {
  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            <span className="text-gold-gradient">Analytics</span> Cloud
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto">
            Stop guessing your Return on Ad Spend (ROAS). Experience total visibility over your Enterprise financial ad performance.
          </p>
        </div>

        <div className="mb-24">
          <div className="glass-card rounded-[3rem] p-8 md:p-16 border-gold-500/30 overflow-hidden relative shadow-[0_0_50px_rgba(212,175,55,0.05)]">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px]"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black mb-6">Real-Time Telemetry</h2>
                <p className="text-gray-300 font-medium text-lg leading-relaxed mb-6">
                  Every time a publisher calls your ad, the Analytics Cloud instantly processes the viewport impression. Track global reach and click-through rates across multiple time horizons without delay. 
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 bg-black/50 p-4 rounded-xl border border-white/5">
                    <div className="p-3 bg-gold-500/10 rounded-lg text-gold-500"><Eye size={24} weight="duotone" /></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Latency Tracking</p>
                      <p className="text-white font-bold">18ms average delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-black/50 p-4 rounded-xl border border-white/5">
                    <div className="p-3 bg-gold-500/10 rounded-lg text-gold-500"><TrendUp size={24} weight="duotone" /></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Conversion Modeling</p>
                      <p className="text-white font-bold">A/B test different CTAs instantly</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-64 md:h-full min-h-[300px] w-full bg-gradient-to-tr from-gold-500/5 to-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
                 <div className="text-center p-8">
                   <ChartBar size={64} className="text-gold-500/30 mx-auto mb-4" />
                   <p className="text-gray-500 font-mono text-sm">Visualizer Container / Dashboard Preview</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[2rem] border border-white/5">
            <h3 className="text-2xl font-black mb-4">Financial Wallet Sync</h3>
            <p className="text-gray-400 font-medium leading-relaxed">
              The Analytics Cloud is tightly integrated with the Paystack Wallet ledger. Track exactly how much NGN is being spent per individual campaign in real-time. Export granular CSV reports for your accounting team.
            </p>
          </div>
          <div className="glass-card p-10 rounded-[2rem] border border-white/5">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
               <Funnel size={28} className="text-gold-500" /> Waterfall Reporting
            </h3>
            <p className="text-gray-400 font-medium leading-relaxed">
              Identify exactly which Publisher categories (Neobanks vs Credit Unions) and filtering segments (Platinum vs Retail balances) are offering the highest engagement density for your campaigns.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AnalyticsCloud;
