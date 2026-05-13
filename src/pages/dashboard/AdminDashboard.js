import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, TrendingUp, UserCheck } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data.stats))
      .catch(() => toast.error('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const enrollmentData = stats?.monthlyEnrollment?.map(m => ({
    month: monthNames[m._id.month - 1],
    students: m.count
  })) || [];

  const classData = stats?.classDistribution?.map(c => ({
    name: c._id || 'Unknown',
    count: c.count
  })) || [];

  const attendanceData = stats?.attendanceStats?.map(s => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    value: s.count
  })) || [];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Overview of your institution's performance
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '24px'
      }}>
        <StatCard icon={GraduationCap} label="Total Students" value={stats?.totalStudents || 0} color="#6366f1" />
        <StatCard icon={Users} label="Total Teachers" value={stats?.totalTeachers || 0} color="#0ea5e9" />
        <StatCard icon={BookOpen} label="Total Classes" value={stats?.totalClasses || 0} color="#10b981" />
        <StatCard icon={UserCheck} label="Active Students" value={stats?.activeStudents || 0} color="#f59e0b" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Enrollment Trend */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Monthly Enrollment</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '8px', fontSize: '13px' }} />
              <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Class Distribution */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Students per Class</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={classData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '8px', fontSize: '13px' }} />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Attendance Pie */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Attendance Overview (30 days)</h3>
          {attendanceData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                    {attendanceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div>
                {attendanceData.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: COLORS[i] }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {item.name}: <strong>{item.value}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '14px' }}>
              No attendance data yet
            </div>
          )}
        </div>

        {/* Recent Students */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Recent Students</h3>
          {stats?.recentStudents?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.recentStudents.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px', borderRadius: '8px', background: 'var(--surface-2)' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: COLORS[i % COLORS.length], display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'white',
                    fontWeight: '600', fontSize: '14px', flexShrink: 0
                  }}>{s.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Class {s.class} • Roll: {s.rollNumber}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{
                      fontSize: '11px', padding: '3px 8px', borderRadius: '999px',
                      background: s.status === 'active' ? '#10b98120' : '#ef444420',
                      color: s.status === 'active' ? '#10b981' : '#ef4444',
                      fontWeight: '500'
                    }}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '14px' }}>
              No students yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}