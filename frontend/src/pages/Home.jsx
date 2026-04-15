import React from 'react';
import { Link } from 'react-router-dom';
import { RocketLaunch, ArrowRight, ShieldCheck, Bank, Wallet, CreditCard, ChartLineUp, CurrencyBtc, Lightning, Briefcase, TrendUp, GlobeHemisphereWest } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';

const categories = [
  { id: 'commercial_bank', name: 'Commercial Bank', icon: Bank, desc: 'Highest premium segments.' },
  { id: 'neobank', name: 'Digital Neobank', icon: Lightning, desc: 'High-frequency transaction users.' },
  { id: 'credit_union', name: 'Credit Union Network', icon: ShieldCheck, desc: 'Highly loyal, community-based.' },
  { id: 'payment_gateway', name: 'Payment Gateway', icon: CreditCard, desc: 'B2B and B2C heavy throughput.' },
  { id: 'card_issuer', name: 'Credit Card Issuer', icon: CreditCard, desc: 'Revolving credit demographic.' },
  { id: 'crypto_exchange', name: 'Cryptocurrency Exchange', icon: CurrencyBtc, desc: 'High risk-tolerance investors.' },
  { id: 'digital_wallet', name: 'Digital Wallet Platform', icon: Wallet, desc: 'Young, mobile-first audiences.' },
  { id: 'lender', name: 'Personal Loan Lender', icon: Bank, desc: 'Active credit seekers.' },
  { id: 'mortgage', name: 'Mortgage & Refinancing', icon: Bank, desc: 'Long-term equity holders.' },
  { id: 'wealth', name: 'Wealth Management', icon: ChartLineUp, desc: 'UHNW and HNW individuals.' }
];

const Home = () => {
  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow pt-32 px-4 md:px-0">
        <div className="max-w-7xl mx-auto text-center z-10 py-24 border-b border-gold-500/10">
          <div className="inline-block mb-6 px-5 py-2 rounded-full glass border border-gold-500/20 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase">
            The Financial Advertising Standard
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-tight text-white">
            Prestige <span className="text-gold-gradient">Precision</span><br/> in Banking Ads
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Harness the power of elite segments. Deliver high-conversion, deeply-compliant advertisements across premium financial platforms with raw SQL speed and Neon reliability.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/register" className="px-10 py-5 rounded-full btn-gold text-lg flex items-center justify-center gap-2 group">
              Start Enterprise Campaign <RocketLaunch size={24} weight="bold" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link to="/pricing" className="px-10 py-5 rounded-full glass text-gold-400 text-lg font-bold hover:bg-gold-500/5 transition-all border-gold flex items-center justify-center gap-2">
              View Pricing Tiers <ArrowRight size={24} weight="bold" />
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {['99.99%', '< 20ms', 'Elite', 'Live'].map((val, i) => (
              <div key={i} className="group cursor-default">
                <h4 className="text-5xl font-black text-white mb-3 group-hover:text-gold-500 transition-colors">{val}</h4>
                <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">{['Uptime SLA', 'Latency', 'Targeting', 'Analytics'][i]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Value Proposition (UVP) */}
        <section className="py-24 border-b border-gold-500/10">
          <div className="max-w-7xl mx-auto px-4 md:px-0">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4">Why Choose <span className="text-gold-gradient">BankAds?</span></h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Traditional ad networks guess intent. We utilize hard deterministic financial behavior, segmenting users safely without exposing PII.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-10 rounded-[2rem] border border-gold-500/20 group hover:border-gold-500/50 transition-colors">
                <ShieldCheck size={48} className="text-gold-500 mb-6 group-hover:rotate-12 transition-transform" weight="duotone" />
                <h3 className="text-2xl font-black mb-4">Financial Grade Compliance</h3>
                <p className="text-gray-400 leading-relaxed font-medium">All campaigns undergo rigorous programmatic compliance checking, ensuring ad delivery meets federal and international bank marketing strictures.</p>
              </div>
              <div className="glass-card p-10 rounded-[2rem] border border-gold-500/20 group hover:border-gold-500/50 transition-colors">
                <GlobeHemisphereWest size={48} className="text-gold-500 mb-6 group-hover:-rotate-12 transition-transform" weight="duotone" />
                <h3 className="text-2xl font-black mb-4">Universal Infrastructure</h3>
                <p className="text-gray-400 leading-relaxed font-medium">Our API serves ads to diverse endpoints: USSD menus, ATM screens, deep Neobank mobile apps, and enterprise wealth management dashboards.</p>
              </div>
              <div className="glass-card p-10 rounded-[2rem] border border-gold-500/20 group hover:border-gold-500/50 transition-colors">
                <TrendUp size={48} className="text-gold-500 mb-6 group-hover:scale-110 transition-transform" weight="duotone" />
                <h3 className="text-2xl font-black mb-4">Deterministic ROI</h3>
                <p className="text-gray-400 leading-relaxed font-medium">Stop hunting for lookalike audiences. Target precisely based on true user behavior patterns securely anonymized through our banking integrations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-24 border-b border-gold-500/10 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="max-w-7xl mx-auto px-4 md:px-0 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-8">Who We <span className="text-gold-500">Are</span></h2>
            <div className="max-w-4xl mx-auto glass p-10 md:p-14 rounded-[3rem] border border-gold-500/30 shadow-[0_0_50px_rgba(212,175,55,0.05)]">
              <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed mb-8">
                BankAds Prestige Engine was forged from a strategic collaboration between industry titans to solve the ultimate B2B advertising bottleneck inside secure financial ecosystems.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-12 mt-12">
                <div>
                  <h4 className="text-white font-black text-2xl tracking-tight">Ko9d Ltd</h4>
                  <p className="text-gold-500 font-bold tracking-widest text-sm uppercase">King David Uchenna</p>
                </div>
                <div className="h-12 w-px bg-gold-500/30 hidden md:block"></div>
                <div>
                  <h4 className="text-white font-black text-2xl tracking-tight">WidLtd</h4>
                  <p className="text-gold-500 font-bold tracking-widest text-sm uppercase">Ike Wisdom</p>
                </div>
              </div>
              <div className="mt-12">
                <Link to="/company" className="text-gold-400 font-bold hover:text-white transition-colors uppercase tracking-widest text-sm underline decoration-gold-500/30 underline-offset-8">Read the Full Story</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Publisher Categories & Signup Call */}
        <section className="py-24 bg-gradient-to-b from-transparent to-gold-500/5 border-b border-gold-500/20">
          <div className="max-w-7xl mx-auto px-4 md:px-0 text-center">
            <div className="mb-16">
              <span className="text-gold-500 font-black tracking-widest uppercase text-sm mb-2 block">For Network Partners</span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Monetize Your <span className="text-gold-gradient">Platform</span></h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium">Join thousands of verified financial institutions generating risk-free, passive revenue via on-demand Paystack integrations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
              {categories.map((cat, i) => (
                <div key={i} className="glass border border-gold-500/10 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-gold-500/10 hover:border-gold-500/30 transition-all cursor-default">
                  <cat.icon size={36} className="text-gold-500 mb-4" weight="duotone" />
                  <h3 className="font-bold text-white text-sm mb-2">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.desc}</p>
                </div>
              ))}
            </div>

            <Link to="/publishers/join" className="inline-flex btn-gold px-12 py-5 rounded-full text-black font-black text-lg tracking-wide items-center justify-center gap-3 shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform">
              <Briefcase size={24} weight="bold" /> BECOME A PUBLISHER
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;
