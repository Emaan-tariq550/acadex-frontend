import React from 'react';

export default function Input({
  label, type = 'text', value, onChange, placeholder,
  error, required, icon: Icon, name, disabled, helpText
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block', fontSize: '13px', fontWeight: '500',
          color: 'var(--text-secondary)', marginBottom: '6px'
        }}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)',
            pointerEvents: 'none'
          }}>
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            padding: Icon ? '10px 14px 10px 40px' : '10px 14px',
            borderRadius: '8px',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.15s',
            opacity: disabled ? 0.6 : 1,
          }}
          onFocus={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
        />
      </div>
      {error && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{error}</div>}
      {helpText && !error && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{helpText}</div>}
    </div>
  );
}