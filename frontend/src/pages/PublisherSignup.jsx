import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Bank, Wallet, CreditCard, ChartLineUp, CurrencyBtc, Spinner, ArrowRight, Lightning } from '@phosphor-icons/react';
import Blobs from '../components/Blobs';

const categories = [
  { id: 'commercial_bank', name: 'Commercial Bank', icon: Bank },
  { id: 'neobank', name: 'Digital Neobank', icon: Lightning }, // Need to import Lightning, using Bank/Phone equivalent for now. Let's use available imports. 
  { id: 'credit_union', name: 'Credit Union Network', icon: ShieldCheck },
  { id: 'payment_gateway', name: 'Payment Gateway', icon: CreditCard },
  { id: 'card_issuer', name: 'Credit Card Issuer', icon: CreditCard },
  { id: 'crypto_exchange', name: 'Cryptocurrency Exchange', icon: CurrencyBtc },
  { id: 'digital_wallet', name: 'Digital Wallet Platform', icon: Wallet },
  { id: 'lender', name: 'Personal Loan Lender', icon: Bank },
  { id: 'mortgage', name: 'Mortgage & Refinancing', icon: Bank },
  { id: 'wealth', name: 'Wealth Management', icon: ChartLineUp }
];

const PublisherSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    category: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In a real scenario, this connects to an auth endpoint that registers a publisher
    setTimeout(() => {
      setIsSubmitting(false);
      // For demo, just redirect to login
      navigate('/login?registered=true');
    }, 2000);
  };

  return (
    <div className="antialiased min-h-screen relative flex flex-col justify-center items-center bg-black-pure text-white py-12 px-4">
      <Blobs />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group z-50">
        <div className="h-10 w-10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <img src="/logo.png" alt="BankAds Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">Bank<span className="text-gold-500">Ads</span> Prestige</span>
      </Link>

      <main className="w-full max-w-2xl z-10">
        <div className="glass-card rounded-[2.5rem] p-10 md:p-14 border-gold">
          
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black text-white mb-2">Publisher Onboarding</h2>
            <p className="text-gray-400 font-medium">Monetize your financial app's digital real estate.</p>
            
            <div className="flex gap-2 justify-center mt-8">
              <div className={`h-1.5 w-12 rounded-full ${step >= 1 ? 'bg-gold-500 transition-colors' : 'bg-white/10'}`}></div>
              <div className={`h-1.5 w-12 rounded-full ${step >= 2 ? 'bg-gold-500 transition-colors' : 'bg-white/10'}`}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Institution Type</label>
                  <p className="text-sm text-gray-500 mb-4">Select the category that best describes your financial service. This determines your ad targeting profile.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {categories.map((cat) => (
                      <div 
                        key={cat.id}
                        onClick={() => setFormData({...formData, category: cat.id})}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${formData.category === cat.id ? 'border-gold-500 bg-gold-500/10 text-white' : 'border-gold-500/10 bg-black/50 text-gray-400 hover:border-gold-500/40'}`}
                      >
                        <cat.icon size={24} weight={formData.category === cat.id ? "duotone" : "regular"} className={formData.category === cat.id ? "text-gold-500" : ""} />
                        <span className="font-bold text-sm leading-tight">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  type="button" 
                  disabled={!formData.category}
                  onClick={handleNext}
                  className="w-full btn-gold text-black py-4 rounded-2xl font-black text-lg tracking-wide flex justify-center items-center gap-2 disabled:opacity-50 mt-8"
                >
                  CONTINUE <ArrowRight size={20} weight="bold" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Corporate Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="glass-input w-full rounded-2xl py-4 px-6 text-lg" 
                    placeholder="e.g. Zenith Bank Plc" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Admin Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="glass-input w-full rounded-2xl py-4 px-6 text-lg" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Work Email</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="glass-input w-full rounded-2xl py-4 px-6 text-lg" 
                      placeholder="admin@zenith.com" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Master Password</label>
                  <input 
                    type="password" 
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="glass-input w-full rounded-2xl py-4 px-6 text-lg" 
                    placeholder="••••••••" 
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={handleBack}
                    className="flex-1 glass py-4 rounded-2xl text-white font-bold hover:bg-white/5 transition-colors border border-white/10"
                  >
                    BACK
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[2] btn-gold text-black py-4 rounded-2xl font-black text-lg tracking-wide flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? <Spinner className="animate-spin text-2xl" /> : 'SUBMIT APPLICATION'}
                  </button>
                </div>
                <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
                  By submitting, you agree to our strict KYC and Compliance policies. Access is granted only after manual verification.
                </p>
              </div>
            )}
          </form>
        </div>
      </main>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  );
};

export default PublisherSignup;
