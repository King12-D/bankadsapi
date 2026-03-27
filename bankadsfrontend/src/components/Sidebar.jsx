import React from 'react';
import { 
  BarChart3, 
  LayoutDashboard, 
  PlusSquare, 
  Settings, 
  Key, 
  CreditCard,
  LogOut,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <PlusSquare size={20} />, label: 'Campaigns', active: false },
    { icon: <BarChart3 size={20} />, label: 'Analytics', active: false },
    { icon: <Key size={20} />, label: 'API Keys', active: false },
    { icon: <CreditCard size={20} />, label: 'Subscriptions', active: false },
    { icon: <Settings size={20} />, label: 'Settings', active: false },
  ];

  return (
    <aside className="sidebar glass" style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      borderRight: '1px solid var(--glass-border)',
      zIndex: 1000
    }}>
      <div className="logo-container" style={{ marginBottom: '40px', padding: '0 8px' }}>
        <h1 className="text-gold-gradient" style={{ fontSize: '24px', letterSpacing: '2px' }}>KO9D</h1>
        <p style={{ fontSize: '10px', color: 'var(--gold-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Bank Ads Engine</p>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {menuItems.map((item, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>
              <button style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: item.active ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                color: item.active ? 'var(--gold-secondary)' : 'var(--text-white)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                position: 'relative',
                textAlign: 'left'
              }}>
                <span style={{ color: item.active ? 'var(--gold-primary)' : 'inherit' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: item.active ? '600' : '400' }}>{item.label}</span>
                {item.active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
          border: 'none',
          background: 'transparent',
          color: '#ff4b4b',
          cursor: 'pointer',
          transition: 'var(--transition-smooth)'
        }}>
          <LogOut size={20} />
          <span style={{ fontSize: '14px' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
