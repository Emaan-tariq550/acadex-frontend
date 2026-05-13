import React, { useState } from 'react';
import { Sun, Moon, User, Lock, Palette, Save } from 'lucide-react';
import { useAuth, api } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const ACCENT_COLORS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Rose', value: '#f43f5e' },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  const handleProfileSave = async () => {
    if (!profile.name.trim()) { toast.error('Name cannot be empty'); return; }
    setProfileLoading(true);
    try {
      const res = await api.put('/auth/update-profile', { name: profile.name });
      updateUser({ ...user, name: res.data.user.name });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (password.newPassword !== password.confirm) {
      toast.error('Passwords do not match'); return;
    }
    if (password.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    setPassLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword
      });
      toast.success('Password changed successfully!');
      setPassword({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid var(--border)',
    borderRadius: '9px', background: 'var(--surface)', color: 'var(--text-primary)',
    fontSize: '14px', outline: 'none'
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px',
        background: 'var(--surface-2)', padding: '4px', borderRadius: '10px',
        border: '1px solid var(--border)', width: 'fit-content' }}>
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '7px', fontWeight: '500', fontSize: '14px',
                border: 'none', cursor: 'pointer',
                background: activeTab === t.id ? 'var(--surface)' : 'transparent',
                color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: activeTab === t.id ? 'var(--shadow-sm)' : 'none'
              }}>
              <Icon size={15} />{t.label}
            </button>
          );
        })}
      </div>

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px' }}>
          {/* Theme toggle */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '15px' }}>Theme</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
              Choose between light and dark mode
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { id: 'light', icon: Sun, label: 'Light' },
                { id: 'dark', icon: Moon, label: 'Dark' }
              ].map(t => {
                const Icon = t.icon;
                const active = theme === t.id;
                return (
                  <button key={t.id}
                    onClick={() => { if (theme !== t.id) toggleTheme(); }}
                    style={{
                      padding: '16px 24px', borderRadius: '12px', border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                      background: active ? 'var(--primary)10' : 'var(--surface-2)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                      fontWeight: active ? '600' : '400', color: active ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '14px'
                    }}>
                    <Icon size={18} />{t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent color */}
          <div>
            <h3 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '15px' }}>Accent Color</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
              Choose your preferred accent color
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {ACCENT_COLORS.map(c => (
                <button key={c.value} onClick={() => setAccentColor(c.value)} title={c.name}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: c.value, border: `3px solid ${accentColor === c.value ? 'var(--text-primary)' : 'transparent'}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                    outline: accentColor === c.value ? `2px solid ${c.value}` : 'none',
                    outlineOffset: '2px'
                  }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '20px', fontSize: '15px' }}>Profile Information</h3>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--primary)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '24px'
            }}>{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>{user?.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user?.role}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                display: 'block', marginBottom: '6px' }}>Full Name</label>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                display: 'block', marginBottom: '6px' }}>Email (read-only)</label>
              <input value={profile.email} readOnly style={{ ...inputStyle, opacity: 0.6 }} />
            </div>
          </div>

          <button onClick={handleProfileSave} disabled={profileLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: 'var(--primary)', color: 'white',
              borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            {profileLoading ? <span style={{ width: '14px', height: '14px', border: '2px solid white',
              borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <Save size={15} />}
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '20px', fontSize: '15px' }}>Change Password</h3>
          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Current Password', key: 'currentPassword' },
              { label: 'New Password', key: 'newPassword' },
              { label: 'Confirm New Password', key: 'confirm' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                  display: 'block', marginBottom: '6px' }}>{f.label}</label>
                <input type="password" value={password[f.key]}
                  onChange={e => setPassword(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder="••••••••" style={inputStyle} />
              </div>
            ))}
          </div>
          <button onClick={handlePasswordChange} disabled={passLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: 'var(--danger)', color: 'white',
              borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            {passLoading ? <span style={{ width: '14px', height: '14px', border: '2px solid white',
              borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <Lock size={15} />}
            {passLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}