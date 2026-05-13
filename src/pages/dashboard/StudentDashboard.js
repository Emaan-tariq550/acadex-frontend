import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, TrendingUp, Award } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/Card';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/me')
      .then(res => setStudent(res.data.student))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const avgScore = student?.marks?.length > 0
    ? Math.round(student.marks.reduce((s, m) => s + m.score, 0) / student.marks.length)
    : 0;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
          Welcome, {user?.name?.split(' ')[0]}!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Here's your academic overview</p>
      </div>

      {student ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <StatCard icon={Calendar} label="Attendance" value={`${student.attendancePercentage}%`} color="#6366f1" />
            <StatCard icon={BookOpen} label="Subjects" value={student.marks?.length || 0} color="#0ea5e9" />
            <StatCard icon={TrendingUp} label="Avg Score" value={`${avgScore}%`} color="#10b981" />
            <StatCard icon={Award} label="Class" value={`${student.class}-${student.section}`} color="#f59e0b" />
          </div>

          {/* Marks table */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>My Marks</h3>
            {student.marks?.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2)' }}>
                    {['Subject', 'Score', 'Grade', 'Term'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px',
                        fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {student.marks.map((m, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: '500', fontSize: '14px' }}>{m.subject}</td>
                      <td style={{ padding: '12px 14px', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '999px', maxWidth: '80px' }}>
                            <div style={{ height: '100%', width: `${m.score}%`,
                              background: m.score >= 80 ? '#10b981' : m.score >= 60 ? '#f59e0b' : '#ef4444',
                              borderRadius: '999px' }} />
                          </div>
                          {m.score}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontSize: '12px', padding: '2px 8px', borderRadius: '999px', fontWeight: '600',
                          background: m.grade === 'F' ? '#ef444420' : '#10b98120',
                          color: m.grade === 'F' ? '#ef4444' : '#10b981'
                        }}>{m.grade}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {m.term || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px', fontSize: '14px' }}>
                No marks recorded yet
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px',
          padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Your student profile hasn't been set up yet. Contact your teacher or admin.
          </div>
        </div>
      )}
    </div>
  );
}