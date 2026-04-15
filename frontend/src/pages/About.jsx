import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { ShieldCheck, Target, Lightning, Coins } from '@phosphor-icons/react';

const About = () => {
  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            The Prestige <span className="text-gold-gradient">Engine</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto">
            BankAds is the definitive B2B financial advertising network. We connect high-net-worth advertisers with elite publishers across the global financial ecosystem.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-14 border-gold mb-16">
          <h2 className="text-3xl font-black mb-8 text-gold-500">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed font-medium mb-6">
            Traditional ad networks fail to understand the strict compliance and precise targeting required in the financial sector. We built BankAds to solve this. By integrating directly into secure banking environments, payment gateways, and wealth platforms, we deliver compliant, hyper-targeted campaigns that drive unparalleled conversion.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed font-medium">
            For our publishers, we offer a dynamic wallet system powered by Paystack that turns idle digital real estate into an on-demand revenue stream, directly depositing earnings into their corporate accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: ShieldCheck, title: "Bank-Grade Compliance", desc: "Every campaign is vetted for financial regulations before delivery." },
            { icon: Target, title: "Segmented Precision", desc: "Target users by balance tiers, transaction behavior, and institutional loyalty." },
            { icon: Coins, title: "On-Demand Payouts", desc: "Publishers withdraw their ad revenue instantly via our Paystack infrastructure." },
            { icon: Lightning, title: "Raw SQL Speed", desc: "Our engine executes complex ad targeting queries in under 30ms." }
          ].map((feature, i) => (
            <div key={i} className="glass border border-gold-500/10 rounded-3xl p-8 hover:border-gold-500/30 transition-all group">
              <feature.icon size={48} className="text-gold-500 mb-6 group-hover:scale-110 transition-transform" weight="duotone" />
              <h3 className="text-xl font-black mb-3">{feature.title}</h3>
              <p className="text-gray-400 font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
