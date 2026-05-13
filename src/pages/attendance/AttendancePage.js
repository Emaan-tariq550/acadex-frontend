import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/students', { params: { limit: 100 } })
      .then(res => {
        setStudents(res.data.students);
        const init = {};
        res.data.students.forEach(s => { init[s._id] = 'present'; });
        setAttendance(init);
      })
      .catch(() => toast.error('Failed to load students'));
  }, []);

  const setStatus = (id, status) => setAttendance(p => ({ ...p, [id]: status }));

  const handleSubmit = async () => {
    if (!subject.trim()) { toast.error('Please enter subject name'); return; }
    setSubmitting(true);
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status }));
      await api.post('/attendance/bulk', { records, date, class: 'All', subject });
      toast.success(`Attendance marked for ${records.length} students!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.includes(search)
  );

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  const StatusBtn = ({ id, status, label, color, bgColor, icon: Icon }) => (
    <button
      onClick={() => setStatus(id, status)}
      style={{
        padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500',
        border: `1px solid ${attendance[id] === status ? color : 'var(--border)'}`,
        background: attendance[id] === status ? bgColor : 'transparent',
        color: attendance[id] === status ? color : 'var(--text-muted)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s'
      }}>
      <Icon size={12} /> {label}
    </button>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Mark Attendance</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Record daily attendance for your students</p>
      </div>

      {/* Controls */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
              display: 'block', marginBottom: '6px' }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ padding: '9px 14px', border: '1px solid var(--border)', borderRadius: '8px',
                background: 'var(--surface)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
              display: 'block', marginBottom: '6px' }}>Subject *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              style={{ width: '100%', padding: '9px 14px', border: '1px solid var(--border)', borderRadius: '8px',
                background: 'var(--surface)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>{presentCount}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Present</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>{absentCount}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Absent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '360px', marginBottom: '16px' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
          style={{ width: '100%', padding: '9px 14px 9px 36px', border: '1px solid var(--border)',
            borderRadius: '8px', background: 'var(--surface)', color: 'var(--text-primary)',
            fontSize: '14px', outline: 'none' }} />
      </div>

      {/* Student list */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
        {filtered.map((s, i) => (
          <div key={s._id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
            background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: `hsl(${(i * 47) % 360}, 60%, 55%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: '600', fontSize: '14px', flexShrink: 0
              }}>{s.name.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{s.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Roll: {s.rollNumber}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <StatusBtn id={s._id} status="present" label="Present" color="#10b981" bgColor="#10b98115" icon={CheckCircle} />
              <StatusBtn id={s._id} status="late" label="Late" color="#f59e0b" bgColor="#f59e0b15" icon={Clock} />
              <StatusBtn id={s._id} status="absent" label="Absent" color="#ef4444" bgColor="#ef444415" icon={XCircle} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
            No students found
          </div>
        )}
      </div>

      <button onClick={handleSubmit} disabled={submitting || students.length === 0}
        style={{ padding: '12px 32px', background: 'var(--primary)', color: 'white',
          borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700',
          fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px',
          opacity: submitting ? 0.7 : 1 }}>
        {submitting && <span style={{ width: '16px', height: '16px', border: '2px solid white',
          borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />}
        {submitting ? 'Submitting...' : `Submit Attendance (${students.length} students)`}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}