import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';

const Pricing = () => {
  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 md:px-0 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-5 py-2 rounded-full glass border border-gold-500/20 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase">
            Transparent Scaling
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Subscription <span className="text-gold-gradient">Tiers</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 font-medium">
            Acquire dedicated network bandwidth and premium API keys. Payments secured by Paystack. All plans include automated wallet threshold triggers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto text-left">
            
            {/* Free Plan */}
            <div className="glass-card rounded-[2rem] p-8 flex flex-col border border-gold-500/10 hover:border-gold-500/30 transition-colors">
              <h3 className="text-2xl font-black text-white mb-2">Sandbox</h3>
              <p className="text-gray-400 mb-6 font-medium text-sm">Perfect for technical integration testing.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">Free</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Up to 5,000 req/mo
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> API Documentation
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> 1 Sandbox API Key
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium opacity-50">
                  <CheckCircle size={20} className="text-gray-500" /> No Segment Targeting
                </li>
              </ul>
              <Link to="/register" className="w-full py-4 text-center rounded-2xl glass text-gold-500 border border-gold-500/20 font-black tracking-wide hover:bg-gold-500/10 transition-colors">START INTEGRATION</Link>
            </div>

            {/* Basic Plan */}
            <div className="glass-card rounded-[2rem] p-8 flex flex-col border border-gold-500/10 hover:border-gold-500/30 transition-colors">
              <h3 className="text-2xl font-black text-white mb-2">Startup</h3>
              <p className="text-gray-400 mb-6 font-medium text-sm">For regional scale operations.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">NGN 25k</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Up to 50k req/mo
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Global Segment Access
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> 1 Production API Key
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Standard Support
                </li>
              </ul>
              <Link to="/register" className="w-full py-4 text-center rounded-2xl glass text-gold-500 border border-gold-500/20 font-black tracking-wide hover:bg-gold-500/10 transition-colors">SELECT STARTUP</Link>
            </div>

            {/* Pro Plan */}
            <div className="glass-card rounded-[2rem] p-8 flex flex-col relative border-gold-500/50 shadow-[0_0_40px_rgba(212,175,55,0.15)] bg-gold-500/5">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gold-500 text-black text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Corporate</h3>
              <p className="text-gray-400 mb-6 font-medium text-sm">For growing banks and full rollouts.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">NGN 150k</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Up to 1M req/mo
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Real-time ROI Analytics
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Precision Channel Targeting
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> 5 Production API Keys
                </li>
              </ul>
              <Link to="/register" className="w-full py-4 text-center rounded-2xl btn-gold text-black font-black tracking-wide shadow-lg">SELECT CORPORATE</Link>
            </div>

            {/* Enterprise Plan */}
            <div className="glass-card rounded-[2rem] p-8 flex flex-col border border-gold-500/10 hover:border-gold-500/30 transition-colors">
              <h3 className="text-2xl font-black text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 mb-6 font-medium text-sm">Infinite scale for global financial ecosystems.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Unlimited Volume
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Custom Paystack Settlements
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Infinite API Keys & Endpoints
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-medium">
                  <CheckCircle size={20} weight="fill" className="text-gold-500" /> Dedicated Account Engineer
                </li>
              </ul>
              <Link to="/contact" className="w-full py-4 text-center rounded-2xl glass text-gold-500 border border-gold-500/20 font-black tracking-wide hover:bg-gold-500/10 transition-colors">CONTACT SALES</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
