import React from 'react';

const GlassCard = ({ children, title, subtitle, style, className }) => {
  return (
    <div className={`glass-card ${className || ''}`} style={{
      padding: '24px',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      ...style
    }}>
      {(title || subtitle) && (
        <div className="card-header" style={{ marginBottom: '16px' }}>
          {title && <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gold-secondary)' }}>{title}</h3>}
          {subtitle && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{subtitle}</p>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
