import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      const dashMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
      navigate(dashMap[user.role]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg)'
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px', color: 'white'
      }} className="auth-left">
        <div style={{ maxWidth: '420px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'rgba(255,255,255,0.2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', fontSize: '32px', marginBottom: '32px',
            backdropFilter: 'blur(10px)'
          }}>A</div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', lineHeight: 1.2 }}>
            ACADEX
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.85, marginBottom: '48px', lineHeight: 1.6 }}>
            The complete academic management platform for schools, colleges, and universities.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '🎓', text: 'Role-based access for Admins, Teachers & Students' },
              { icon: '🔒', text: 'Institutional email authentication only' },
              { icon: '📊', text: 'Real-time analytics & attendance tracking' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', opacity: 0.9 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: '480px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px',
      }} className="auth-right">
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
            Sign in to your ACADEX account
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                display: 'block', marginBottom: '6px' }}>
                Institutional Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '13px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)'
                }} />
                <input
                  name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="you@university.edu"
                  required
                  style={{
                    width: '100%', padding: '10px 14px 10px 40px',
                    border: '1px solid var(--border)', borderRadius: '9px',
                    background: 'var(--surface)', color: 'var(--text-primary)',
                    fontSize: '14px', outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '13px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)'
                }} />
                <input
                  name="password" type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Your password"
                  required
                  style={{
                    width: '100%', padding: '10px 40px 10px 40px',
                    border: '1px solid var(--border)', borderRadius: '9px',
                    background: 'var(--surface)', color: 'var(--text-primary)',
                    fontSize: '14px', outline: 'none'
                  }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  color: 'var(--text-muted)', display: 'flex'
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', borderRadius: '10px', fontWeight: '600',
                fontSize: '15px', opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {loading && <span style={{
                width: '16px', height: '16px', border: '2px solid white',
                borderTopColor: 'transparent', borderRadius: '50%',
                animation: 'spin 0.6s linear infinite'
              }} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Sign up
            </Link>
          </p>

          <div style={{
            marginTop: '24px', padding: '14px', borderRadius: '10px',
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            fontSize: '12px', color: 'var(--text-muted)'
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Only institutional emails allowed:</strong>
            <br />@school.edu • @university.edu • @college.edu
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .auth-left { display: none !important; }
          .auth-right { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}