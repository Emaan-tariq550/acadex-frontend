import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/students/${id}`)
      .then(res => setStudent(res.data.student))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !student) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const avgScore = student.marks?.length > 0
    ? Math.round(student.marks.reduce((s, m) => s + m.score, 0) / student.marks.length) : 0;

  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ width: '160px', fontSize: '13px', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: '500' }}>{value || '—'}</span>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{ padding: '8px', borderRadius: '8px',
            background: 'var(--surface-2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={18} color="var(--text-secondary)" />
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Student Profile</h1>
        </div>
        <button onClick={() => navigate(`/${user?.role}/students/edit/${id}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px',
            background: 'var(--primary)', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer',
            fontWeight: '600', fontSize: '14px' }}>
          <Edit size={15} /> Edit Student
        </button>
      </div>

      {/* Profile header */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '28px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '700', fontSize: '28px', flexShrink: 0 }}>
            {student.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{student.name}</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Roll: {student.rollNumber} • Class {student.class}-{student.section}
            </div>
            <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '999px',
                background: student.status === 'active' ? '#10b98118' : '#ef444418',
                color: student.status === 'active' ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                {student.status}
              </span>
              <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '999px',
                background: '#6366f118', color: '#6366f1', fontWeight: '500' }}>
                {student.attendancePercentage}% attendance
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Avg Score', value: `${avgScore}%`, color: '#6366f1' },
            { label: 'Subjects', value: student.marks?.length || 0, color: '#0ea5e9' },
            { label: 'Attendance', value: `${student.attendancePercentage}%`, color: '#10b981' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface-2)', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '4px', fontSize: '15px' }}>Personal Details</h3>
        <div style={{ marginTop: '8px' }}>
          <InfoRow label="Full Name" value={student.name} />
          <InfoRow label="Email" value={student.email} />
          <InfoRow label="Age" value={student.age ? `${student.age} years` : null} />
          <InfoRow label="Gender" value={student.gender} />
          <InfoRow label="Phone" value={student.phone} />
          <InfoRow label="Address" value={student.address} />
          <InfoRow label="Parent Name" value={student.parentName} />
          <InfoRow label="Parent Phone" value={student.parentPhone} />
        </div>
      </div>

      {/* Marks */}
      {student.marks?.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>Academic Marks</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                {['Subject','Score','Grade','Term'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {student.marks.map((m, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '500', fontSize: '14px' }}>{m.subject}</td>
                  <td style={{ padding: '12px 14px', fontSize: '14px' }}>{m.score}/100</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '999px', fontWeight: '600',
                      background: m.grade === 'F' ? '#ef444420' : '#10b98120',
                      color: m.grade === 'F' ? '#ef4444' : '#10b981' }}>{m.grade}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-muted)' }}>{m.term || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}