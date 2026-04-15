import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Buildings, Envelope, Lock, UserPlus, Spinner } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import Blobs from '../components/Blobs';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'pro'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('Server connection error. Ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="antialiased min-h-screen relative flex flex-col justify-center items-center py-12 bg-brand-dark">
      <Blobs />

      <Link to="/" className="absolute top-8 left-8 hidden md:flex items-center gap-2 z-50">
        <div className="h-10 w-10 bg-brand-400/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)] border border-brand-400/30 text-brand-400">
          <UserPlus size={24} weight="bold" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">Bank<span className="text-brand-400">Ads</span></span>
      </Link>

      <main className="w-full max-w-lg px-4 z-10">
        <div className="glass-card rounded-3xl p-8 md:p-10 w-full relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Start delivering targeted bank ads</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bank / Organization Name</label>
              <div className="relative">
                <Buildings className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className="glass-input w-full rounded-xl py-3 pl-12 pr-4" 
                  placeholder="ACME Bank Plc" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Work Email Address</label>
              <div className="relative">
                <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className="glass-input w-full rounded-xl py-3 pl-12 pr-4" 
                  placeholder="admin@bank.com" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input 
                  type="password" 
                  id="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  className="glass-input w-full rounded-xl py-3 pl-12 pr-4" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Plan</label>
              <select 
                id="plan" 
                value={formData.plan}
                onChange={handleChange}
                className="glass-input w-full rounded-xl py-3 px-4 appearance-none" 
                style={{backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="%239ca3af"><path d="M6 9l6 6 6-6"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center'}}
              >
                <option value="basic" className="bg-gray-800 text-white">Basic (NGN 15,000/mo)</option>
                <option value="pro" className="bg-gray-800 text-white">Pro (NGN 75,000/mo)</option>
                <option value="enterprise" className="bg-gray-800 text-white">Enterprise (Custom)</option>
              </select>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full btn-primary text-white py-4 rounded-xl font-medium tracking-wide flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <Spinner className="animate-spin text-xl" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <UserPlus size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Already have an account? <Link to="/login" className="text-brand-400 font-medium hover:text-brand-500 transition-colors">Sign In</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
