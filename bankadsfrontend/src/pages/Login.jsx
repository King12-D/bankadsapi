import React from 'react';

const Login = () => {
  return (
    <div className="login-page" style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #111 0%, #050505 100%)'
    }}>
      <div className="glass-card" style={{
        padding: '48px',
        width: '100%',
        maxWidth: '440px',
        textAlign: 'center'
      }}>
        <div className="logo-container" style={{ marginBottom: '32px' }}>
          <h1 className="text-gold-gradient" style={{ fontSize: '42px', letterSpacing: '4px' }}>KO9D</h1>
          <p style={{ fontSize: '12px', color: 'var(--gold-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '8px' }}>Customer-Aware Advertising</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', color: 'var(--gold-primary)', marginBottom: '8px', display: 'block', fontWeight: '600' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              placeholder="admin@ko9d.com" 
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', color: 'var(--gold-primary)', marginBottom: '8px', display: 'block', fontWeight: '600' }}>PASSWORD</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <button className="btn-gold" style={{ marginTop: '12px', padding: '16px' }}>
            Sign In to Dashboard
          </button>

          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
            Forgot password? <span style={{ color: 'var(--gold-primary)', cursor: 'pointer' }}>Reset here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
