import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function StudentList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(null);

  const basePath = `/${user?.role}`;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students', {
        params: { page, limit: 10, search }
      });
      setStudents(res.data.students);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      setDeleteId(null);
      fetchStudents();
    } catch {
      toast.error('Failed to delete student');
    }
  };

  const getGradeColor = (pct) => {
    if (pct >= 80) return '#10b981';
    if (pct >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
            {user?.role === 'teacher' ? 'My Students' : 'All Students'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {total} students total
          </p>
        </div>
        <Link to={`${basePath}/students/add`}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', background: 'var(--primary)', color: 'white',
            borderRadius: '10px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer'
          }}>
            <Plus size={16} /> Add Student
          </button>
        </Link>
      </div>

      {/* Search bar */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)'
          }} />
          <input
            value={search} onChange={handleSearch}
            placeholder="Search by name, roll number, email..."
            style={{
              width: '100%', padding: '9px 14px 9px 38px',
              border: '1px solid var(--border)', borderRadius: '8px',
              background: 'var(--surface-2)', color: 'var(--text-primary)',
              fontSize: '14px', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)',
              borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--text-muted)' }}>
            <GraduationCapIcon />
            <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              No students found
            </div>
            <div style={{ fontSize: '14px' }}>
              {search ? 'Try a different search term' : 'Add your first student to get started'}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Student', 'Roll No.', 'Class', 'Attendance', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left', fontSize: '12px',
                      fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase',
                      letterSpacing: '0.5px', whiteSpace: 'nowrap'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id} style={{
                    borderBottom: '1px solid var(--border)',
                    background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)'
                  }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: `hsl(${(i * 47) % 360}, 65%, 55%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: '600', fontSize: '14px', flexShrink: 0
                        }}>{s.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '14px' }}>{s.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {s.rollNumber}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {s.class} {s.section && `- ${s.section}`}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '999px', maxWidth: '80px' }}>
                          <div style={{
                            height: '100%', width: `${s.attendancePercentage}%`,
                            background: getGradeColor(s.attendancePercentage), borderRadius: '999px'
                          }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: getGradeColor(s.attendancePercentage) }}>
                          {s.attendancePercentage}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: '12px', padding: '3px 10px', borderRadius: '999px', fontWeight: '500',
                        background: s.status === 'active' ? '#10b98118' : '#ef444418',
                        color: s.status === 'active' ? '#10b981' : '#ef4444'
                      }}>{s.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => navigate(`${basePath}/students/${s._id}`)}
                          style={{ padding: '6px', borderRadius: '6px', background: '#6366f115',
                            color: '#6366f1', border: 'none', cursor: 'pointer' }} title="View">
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`${basePath}/students/edit/${s._id}`)}
                          style={{ padding: '6px', borderRadius: '6px', background: '#0ea5e915',
                            color: '#0ea5e9', border: 'none', cursor: 'pointer' }} title="Edit">
                          <Edit size={14} />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => setDeleteId(s._id)}
                            style={{ padding: '6px', borderRadius: '6px', background: '#ef444415',
                              color: '#ef4444', border: 'none', cursor: 'pointer' }} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Page {page} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '6px 10px', borderRadius: '6px', background: 'var(--surface-2)',
                  border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-secondary)',
                  opacity: page === 1 ? 0.5 : 1 }}>
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: '6px 10px', borderRadius: '6px', background: 'var(--surface-2)',
                  border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-secondary)',
                  opacity: page === totalPages ? 0.5 : 1 }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '28px',
            maxWidth: '380px', width: '90%', border: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '18px' }}>Delete Student?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              This action cannot be undone. All data for this student will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)}
                style={{ padding: '9px 18px', borderRadius: '8px', background: 'var(--surface-2)',
                  border: '1px solid var(--border)', cursor: 'pointer', fontWeight: '500' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                style={{ padding: '9px 18px', borderRadius: '8px', background: 'var(--danger)',
                  color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const GraduationCapIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    style={{ margin: '0 auto', display: 'block', color: 'var(--border)' }}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);