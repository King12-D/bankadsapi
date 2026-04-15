import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { CaretDown } from '@phosphor-icons/react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      category: "Funding & Wallet",
      items: [
        {
          q: "My wallet balance hasn't updated after a successful Paystack transfer.",
          a: "Paystack processing is usually instant, but inter-bank settlements can take up to 2 hours. If your balance hasn't reflected after 2 hours, please check your Dashboard's 'Transactions' logs or contact support with your Paystack Reference ID."
        },
        {
          q: "What happens if my wallet reaches zero during a live campaign?",
          a: "Our Engine checks your balance before answering any API call. If your balance is zero, the engine instantly returns a 'No Ad Available' (404) response ensuring you are never over-charged. Your campaigns freeze until the wallet is replenished."
        },
        {
          q: "How does the Pay-As-You-Go pricing model actually work?",
          a: "Advertisers preload their virtual wallets using cards or transfers. Every time the API successfully delivers an ad impression to a targeted user, your wallet is deducted securely based on the Priority tier. You only pay for confirmed impressions."
        }
      ]
    },
    {
      category: "Publisher & Payouts",
      items: [
        {
          q: "When do publishers get paid?",
          a: "Earnings accrue in real-time as your app serves ads. Once your publisher wallet exceeds the minimum NGN 10,000 threshold, you can trigger an On-Demand withdrawal directly to your registered corporate bank account in seconds."
        },
        {
          q: "How is the revenue split calculated?",
          a: "The split is regulated dynamically. A large majority of ad spending goes directly to the publisher serving the ad. The platform retains a minor static percentage for routing infrastructure and Redis caching costs."
        },
        {
          q: "What types of publishers can join the network?",
          a: "We only authorize verified financial institutions: Commercial Banks, Neobanks, Payment Gateways, Crypto Exchanges, ATM networks, and Wealth Management platforms. You must pass Know Your Business (KYB) compliance."
        }
      ]
    },
    {
      category: "Technical Integration",
      items: [
        {
          q: "I'm receiving a 403 Forbidden 'Subscription inactive' error.",
          a: "This occurs if your API key has been paused due to policy violations, or if you are on a restricted legacy plan. Verify your API key status from the Dashboard. If the issue persists, trigger an API rotated key."
        },
        {
          q: "Can I use BankAds on low-bandwidth ATM networks?",
          a: "Absolutely. Our API response is extremely lightweight, delivering core JSON payloads under 18ms latency, heavily optimized for USSD menus, ATM screens, and traditional POS devices."
        },
        {
          q: "Is there a Sandbox environment for testing?",
          a: "Yes! Creating an account grants you access to our Free Sandbox tier. You will receive a Sandbox API key that simulates ad serving without deducting any NGN balance, allowing safe CI/CD pipeline integration."
        }
      ]
    }
  ];

  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            Help <span className="text-gold-gradient">Center</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium">Clear answers for complex financial advertising.</p>
        </div>

        <div className="space-y-12">
          {faqs.map((cat, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-black text-gold-500 mb-6 uppercase tracking-widest">{cat.category}</h2>
              <div className="space-y-4">
                {cat.items.map((faq, itemIndex) => {
                  const uniqueIndex = `${categoryIndex}-${itemIndex}`;
                  return (
                    <div 
                      key={uniqueIndex} 
                      className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${openIndex === uniqueIndex ? 'border-gold-500/50' : 'border-gold-500/10 hover:border-gold-500/30'}`}
                      onClick={() => setOpenIndex(openIndex === uniqueIndex ? null : uniqueIndex)}
                    >
                      <div className="p-6 md:p-8 flex justify-between items-center">
                        <h3 className={`text-lg font-bold pr-8 ${openIndex === uniqueIndex ? 'text-gold-400' : 'text-white'}`}>
                          {faq.q}
                        </h3>
                        <CaretDown 
                          size={24} 
                          className={`text-gold-500 transition-transform duration-300 flex-shrink-0 ${openIndex === uniqueIndex ? 'rotate-180' : ''}`} 
                        />
                      </div>
                      <div 
                        className={`px-6 md:px-8 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === uniqueIndex ? 'max-h-[500px] opacity-100 pb-8' : 'max-h-0 opacity-0 pb-0'}`}
                      >
                        <p className="text-gray-400 font-medium leading-relaxed border-t border-gold-500/10 pt-6">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 font-medium mb-6">Need technical support or API documentation?</p>
          <a href="/contact" className="btn-gold px-8 py-4 rounded-full font-bold inline-block shadow-lg">Contact Technical Support</a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
