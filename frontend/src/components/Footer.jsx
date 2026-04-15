import React from 'react';
import { Target } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="z-10 bg-black-pure border-t border-gold-500/10 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 bg-gold-500/10 rounded flex items-center justify-center border border-gold-500/30 text-gold-500">
              <Target size={20} weight="fill" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Bank<span className="text-gold-500">Ads</span></span>
          </div>
          <p className="text-gray-500 text-sm max-w-sm font-medium leading-relaxed">
            The world's most elite banking advertisement engine. Delivering prestige content to premium segments with unconditional precision and security.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-black text-xs tracking-widest uppercase mb-6">Capabilities</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/capabilities" className="hover:text-gold-500 transition-colors cursor-pointer block">Overview</Link></li>
            <li><Link to="/targeting-engine" className="hover:text-gold-500 transition-colors cursor-pointer block">Targeting Engine</Link></li>
            <li><Link to="/security-suite" className="hover:text-gold-500 transition-colors cursor-pointer block">Security Suite</Link></li>
            <li><Link to="/analytics-cloud" className="hover:text-gold-500 transition-colors cursor-pointer block">Analytics Cloud</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="text-white font-black text-xs tracking-widest uppercase mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/company" className="hover:text-gold-500 transition-colors cursor-pointer block">Founders</Link></li>
            <li><Link to="/privacy" className="hover:text-gold-500 transition-colors cursor-pointer block">Privacy</Link></li>
            <li><Link to="/compliance" className="hover:text-gold-500 transition-colors cursor-pointer block">Compliance</Link></li>
            <li><Link to="/contact" className="hover:text-gold-500 transition-colors cursor-pointer block">Contact</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gold-500/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-600 text-xs font-bold tracking-widest uppercase">© 2024 BANK ADS PRESTIGE. ALL RIGHTS SECURED.</p>
        <div className="flex gap-8 text-gray-600 font-bold text-xs tracking-widest uppercase">
          <span className="hover:text-gold-500 cursor-pointer">Twitter</span>
          <span className="hover:text-gold-500 cursor-pointer">LinkedIn</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
