import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { Target, ChartLineUp, ShieldCheck, Broadcast } from '@phosphor-icons/react';

const Capabilities = () => {
  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Platform <span className="text-gold-gradient">Capabilities</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto">
            BankAds is engineered to unify the fragmented financial advertising space into a single, high-throughput, latency-optimized API engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="glass-card rounded-[3rem] p-12 border border-gold-500/20 hover:border-gold-500/50 transition-all">
            <Target size={48} className="text-gold-500 mb-8" weight="duotone" />
            <h3 className="text-3xl font-black mb-4">Precision Segmentation</h3>
            <p className="text-lg text-gray-400 leading-relaxed font-medium">
              Target consumers dynamically based on real account balances, recent transaction velocity, and asset classes. Our SQL querying engine executes multidimensional segmentation across millions of profiles in less than 20ms.
            </p>
          </div>

          <div className="glass-card rounded-[3rem] p-12 border border-gold-500/20 hover:border-gold-500/50 transition-all">
            <Broadcast size={48} className="text-gold-500 mb-8" weight="duotone" />
            <h3 className="text-3xl font-black mb-4">Omni-Channel Delivery</h3>
            <p className="text-lg text-gray-400 leading-relaxed font-medium">
              Deliver native programmatic ads natively into mobile banking dashboards, USSD push notifications, ATM screens, and POS hardware without bloated SDKs. Just one secure HTTPS REST query.
            </p>
          </div>

          <div className="glass-card rounded-[3rem] p-12 border border-gold-500/20 hover:border-gold-500/50 transition-all">
            <ChartLineUp size={48} className="text-gold-500 mb-8" weight="duotone" />
            <h3 className="text-3xl font-black mb-4">Live ROI Dashboards</h3>
            <p className="text-lg text-gray-400 leading-relaxed font-medium">
              Monitor impressions, CTRs, and wallet deductions in real-time. Our Analytics Cloud processes high-volume telemetry data to supply instant performance metrics, enabling you to pivot active campaigns dynamically.
            </p>
          </div>

          <div className="glass-card rounded-[3rem] p-12 border border-gold-500/20 hover:border-gold-500/50 transition-all">
            <ShieldCheck size={48} className="text-gold-500 mb-8" weight="duotone" />
            <h3 className="text-3xl font-black mb-4">Zero PII Leakage</h3>
            <p className="text-lg text-gray-400 leading-relaxed font-medium">
              Our Security Suite guarantees complete data masking. Advertisers only specify their targeted financial demographics; the engine routes the ad to the matching publisher ID. No names or card details ever cross our network.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Capabilities;
