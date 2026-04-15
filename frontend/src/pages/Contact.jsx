import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { Envelope, Phone, MapPin, PaperPlaneTilt, Spinner } from '@phosphor-icons/react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message")
      };

      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Transmission failed. Please try again or use direct email.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            Contact <span className="text-gold-gradient">Operations</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            Dedicated support for enterprise advertisers and compliance inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border-gold h-full">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <PaperPlaneTilt size={40} className="text-green-500" weight="fill" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4">Transmission Sent</h3>
                <p className="text-gray-400 font-medium">An account executive will review your inquiry and respond within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-gold-500 font-bold hover:text-gold-400 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Name</label>
                    <input type="text" name="name" required className="glass-input w-full rounded-2xl py-4 px-6 text-lg" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Corporate Email</label>
                    <input type="email" name="email" required className="glass-input w-full rounded-2xl py-4 px-6 text-lg" placeholder="john@bank.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Subject / Inquiry Type</label>
                  <select name="subject" required className="glass-input w-full rounded-2xl py-4 px-6 text-lg appearance-none bg-transparent">
                    <option value="" disabled selected className="text-black">Select an option</option>
                    <option value="publisher" className="text-black">Publisher Onboarding</option>
                    <option value="advertiser" className="text-black">Enterprise Advertising</option>
                    <option value="technical" className="text-black">API / Technical Support</option>
                    <option value="compliance" className="text-black">Legal & Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Secure Message</label>
                  <textarea name="message" required rows="4" className="glass-input w-full rounded-2xl py-4 px-6 text-lg resize-none" placeholder="Provide details securely..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full btn-gold text-black py-4 rounded-2xl font-black text-lg tracking-wide flex justify-center items-center gap-3 disabled:opacity-70"
                >
                  {isSubmitting ? <Spinner className="animate-spin text-2xl" /> : 'TRANSMIT MSG'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="glass p-8 rounded-3xl border border-gold-500/10 flex items-start gap-6">
              <div className="p-4 bg-gold-500/10 rounded-2xl text-gold-500">
                <Envelope size={32} weight="duotone" />
              </div>
              <div>
                <h4 className="text-xl font-black mb-2">Secure Comms</h4>
                <p className="text-gray-400 mb-1">General: <a href="mailto:contact@bankads.com" className="text-white hover:text-gold-500 transition-colors">contact@bankads.com</a></p>
                <p className="text-gray-400">Technical: <a href="mailto:api@bankads.com" className="text-white hover:text-gold-500 transition-colors">api@bankads.com</a></p>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-gold-500/10 flex items-start gap-6">
              <div className="p-4 bg-gold-500/10 rounded-2xl text-gold-500">
                <Phone size={32} weight="duotone" />
              </div>
              <div>
                <h4 className="text-xl font-black mb-2">Emergency NOC</h4>
                <p className="text-gray-400 mb-1">For urgent API latency or downtime alerts.</p>
                <p className="text-white font-mono">+1 (800) BADS-NOC</p>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-gold-500/10 flex items-start gap-6">
              <div className="p-4 bg-gold-500/10 rounded-2xl text-gold-500">
                <MapPin size={32} weight="duotone" />
              </div>
              <div>
                <h4 className="text-xl font-black mb-2">Global HQ</h4>
                <p className="text-gray-400 leading-relaxed">
                  Financial District<br/>
                  New York, NY 10005<br/>
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
