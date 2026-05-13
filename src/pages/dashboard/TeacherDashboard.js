import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/Card';
import toast from 'react-hot-toast';

export default function TeacherDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/teacher-stats')
      .then(res => setStats(res.data.stats))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Teacher Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Your classes and students at a glance</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon={Users} label="My Students" value={stats?.myStudentsCount || 0} color="#6366f1" />
        <StatCard icon={UserCheck} label="Present Today" value={stats?.todayPresent || 0} color="#10b981" />
        <StatCard icon={UserX} label="Absent Today" value={stats?.todayAbsent || 0} color="#ef4444" />
        <StatCard icon={TrendingUp} label="Avg Attendance" value={`${stats?.avgAttendance || 0}%`} color="#f59e0b" />
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>Recent Students</h3>
        {stats?.recentStudents?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats.recentStudents.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px', borderRadius: '8px', background: 'var(--surface-2)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6366f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  fontWeight: '600', fontSize: '14px' }}>{s.name.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{s.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Roll: {s.rollNumber} • Class {s.class}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: '600', color: '#10b981' }}>
                  {s.attendancePercentage}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px', fontSize: '14px' }}>
            No students yet. Add your first student!
          </div>
        )}
      </div>
    </div>
  );
}

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
    <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)',
      borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);