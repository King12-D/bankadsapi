import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target } from '@phosphor-icons/react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-nav fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="BankAds Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors">
              Bank<span className="text-gold-500">Ads</span>
            </span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link to="/" className="text-gray-400 hover:text-gold-400 transition-colors font-medium">Home</Link>
              <Link to="/pricing" className="text-gray-400 hover:text-gold-400 transition-colors font-medium">Pricing</Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors font-medium">Dashboard</Link>
                  <button 
                    onClick={handleLogout}
                    className="px-6 py-2.5 rounded-full btn-gold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors font-medium">Login</Link>
                  <Link to="/register" className="px-6 py-2.5 rounded-full btn-gold shadow-lg">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
