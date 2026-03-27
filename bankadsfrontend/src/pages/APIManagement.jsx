import React from 'react';
import GlassCard from '../components/GlassCard';
import { Key, Copy, RefreshCw, Smartphone, Globe, Monitor, Zap } from 'lucide-react';

const APIManagement = () => {
  const apiKeys = [
    { name: 'ATM Terminal SDK', key: 'pk_live_********************8a2', created: '2026-01-15' },
    { name: 'Mobile App Integration', key: 'pk_live_********************f4e', created: '2026-02-10' },
  ];

  return (
    <div className="api-management-page">
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-white)' }}>API & Integration</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Manage your API keys and Interswitch-linked subscriptions.</p>
        </div>
        <button className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} />
          <span>Upgrade Plan</span>
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Subscription Info */}
        <GlassCard title="Current Subscription" subtitle="Interswitch Pro Plan">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '24px', color: 'var(--gold-secondary)', marginBottom: '4px' }}>₦250,000 <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>/ year</span></h4>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Next billing: April 20, 2026</p>
            </div>
            <span style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)', fontSize: '12px', fontWeight: '600' }}>Active</span>
          </div>
          <div style={{ marginTop: '24px' }}>
            <p style={{ fontSize: '13px', marginBottom: '8px' }}>API Usage (15,204 / 50,000 requests)</p>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: '30%', height: '100%', background: 'var(--gold-primary)', borderRadius: '10px' }}></div>
            </div>
          </div>
        </GlassCard>

        {/* Platform Targets */}
        <GlassCard title="Platform Integration" subtitle="Connected delivery endpoints">
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { icon: <Monitor />, label: 'ATM', active: true },
              { icon: <Smartphone />, label: 'Mobile', active: true },
              { icon: <Globe />, label: 'Web', active: false },
            ].map((p, i) => (
              <div key={i} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: p.active ? 1 : 0.5 }}>
                <div style={{ color: p.active ? 'var(--gold-primary)' : 'rgba(255,255,255,0.3)' }}>{p.icon}</div>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>{p.label}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* API Keys Table */}
      <GlassCard title="API Access Keys" subtitle="Use these keys to authenticate requests from your endpoints">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {apiKeys.map((item, idx) => (
            <div key={idx} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)' }}>
                  <Key size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', marginTop: '4px' }}>{item.key}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><Copy size={16} /></button>
                <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><RefreshCw size={16} /></button>
              </div>
            </div>
          ))}
          <button style={{ alignSelf: 'flex-start', marginTop: '8px', background: 'transparent', border: '1px dashed var(--gold-muted)', color: 'var(--gold-primary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            + Generate New API Key
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default APIManagement;
