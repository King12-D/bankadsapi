import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Envelope, Lock, SignIn, Spinner } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import Blobs from '../components/Blobs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="antialiased min-h-screen relative flex flex-col justify-center items-center bg-black-pure">
      <Blobs />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group z-50">
        <div className="h-10 w-10 bg-gold-500/20 rounded-full flex items-center justify-center border border-gold-500/30 text-gold-500 group-hover:scale-110 transition-transform">
          <SignIn size={24} weight="bold" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">Bank<span className="text-gold-500">Ads</span></span>
      </Link>

      <main className="w-full max-w-lg px-4 z-10">
        <div className="glass-card rounded-[2rem] p-10 md:p-14 w-full border-gold">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white mb-3">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Access the Bank Ads Prestige Engine</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl p-4 mb-8 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Work Email</label>
              <div className="relative">
                <Envelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500/60 text-xl" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="glass-input w-full rounded-2xl py-4 pl-14 pr-6 text-lg focus:border-gold-500" 
                  placeholder="admin@bank.com" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Secret Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500/60 text-xl" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="glass-input w-full rounded-2xl py-4 pl-14 pr-6 text-lg focus:border-gold-500" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-500 hover:text-white cursor-pointer transition-colors font-medium">
                <input type="checkbox" className="mr-3 rounded border-gold-500/30 bg-transparent text-gold-500 focus:ring-gold-500/50 h-5 w-5" />
                Lock Session
              </label>
              <a href="#" className="text-gold-500 hover:text-gold-400 transition-colors font-bold">Lost Access?</a>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full btn-gold text-black py-5 rounded-2xl font-black text-lg tracking-wide flex justify-center items-center gap-3 disabled:opacity-70 shadow-2xl"
            >
              {isSubmitting ? (
                <Spinner className="animate-spin text-2xl" />
              ) : (
                <>
                  <span>AUTHENTICATE</span>
                  <SignIn size={24} weight="bold" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 font-medium">
            New to the Engine? <Link to="/register" className="text-gold-500 font-black hover:text-gold-400 transition-colors">Apply for Access</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
