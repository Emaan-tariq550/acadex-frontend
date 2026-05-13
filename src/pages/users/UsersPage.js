import React, { useState, useEffect } from 'react';
import { Trash2, Search, ShieldCheck, GraduationCap, Users } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = () => {
    api.get('/users', { params: { search, role: roleFilter } })
      .then(res => setUsers(res.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const toggleStatus = async (id, current) => {
    try {
      await api.put(`/users/${id}/status`, { isActive: !current });
      toast.success('Status updated');
      fetchUsers();
    } catch { toast.error('Failed to update status'); }
  };

  const roleIcon = { admin: ShieldCheck, teacher: Users, student: GraduationCap };
  const roleColor = { admin: '#6366f1', teacher: '#0ea5e9', student: '#10b981' };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>User Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{users.length} users total</p>
      </div>

      {/* Filters */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '16px', marginBottom: '16px',
        display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            style={{ width: '100%', padding: '9px 14px 9px 36px', border: '1px solid var(--border)',
              borderRadius: '8px', background: 'var(--surface-2)', color: 'var(--text-primary)',
              fontSize: '14px', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['', 'admin', 'teacher', 'student'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                border: `1px solid ${roleFilter === r ? 'var(--primary)' : 'var(--border)'}`,
                background: roleFilter === r ? 'var(--primary)' : 'transparent',
                color: roleFilter === r ? 'white' : 'var(--text-secondary)', cursor: 'pointer' }}>
              {r === '' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px',
                  fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const Icon = roleIcon[u.role] || Users;
              const color = roleColor[u.role] || '#6366f1';
              return (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)',
                  background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: '600', fontSize: '14px', flexShrink: 0 }}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{u.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '13px', fontWeight: '500', color }}>
                      <Icon size={14} /> {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => u._id !== currentUser._id && toggleStatus(u._id, u.isActive)}
                      style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '999px', fontWeight: '500',
                        border: 'none', cursor: u._id === currentUser._id ? 'default' : 'pointer',
                        background: u.isActive ? '#10b98118' : '#ef444418',
                        color: u.isActive ? '#10b981' : '#ef4444' }}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {u._id !== currentUser._id && (
                      <button onClick={() => setDeleteId(u._id)}
                        style={{ padding: '6px', borderRadius: '6px', background: '#ef444415',
                          color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
            No users found
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '28px',
            maxWidth: '380px', width: '90%', border: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '18px' }}>Delete User?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              This will permanently remove the user and all their data.
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