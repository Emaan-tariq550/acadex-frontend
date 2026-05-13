import React from 'react';

const variants = {
  primary: { background: 'var(--primary)', color: 'white', border: 'none' },
  secondary: { background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
  danger: { background: 'var(--danger)', color: 'white', border: 'none' },
  ghost: { background: 'transparent', color: 'var(--text-secondary)', border: 'none' },
  success: { background: 'var(--success)', color: 'white', border: 'none' },
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: '13px', borderRadius: '6px' },
  md: { padding: '9px 18px', fontSize: '14px', borderRadius: '8px' },
  lg: { padding: '12px 24px', fontSize: '15px', borderRadius: '10px' },
};

export default function Button({
  children, variant = 'primary', size = 'md',
  onClick, disabled, loading, icon: Icon, style = {}, type = 'button', fullWidth
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...variants[variant],
        ...sizes[size],
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '500',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s',
        width: fullWidth ? '100%' : 'auto',
        justifyContent: 'center',
        ...style
      }}
    >
      {loading ? (
        <span style={{
          width: '14px', height: '14px', border: '2px solid currentColor',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.6s linear infinite', display: 'inline-block'
        }} />
      ) : Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}