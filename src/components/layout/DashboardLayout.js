import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, ClipboardList,
  Settings, LogOut, Menu, X, Bell, Sun, Moon, ChevronRight,
  BookOpen, UserCog
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navConfig = {
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Students', icon: GraduationCap, path: '/admin/students' },
    { label: 'Attendance', icon: ClipboardList, path: '/admin/attendance' },
    { label: 'Users', icon: UserCog, path: '/admin/users' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ],
  teacher: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
    { label: 'My Students', icon: GraduationCap, path: '/teacher/students' },
    { label: 'Attendance', icon: ClipboardList, path: '/teacher/attendance' },
    { label: 'Settings', icon: Settings, path: '/teacher/settings' },
  ],
  student: [
    { label: 'My Dashboard', icon: LayoutDashboard, path: '/student' },
    { label: 'Settings', icon: Settings, path: '/student/settings' },
  ],
};

const roleColors = {
  admin: '#6366f1',
  teacher: '#0ea5e9',
  student: '#10b981',
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = navConfig[user?.role] || [];
  const roleColor = roleColors[user?.role] || '#6366f1';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === `/${user?.role}`) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const Sidebar = ({ mobile = false }) => (
    <aside style={{
      width: mobile ? '100%' : '260px',
      height: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: mobile ? 'relative' : 'fixed',
      top: 0, left: 0,
      zIndex: mobile ? 1 : 100,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', color: 'white', fontSize: '18px'
          }}>A</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px', letterSpacing: '-0.3px' }}>ACADEX</div>
            <div style={{
              fontSize: '11px', color: 'white',
              background: roleColor, borderRadius: '4px',
              padding: '1px 6px', display: 'inline-block',
              textTransform: 'capitalize', fontWeight: '500'
            }}>{user?.role}</div>
          </div>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', color: 'var(--text-secondary)', padding: '4px' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', 
          textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 12px 8px' }}>
          Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '8px', marginBottom: '2px',
                background: active ? `${roleColor}15` : 'transparent',
                color: active ? roleColor : 'var(--text-secondary)',
                fontWeight: active ? '600' : '400',
                fontSize: '14px', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div style={{
        padding: '16px', borderTop: '1px solid var(--border)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px', borderRadius: '10px', background: 'var(--surface-2)',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: roleColor, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '15px',
            flexShrink: 0
          }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '13px', 
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px', background: 'none',
            color: 'var(--danger)', fontSize: '14px', fontWeight: '500',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ef444415'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Desktop Sidebar */}
      <div style={{ display: 'none' }} className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Always-visible desktop sidebar */}
      <div style={{ width: '260px', flexShrink: 0 }}>
        <div style={{ display: 'block' }}>
          <Sidebar />
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 200, display: 'none'
          }}
          className="mobile-overlay"
        />
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{
          height: '64px', background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 50
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', color: 'var(--text-primary)', display: 'none' }}
            className="mobile-menu-btn"
          >
            <Menu size={22} />
          </button>

          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {navItems.find(n => isActive(n.path))?.label || 'ACADEX'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleTheme}
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', position: 'relative'
            }}>
              <Bell size={16} />
              <span style={{
                position: 'absolute', top: '6px', right: '6px',
                width: '8px', height: '8px', background: 'var(--danger)',
                borderRadius: '50%', border: '2px solid var(--surface)'
              }} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .mobile-overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
}