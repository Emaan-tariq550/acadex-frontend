import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return {
    checks,
    strength: passed <= 2 ? 'weak' : passed <= 4 ? 'medium' : 'strong',
    score: passed
  };
};

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = checkPasswordStrength(form.password);

  const strengthColors = {
    weak: '#ef4444',
    medium: '#f59e0b',
    strong: '#10b981'
  };

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordStrength.score < 5) {
      toast.error('Please use a stronger password!');
      return;
    }
    setLoading(true);
    try {
      const user = await signup(form);
      toast.success(`Welcome, ${user.name}!`);
      const dashMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
      navigate(dashMap[user.role]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'student', label: '🎓 Student' },
    { value: 'teacher', label: '👨‍🏫 Teacher' },
    { value: 'admin', label: '👨‍💼 Admin' },
  ];

  const inputStyle = {
    width: '100%',
    padding: '10px 14px 10px 40px',
    border: '1px solid var(--border)',
    borderRadius: '9px',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none'
  };

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
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Use your institutional email
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
              display: 'block', marginBottom: '8px'
            }}>Select Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {roles.map(r => (
                <button key={r.value} type="button"
                  onClick={() => setForm(p => ({ ...p, role: r.value }))}
                  style={{
                    padding: '12px 8px', borderRadius: '10px', textAlign: 'center',
                    border: `2px solid ${form.role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                    background: form.role === r.value ? '#6366f115' : 'var(--surface-2)',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                    color: form.role === r.value ? 'var(--primary)' : 'var(--text-secondary)'
                  }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
              display: 'block', marginBottom: '6px'
            }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{
                position: 'absolute', left: '13px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)'
              }} />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder=""
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
              display: 'block', marginBottom: '6px'
            }}>Institutional Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{
                position: 'absolute', left: '13px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)'
              }} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder=""
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
              display: 'block', marginBottom: '6px'
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{
                position: 'absolute', left: '13px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)'
              }} />
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder=""
                required
                style={{ ...inputStyle, paddingRight: '50px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '12px'
                }}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Password strength */}
            {form.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{
                      flex: 1, height: '4px', borderRadius: '999px',
                      background: i <= passwordStrength.score
                        ? strengthColors[passwordStrength.strength]
                        : 'var(--border)',
                      transition: 'all 0.2s'
                    }} />
                  ))}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: strengthColors[passwordStrength.strength],
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  marginBottom: '6px'
                }}>
                  {passwordStrength.strength} password
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  {[
                    { key: 'length', label: '8+ characters' },
                    { key: 'uppercase', label: 'Uppercase (A-Z)' },
                    { key: 'lowercase', label: 'Lowercase (a-z)' },
                    { key: 'number', label: 'Number (0-9)' },
                    { key: 'special', label: 'Special (!@#$)' },
                  ].map(req => (
                    <div key={req.key} style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '11px',
                      color: passwordStrength.checks[req.key] ? '#10b981' : 'var(--text-muted)'
                    }}>
                      <span>{passwordStrength.checks[req.key] ? '✅' : '⬜'}</span>
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || passwordStrength.score < 5}
            style={{
              width: '100%', padding: '12px',
              background: passwordStrength.score < 5
                ? 'var(--border)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: passwordStrength.score < 5 ? 'var(--text-muted)' : 'white',
              borderRadius: '10px', fontWeight: '600', fontSize: '15px',
              border: 'none',
              cursor: passwordStrength.score < 5 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px'
            }}>
            {loading && (
              <span style={{
                width: '16px', height: '16px',
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite'
              }} />
            )}
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          fontSize: '14px', color: 'var(--text-muted)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Sign in
          </Link>
        </p>

        <div style={{
          marginTop: '16px', padding: '12px', borderRadius: '10px',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          fontSize: '12px', color: 'var(--text-muted)'
        }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Allowed domains:</strong>
          <br />itu.edu.pk • nust.edu.pk • uet.edu.pk • lums.edu.pk • university.edu
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}