import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12'];
const SECTIONS = ['A','B','C','D','E'];

export default function AddStudent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const basePath = `/${user?.role}`;

  const [form, setForm] = useState({
    name: '', rollNumber: '', email: '', class: '', section: 'A',
    age: '', gender: '', phone: '', address: '', parentName: '', parentPhone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/students', form);
      toast.success('Student added successfully!');
      navigate(`${basePath}/students`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', required, options, placeholder }) => (
    <div>
      <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
        display: 'block', marginBottom: '6px' }}>
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      {options ? (
        <select name={name} value={form[name]} onChange={handleChange} required={required}
          style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)',
            borderRadius: '8px', background: 'var(--surface)', color: 'var(--text-primary)',
            fontSize: '14px', outline: 'none' }}>
          <option value="">Select {label}</option>
          {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={form[name]} onChange={handleChange}
          required={required} placeholder={placeholder}
          style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)',
            borderRadius: '8px', background: 'var(--surface)', color: 'var(--text-primary)',
            fontSize: '14px', outline: 'none' }} />
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)}
          style={{ padding: '8px', borderRadius: '8px', background: 'var(--surface-2)',
            border: '1px solid var(--border)', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={18} color="var(--text-secondary)" />
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Add New Student</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Fill in the student information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-secondary)' }}>
            Basic Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <Field label="Full Name" name="name" required placeholder="John Smith" />
            <Field label="Roll Number" name="rollNumber" required placeholder="2024-001" />
            <Field label="Email" name="email" type="email" placeholder="student@school.edu" />
            <Field label="Age" name="age" type="number" placeholder="16" />
            <Field label="Gender" name="gender" options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]} />
            <Field label="Phone" name="phone" placeholder="+1 234 567 8900" />
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-secondary)' }}>
            Academic Details
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <Field label="Class" name="class" required options={CLASSES.map(c => ({ value: c, label: `Class ${c}` }))} />
            <Field label="Section" name="section" options={SECTIONS.map(s => ({ value: s, label: `Section ${s}` }))} />
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-secondary)' }}>
            Parent / Guardian
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <Field label="Parent Name" name="parentName" placeholder="Jane Smith" />
            <Field label="Parent Phone" name="parentPhone" placeholder="+1 234 567 8900" />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Address" name="address" placeholder="123 Main St, City, State" />
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
              borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />}
            <Save size={16} />
            {loading ? 'Saving...' : 'Add Student'}
          </button>
        </div>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}