import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Search, UserCheck } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12'];
const SECTIONS = ['A','B','C','D','E'];

export default function AddStudent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const basePath = `/${user?.role}`;

  const [mode, setMode] = useState('select'); // 'select' or 'manual'
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', rollNumber: '', email: '', class: '', section: 'A',
    age: '', gender: '', phone: '', address: '', parentName: '', parentPhone: ''
  });

  useEffect(() => {
    api.get('/users/registered-students', { params: { search } })
      .then(res => setRegisteredStudents(res.data.students))
      .catch(() => {});
  }, [search]);

  const handleSelectUser = (student) => {
    setSelectedUser(student);
    setForm(p => ({
      ...p,
      name: student.name,
      email: student.email
    }));
  };

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.class) { toast.error('Please select a class'); return; }
    if (!form.rollNumber) { toast.error('Please enter roll number'); return; }

    setLoading(true);
    try {
      await api.post('/students', {
        ...form,
        linkedUserId: selectedUser?._id || null
      });
      toast.success('Student added successfully!');
      navigate(`${basePath}/students`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid var(--border)',
    borderRadius: '8px', background: 'var(--surface)', color: 'var(--text-primary)',
    fontSize: '14px', outline: 'none'
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '8px', borderRadius: '8px',
          background: 'var(--surface-2)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={18} color="var(--text-secondary)" />
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Add Student</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Link a registered student or add manually</p>
        </div>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button onClick={() => setMode('select')}
          style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '500', fontSize: '14px',
            border: `2px solid ${mode === 'select' ? 'var(--primary)' : 'var(--border)'}`,
            background: mode === 'select' ? '#6366f115' : 'var(--surface)',
            color: mode === 'select' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer' }}>
          🔗 Link Registered Student
        </button>
        <button onClick={() => { setMode('manual'); setSelectedUser(null); }}
          style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '500', fontSize: '14px',
            border: `2px solid ${mode === 'manual' ? 'var(--primary)' : 'var(--border)'}`,
            background: mode === 'manual' ? '#6366f115' : 'var(--surface)',
            color: mode === 'manual' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer' }}>
          ✏️ Add Manually
        </button>
      </div>

      {/* Select registered student */}
      {mode === 'select' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '15px' }}>
            Select from Registered Students
          </h3>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              style={{ ...inputStyle, paddingLeft: '36px' }} />
          </div>

          {/* Student list */}
          <div style={{ maxHeight: '240px', overflowY: 'auto',
            border: '1px solid var(--border)', borderRadius: '10px' }}>
            {registeredStudents.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center',
                color: 'var(--text-muted)', fontSize: '14px' }}>
                No registered students found
              </div>
            ) : (
              registeredStudents.map((s, i) => (
                <div key={s._id}
                  onClick={() => handleSelectUser(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', cursor: 'pointer',
                    borderBottom: i < registeredStudents.length - 1 ? '1px solid var(--border)' : 'none',
                    background: selectedUser?._id === s._id ? '#6366f115' : 'transparent',
                    transition: 'background 0.15s'
                  }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%',
                    background: '#6366f1', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white', fontWeight: '600',
                    fontSize: '14px', flexShrink: 0 }}>
                    {s.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.email}</div>
                  </div>
                  {selectedUser?._id === s._id && (
                    <UserCheck size={18} color="#10b981" />
                  )}
                </div>
              ))
            )}
          </div>

          {selectedUser && (
            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px',
              background: '#10b98115', border: '1px solid #10b981',
              fontSize: '13px', color: '#10b981', fontWeight: '500' }}>
              ✅ Selected: {selectedUser.name} ({selectedUser.email})
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px',
            color: 'var(--text-secondary)' }}>Student Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Full Name', name: 'name', required: true, placeholder: 'John Smith' },
              { label: 'Roll Number', name: 'rollNumber', required: true, placeholder: '2024-001' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'student@itu.edu.pk' },
              { label: 'Age', name: 'age', type: 'number', placeholder: '20' },
              { label: 'Phone', name: 'phone', placeholder: '+92 300 1234567' },
              { label: 'Parent Name', name: 'parentName', placeholder: 'Jane Smith' },
              { label: 'Parent Phone', name: 'parentPhone', placeholder: '+92 300 7654321' },
            ].map(f => (
              <div key={f.name}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                  display: 'block', marginBottom: '6px' }}>
                  {f.label} {f.required && <span style={{ color: 'var(--danger)' }}>*</span>}
                </label>
                <input name={f.name} type={f.type || 'text'} value={form[f.name]}
                  onChange={handleChange} required={f.required} placeholder={f.placeholder}
                  style={inputStyle} />
              </div>
            ))}

            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                display: 'block', marginBottom: '6px' }}>
                Class <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <select name="class" value={form.class} onChange={handleChange} required style={inputStyle}>
                <option value="">Select Class</option>
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                display: 'block', marginBottom: '6px' }}>Section</label>
              <select name="section" value={form.section} onChange={handleChange} style={inputStyle}>
                {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                display: 'block', marginBottom: '6px' }}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                display: 'block', marginBottom: '6px' }}>Address</label>
              <input name="address" value={form.address} onChange={handleChange}
                placeholder="123 Main St, City" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate(-1)}
            style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--surface-2)',
              border: '1px solid var(--border)', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>
            Cancel
          </button>
          <button type="submit" disabled={loading}
            style={{ padding: '10px 24px', borderRadius: '10px', background: 'var(--primary)',
              color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading && <span style={{ width: '14px', height: '14px', border: '2px solid white',
              borderTopColor: 'transparent', borderRadius: '50%',
              animation: 'spin 0.6s linear infinite' }} />}
            <Save size={16} />
            {loading ? 'Saving...' : 'Add Student'}
          </button>
        </div>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}