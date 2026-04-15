import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { Buildings, Handshake, GlobeHemisphereWest, UsersThree } from '@phosphor-icons/react';

const Company = () => {
  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            The <span className="text-gold-gradient">Origin</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto">
            BankAds Prestige Engine was built to solve the impossible: delivering hyper-targeted programmatic ads inside highly secure financial walls without compromising consumer PII.
          </p>
        </div>

        {/* The Collaboration Section */}
        <section className="mb-24 relative">
          <div className="absolute inset-0 bg-gold-500/5 rounded-[4rem] border border-gold-500/20 transform -skew-y-2 scale-105 z-0"></div>
          <div className="relative z-10 glass-card p-10 md:p-16 rounded-[4rem] text-center border border-white/5">
            <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">A Strategic Alliance</h2>
            <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-4xl mx-auto mb-12">
              The platform is the result of an exclusive, high-stakes infrastructure collaboration between two digital engineering giants. By uniting high-throughput API architecture with cutting-edge UI/UX design, BankAds was forged.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
              <div className="bg-black/40 p-10 rounded-[3rem] border border-gold-500/20 hover:border-gold-500/50 transition-colors">
                <UsersThree size={48} className="text-gold-500 mx-auto mb-6" weight="duotone" />
                <h3 className="text-3xl font-black text-white mb-2">Ko9d Ltd</h3>
                <p className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-6">King David Uchenna</p>
                <p className="text-gray-400 font-medium leading-relaxed">Pioneering the core algorithmic targeting engine and high-availability database cluster required to process millions of secure impressions per second.</p>
              </div>

              <div className="bg-black/40 p-10 rounded-[3rem] border border-gold-500/20 hover:border-gold-500/50 transition-colors">
                <UsersThree size={48} className="text-gold-500 mx-auto mb-6" weight="duotone" />
                <h3 className="text-3xl font-black text-white mb-2">WidLtd</h3>
                <p className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-6">Ike Wisdom</p>
                <p className="text-gray-400 font-medium leading-relaxed">Developing the immersive, low-latency UI interfaces and securing the dynamic Paystack integration corridors for seamless wallet deployments.</p>
              </div>
            </div>
            
            <div className="mt-16 flex justify-center">
              <Handshake size={64} className="text-gold-500/50" weight="duotone" />
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-10 border border-white/5 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 to-gold-500/5 group-hover:to-gold-500/10 transition-colors"></div>
            <Buildings size={48} className="text-gold-500 mb-6 relative z-10" weight="duotone" />
            <h3 className="text-2xl font-black mb-4 relative z-10">Our Vision</h3>
            <p className="text-gray-400 font-medium leading-relaxed relative z-10">
              To become the default decentralized advertising bridge for every banking application on the globe, providing institutions with immediate revenue channels while respecting absolute user privacy.
            </p>
          </div>

          <div className="p-10 border border-white/5 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 to-gold-500/5 group-hover:to-gold-500/10 transition-colors"></div>
            <GlobeHemisphereWest size={48} className="text-gold-500 mb-6 relative z-10" weight="duotone" />
            <h3 className="text-2xl font-black mb-4 relative z-10">Our Infrastructure</h3>
            <p className="text-gray-400 font-medium leading-relaxed relative z-10">
              Headquartered globally, with distributed edge networks across critical AWS data centers ensuring sub-20ms latency regardless of where the financial institution operates.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Company;
