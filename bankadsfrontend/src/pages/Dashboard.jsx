import React from 'react';
import GlassCard from '../components/GlassCard';
import { TrendingUp, Users, MousePointer2, Eye, Calendar } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Impressions', value: '1.2M', icon: <Eye size={20} />, trend: '+12.5%' },
    { label: 'Active Campaigns', value: '24', icon: <TrendingUp size={20} />, trend: '+3' },
    { label: 'Total Clicks', value: '84.2K', icon: <MousePointer2 size={20} />, trend: '+8.2%' },
    { label: 'Target Users', value: '450K', icon: <Users size={20} />, trend: '+15.4%' },
  ];

  return (
    <div className="dashboard-page">
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-white)' }}>
            Welcome back, <span className="text-gold-gradient">King David</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Here's what's happening with your bank ads today.</p>
        </div>
        <button className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} />
          <span>Last 30 Days</span>
        </button>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {stats.map((stat, index) => (
          <GlassCard key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: '600', padding: '4px 8px', borderRadius: '20px', background: 'rgba(74, 222, 128, 0.1)' }}>
                {stat.trend}
              </span>
            </div>
            <div style={{ marginTop: '16px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{stat.label}</p>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px', color: 'var(--text-white)' }}>{stat.value}</h3>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Section Placeholder */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <GlassCard title="Campaign Performance" subtitle="Ad impressions vs Clicks over time">
          <div style={{ height: '300px', width: '100%', border: '1px dashed rgba(212, 175, 55, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--gold-muted)' }}>Interactive Chart Visualization</p>
          </div>
        </GlassCard>
        
        <GlassCard title="Recent Campaigns" subtitle="Recently launched ad sets">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(45deg, #222, #444)' }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>{['Home Loan Promo', 'Credit Card Offer', 'Safe Banking'][i]}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Active • 4.2k impressions</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
