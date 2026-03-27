import React from 'react';
import GlassCard from '../components/GlassCard';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const AdManager = () => {
  const campaigns = [
    { name: 'Summer Savings Promo', status: 'Active', reach: '45.2K', Budget: '₦50,000' },
    { name: 'Mortgage Low Interest', status: 'Pending', reach: '0', Budget: '₦120,000' },
    { name: 'Student Account Drive', status: 'Completed', reach: '12.8K', Budget: '₦30,000' },
  ];

  return (
    <div className="ad-manager-page">
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-white)' }}>Campaigns</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Create and manage your targeted advertisements.</p>
        </div>
        <button className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} />
          <span>New Campaign</span>
        </button>
      </header>

      {/* Toolbar */}
      <GlassCard style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input type="text" placeholder="Search campaigns..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 10px 10px 40px', color: '#fff', fontSize: '14px' }} />
          </div>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </GlassCard>

      {/* Campaigns Table & Preview Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <GlassCard>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '16px', fontSize: '14px', color: 'var(--gold-primary)' }}>CAMPAIGN</th>
                <th style={{ padding: '16px', fontSize: '14px', color: 'var(--gold-primary)' }}>STATUS</th>
                <th style={{ padding: '16px', fontSize: '14px', color: 'var(--gold-primary)' }}>BUDGET</th>
                <th style={{ padding: '16px', fontSize: '14px', color: 'var(--gold-primary)' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp, idx) => (
                <tr key={idx} style={{ borderBottom: idx < campaigns.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{camp.name}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      background: camp.status === 'Active' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255,255,255,0.05)',
                      color: camp.status === 'Active' ? '#4ade80' : 'rgba(255,255,255,0.5)'
                    }}>
                      {camp.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{camp.Budget}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      <Edit2 size={16} style={{ cursor: 'pointer' }} />
                      <Trash2 size={16} style={{ cursor: 'pointer' }} />
                      <MoreVertical size={16} style={{ cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <GlassCard title="Live Preview" subtitle="ATM Screen View (1024x768)">
          <div style={{ 
            aspectRatio: '4/3', 
            background: '#000', 
            borderRadius: '8px', 
            border: '4px solid #333',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', color: '#fff', fontSize: '10px' }}>EXIT [X]</div>
            <div style={{ width: '100%', height: '60%', background: 'linear-gradient(45deg, #111, #222)', borderRadius: '4px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={48} style={{ color: 'var(--gold-muted)' }} />
            </div>
            <h4 style={{ color: 'var(--gold-secondary)', fontSize: '18px', textAlign: 'center' }}>SUMMER SAVINGS PROMO</h4>
            <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>Open a new savings account today and get 5% cashback on your first deposit!</p>
            <button style={{ marginTop: '15px', background: 'var(--gold-primary)', color: '#000', border: 'none', padding: '8px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>LEARN MORE</button>
          </div>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '12px', textAlign: 'center' }}>Simulation of public terminal rendering engine</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdManager;
