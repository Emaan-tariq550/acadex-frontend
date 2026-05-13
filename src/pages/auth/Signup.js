import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const user = await signup(form);
      toast.success(`Account created! Welcome, ${user.name}!`);
      const dashMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
      navigate(dashMap[user.role]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'student', label: '🎓 Student', desc: 'View marks & attendance' },
    { value: 'teacher', label: '👨‍🏫 Teacher', desc: 'Manage students & marks' },
    { value: 'admin', label: '👨‍💼 Admin', desc: 'Full system access' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: '24px'
    }}>
      <div style={{
        width: '100%', maxWidth: '460px', background: 'var(--surface)',
        borderRadius: '20px', border: '1px solid var(--border)', padding: '40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: '800', color: 'white'
          }}>A</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Join ACADEX with your institutional email</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
              display: 'block', marginBottom: '8px' }}>Select Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {roles.map(r => (
                <button
                  key={r.value} type="button"
                  onClick={() => setForm(p => ({ ...p, role: r.value }))}
                  style={{
                    padding: '12px 8px', borderRadius: '10px', textAlign: 'center',
                    border: `2px solid ${form.role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                    background: form.role === r.value ? 'var(--primary)15' : 'var(--surface-2)',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontSize: '16px', marginBottom: '2px' }}>{r.label.split(' ')[0]}</div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: form.role === r.value ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    {r.label.split(' ').slice(1).join(' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          {[
            { name: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Smith' },
            { name: 'email', label: 'Institutional Email', type: 'email', icon: Mail, placeholder: 'you@university.edu' },
            { name: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: 'Min. 6 characters' },
          ].map(field => {
            const Icon = field.icon;
            return (
              <div key={field.name} style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                  display: 'block', marginBottom: '6px' }}>{field.label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={15} style={{
                    position: 'absolute', left: '13px', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)'
                  }} />
                  <input
                    name={field.name} type={field.type}
                    value={form[field.name]} onChange={handleChange}
                    placeholder={field.placeholder} required
                    style={{
                      width: '100%', padding: '10px 14px 10px 40px',
                      border: '1px solid var(--border)', borderRadius: '9px',
                      background: 'var(--surface)', color: 'var(--text-primary)',
                      fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>
              </div>
            );
          })}

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', borderRadius: '10px', fontWeight: '600',
              fontSize: '15px', marginTop: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {loading && <span style={{
              width: '16px', height: '16px', border: '2px solid white',
              borderTopColor: 'transparent', borderRadius: '50%',
              animation: 'spin 0.6s linear infinite'
            }} />}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}