import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { api } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12'];
const SUBJECTS = ['Mathematics','English','Science','History','Geography','Computer Science','Physics','Chemistry','Biology'];

export default function EditStudent() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const basePath = `/${user?.role}`;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [marksModal, setMarksModal] = useState(false);
  const [newMark, setNewMark] = useState({ subject: '', score: '', term: 'Term 1' });

  useEffect(() => {
    api.get(`/students/${id}`)
      .then(res => setForm(res.data.student))
      .catch(() => { toast.error('Student not found'); navigate(-1); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/students/${id}`, form);
      toast.success('Student updated!');
      navigate(`${basePath}/students/${id}`);
    } catch {
      toast.error('Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMark = async () => {
    if (!newMark.subject || !newMark.score) { toast.error('Fill all mark fields'); return; }
    try {
      const res = await api.post(`/students/${id}/marks`, newMark);
      setForm(res.data.student);
      setNewMark({ subject: '', score: '', term: 'Term 1' });
      setMarksModal(false);
      toast.success('Mark added!');
    } catch {
      toast.error('Failed to add mark');
    }
  };

  if (loading || !form) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

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
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Edit Student</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{form.name} — Roll: {form.rollNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-secondary)' }}>
            Basic Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Full Name', name: 'name' },
              { label: 'Roll Number', name: 'rollNumber' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Age', name: 'age', type: 'number' },
              { label: 'Phone', name: 'phone' },
              { label: 'Parent Name', name: 'parentName' },
              { label: 'Parent Phone', name: 'parentPhone' },
            ].map(f => (
              <div key={f.name}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                  display: 'block', marginBottom: '6px' }}>{f.label}</label>
                <input name={f.name} type={f.type || 'text'} value={form[f.name] || ''}
                  onChange={handleChange} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                display: 'block', marginBottom: '6px' }}>Class</label>
              <select name="class" value={form.class || ''} onChange={handleChange} style={inputStyle}>
                {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                display: 'block', marginBottom: '6px' }}>Status</label>
              <select name="status" value={form.status || 'active'} onChange={handleChange} style={inputStyle}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Marks section */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)' }}>Marks</h2>
            <button type="button" onClick={() => setMarksModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', background: 'var(--primary)', color: 'white',
                borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>
              <Plus size={14} /> Add Mark
            </button>
          </div>
          {form.marks?.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  {['Subject','Score','Grade','Term'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px',
                      fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {form.marks.map((m, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: '500' }}>{m.subject}</td>
                    <td style={{ padding: '10px 12px', fontSize: '13px' }}>{m.score}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '999px',
                        background: m.grade === 'F' ? '#ef444420' : '#10b98120',
                        color: m.grade === 'F' ? '#ef4444' : '#10b981', fontWeight: '600' }}>
                        {m.grade}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '13px', color: 'var(--text-muted)' }}>{m.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px', fontSize: '14px' }}>
              No marks yet
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate(-1)}
            style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--surface-2)',
              border: '1px solid var(--border)', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>
            Cancel
          </button>
          <button type="submit" disabled={saving}
            style={{ padding: '10px 24px', borderRadius: '10px', background: 'var(--primary)',
              color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '8px' }}>
            {saving ? <span style={{ width: '14px', height: '14px', border: '2px solid white',
              borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Add Mark Modal */}
      {marksModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '28px',
            maxWidth: '400px', width: '90%', border: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '20px', fontSize: '18px' }}>Add Mark</h3>
            <div style={{ display: 'grid', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                  display: 'block', marginBottom: '6px' }}>Subject</label>
                <select value={newMark.subject} onChange={e => setNewMark(p => ({ ...p, subject: e.target.value }))}
                  style={inputStyle}>
                  <option value="">Select subject</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                  display: 'block', marginBottom: '6px' }}>Score (0–100)</label>
                <input type="number" min="0" max="100" value={newMark.score}
                  onChange={e => setNewMark(p => ({ ...p, score: e.target.value }))}
                  style={inputStyle} placeholder="85" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                  display: 'block', marginBottom: '6px' }}>Term</label>
                <select value={newMark.term} onChange={e => setNewMark(p => ({ ...p, term: e.target.value }))}
                  style={inputStyle}>
                  {['Term 1','Term 2','Term 3','Final'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setMarksModal(false)}
                style={{ padding: '9px 18px', borderRadius: '8px', background: 'var(--surface-2)',
                  border: '1px solid var(--border)', cursor: 'pointer', fontWeight: '500' }}>
                Cancel
              </button>
              <button onClick={handleAddMark}
                style={{ padding: '9px 18px', borderRadius: '8px', background: 'var(--primary)',
                  color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                Add Mark
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}