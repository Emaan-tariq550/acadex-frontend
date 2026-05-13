import React from 'react';

export const Card = ({ children, style = {}, className = '' }) => (
  <div className={className} style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '20px',
    ...style
  }}>
    {children}
  </div>
);

export const StatCard = ({ icon: Icon, label, value, color, change }) => (
  <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: `${color}20`, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '26px', fontWeight: '700', lineHeight: 1 }}>{value}</div>
      {change && (
        <div style={{ fontSize: '12px', color: change >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '4px' }}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% this month
        </div>
      )}
    </div>
  </div>
);