import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blobs from '../components/Blobs';
import { useAuth } from '../context/AuthContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  TrendUp, 
  Users, 
  CursorClick, 
  Lightning, 
  Broadcast,
  ShieldCheck,
  Plus,
  Wallet
} from '@phosphor-icons/react';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [
          fetch('/api/v1/ads/analytics', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/v1/apikeys', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/v1/wallet', { headers: { 'Authorization': `Bearer ${token}` } })
        ];

        if (user?.role === 'admin') {
          promises.push(fetch('/api/v1/admin/messages', { headers: { 'Authorization': `Bearer ${token}` } }));
        }

        const responses = await Promise.all(promises);
        
        const statsData = await responses[0].json();
        const keysData = await responses[1].json();
        const walletData = await responses[2].json();
        
        setStats(statsData);
        setApiKeys(keysData);
        setWalletBalance(walletData.balance || 0);

        if (user?.role === 'admin' && responses[3]) {
          const msgs = await responses[3].json();
          setContactMessages(msgs);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, user]);

  const handleFundWallet = async () => {
    const amountStr = prompt("Enter amount to fund in NGN (e.g. 10000):");
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) return alert("Invalid amount.");

    try {
      const res = await fetch("/api/v1/wallet/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url; // Redirect to Paystack
      } else {
        alert("Failed to initialize payment: " + data.error);
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleWithdraw = async () => {
    if (walletBalance < 10000) {
      return alert("Insufficient funds. Minimum withdrawal is NGN 10,000.");
    }
    
    const confirm = window.confirm("Are you sure you want to withdraw your entire available balance?");
    if (!confirm) return;

    try {
      const res = await fetch("/api/v1/wallet/withdraw", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert("Withdrawal successfully processed!");
        setWalletBalance(0);
      } else {
        alert("Withdrawal failed: " + data.error);
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const chartData = {
    labels: stats?.impressions?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Daily Impressions',
        data: stats?.impressions?.data || [12000, 19000, 15000, 22000, 18000, 25000, 30000],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        tension: 0.4,
        pointBackgroundColor: '#D4AF37',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#050505',
        titleColor: '#D4AF37',
        bodyColor: '#fff',
        borderColor: 'rgba(212, 175, 55, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      }
    },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'rgba(255, 255, 255, 0.5)' } },
      x: { grid: { display: false }, ticks: { color: 'rgba(255, 255, 255, 0.5)' } },
    },
  };

  return (
    <div className="antialiased min-h-screen relative flex flex-col bg-black-pure text-white overflow-hidden">
      <Blobs />
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 z-10 max-w-7xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-2 w-2 rounded-full bg-gold-500 animate-pulse shadow-[0_0_10px_#D4AF37]"></span>
              <span className="text-gold-500 text-xs font-black tracking-widest uppercase">Live Prestige Engine</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Hello, <span className="text-gold-gradient">{user?.name || 'Partner'}</span>
            </h1>
          </div>
          <button className="btn-gold px-8 py-4 rounded-2xl flex items-center gap-2 group text-sm">
            <Plus size={20} weight="bold" />
            <span>CREATE NEW CAMPAIGN</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Impressions', val: '248.5k', icon: Broadcast, color: 'text-gold-500', trend: '+12.5%' },
            { label: 'Click Rate (CTR)', val: '5.24%', icon: CursorClick, color: 'text-gold-500', trend: '+0.8%' },

            { label: 'Active Keys', val: apiKeys.length || '2', icon: ShieldCheck, color: 'text-gold-500', trend: 'Stable' },
            { label: 'Avg Latency', val: '18ms', icon: Lightning, color: 'text-gold-500', trend: '-2ms' }
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-3xl p-8 group border border-gold-500/10 hover:border-gold-500/30">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-gold-500/10 ${stat.color} border border-gold-500/10 group-hover:bg-gold-500/20 group-hover:border-gold-500/30 transition-all shadow-[0_0_20px_rgba(212,175,55,0.05)]`}>
                  <stat.icon size={24} weight="fill" />
                </div>
                {stat.trend.startsWith('+') && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full">{stat.trend}</span>}
              </div>
              <p className="text-gray-500 text-xs font-black tracking-widest uppercase mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">{stat.val}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart */}
          <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-8 md:p-12 border border-gold-500/10">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black text-white">Ad Performance</h3>
                <p className="text-gray-500 font-medium">Delivery stats across all premium segments</p>
              </div>
              <div className="flex gap-2">
                {['Day', 'Week', 'Month'].map((p) => (
                  <button key={p} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${p === 'Week' ? 'bg-gold-500 text-black' : 'text-gray-400 hover:text-white'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div className="h-[350px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Side Panel: API Keys */}
          <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-gold-500/10">
            <h3 className="text-2xl font-black text-white mb-8">Active API Keys</h3>
            <div className="space-y-6">
              {loading ? (
                <div className="text-gray-500 text-sm font-medium animate-pulse">Requesting secure data...</div>
              ) : apiKeys.length > 0 ? (
                apiKeys.map((key, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/20 transition-all flex justify-between items-center group">
                    <div>
                      <p className="text-white font-bold mb-1">{key.bankName || 'Partner Bank'}</p>
                      <p className="text-gray-500 font-mono text-[10px] tracking-tight">{key.apiKey.substring(0, 10)}••••••••••••••••</p>
                    </div>
                    <div className="text-gold-500 opacity-20 group-hover:opacity-100 transition-opacity">
                      <ShieldCheck size={24} weight="duotone" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-30">
                  <Broadcast size={48} className="mx-auto mb-4" />
                  <p className="text-sm font-bold tracking-widest uppercase">No Active Keys</p>
                </div>
              )}
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl border border-gold-500/20 text-gold-500 font-black text-xs tracking-widest uppercase hover:bg-gold-500/10 transition-all">
              Request New Key
            </button>
          </div>
        </div>

        {/* Financial Hub */}
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border-gold-500/30 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={20} className="text-gold-500" />
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Available Balance</h3>
              </div>
              <h2 className="text-5xl font-black text-white">NGN {walletBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
              <p className="text-sm text-gray-500 mt-2 font-medium">Auto-deducted for active campaigns. Publishers earn here.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <button 
                onClick={handleFundWallet}
                className="px-8 py-4 rounded-2xl btn-gold text-black font-black flex items-center justify-center gap-2"
              >
                <Plus size={20} weight="bold" /> FUND WALLET
              </button>
              <button 
                onClick={handleWithdraw}
                className="px-8 py-4 rounded-2xl glass text-gold-500 font-black flex items-center justify-center gap-2 hover:bg-white/5 transition-all border border-gold-500/20"
              >
                WITHDRAW REVENUE
              </button>
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="mt-10 pt-8 border-t border-gold-500/10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl">
                <div>
                  <h4 className="text-white font-bold mb-1">Finance Settings</h4>
                  <p className="text-xs text-gray-500">Configure global revenue splits.</p>
                </div>
                <button className="px-6 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold uppercase tracking-widest transition-colors mb-auto">
                  Configure
                </button>
              </div>

              <div className="bg-black/40 p-6 rounded-2xl max-h-[300px] overflow-y-auto">
                <h4 className="text-white font-bold mb-4">Support Queries ({contactMessages.length})</h4>
                <div className="space-y-4">
                  {contactMessages.map((msg, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                       <p className="text-sm text-white font-bold">{msg.subject} <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ml-2 ${msg.status === 'unread' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{msg.status}</span></p>
                       <p className="text-xs text-gold-500">{msg.name} ({msg.email})</p>
                       <p className="text-xs text-gray-400 mt-2 line-clamp-2">{msg.message}</p>
                    </div>
                  ))}
                  {contactMessages.length === 0 && <p className="text-xs text-gray-600">No support queries found.</p>}
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
