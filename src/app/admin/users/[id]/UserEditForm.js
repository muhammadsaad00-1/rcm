'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ROLES = ['admin', 'billing', 'finance', 'support'];
const ROLE_DESC = {
  admin: 'Full system access — users, patients, claims, payments, reports',
  billing: 'Claims, denials, payments, patient lookup',
  finance: 'Financial dashboard, payments overview, reports',
  support: 'Patient registration and insurance verification only',
};

export default function UserEditForm({ targetUser, currentUserId }) {
  const router = useRouter();
  const isSelf = targetUser.id === currentUserId;

  const [form, setForm] = useState({
    full_name: targetUser.full_name || '',
    phone: targetUser.phone || '',
    role: targetUser.role || 'support',
    is_active: targetUser.is_active,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      setTimeout(() => router.push('/admin/users'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (isSelf) return alert('You cannot delete your own account');
    if (!confirm(`Delete user ${targetUser.full_name || targetUser.email}? This will remove their login access permanently.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/admin/users');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Link href="/admin/users" style={{ color: 'var(--teal)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            ← Back to Users
          </Link>
          <h1 className="text-navy font-bold" style={{ fontSize: '28px', letterSpacing: '-0.02em', marginTop: '8px' }}>
            Edit User — {targetUser.full_name || targetUser.email}
          </h1>
          <p className="text-gray text-sm" style={{ marginTop: '4px' }}>{targetUser.email}</p>
        </div>
        {!isSelf && (
          <button onClick={handleDelete} disabled={loading}
            style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
            Delete User
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid var(--red)', color: 'var(--red)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#f0fff4', border: '1px solid var(--green)', color: '#276749', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
          User updated successfully. Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card-modern" style={{ marginBottom: '20px' }}>
          <h2 className="text-navy font-semibold" style={{ fontSize: '16px', marginBottom: '20px' }}>Profile</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email (cannot be changed)</label>
              <input type="email" value={targetUser.email} disabled
                style={{ ...inputStyle, background: 'var(--off)', color: 'var(--gray4)', cursor: 'not-allowed' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '28px' }}>
              <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange}
                disabled={isSelf}
                style={{ width: '18px', height: '18px' }} />
              <label htmlFor="is_active" className="font-semibold text-navy" style={{ fontSize: '14px' }}>
                Active Account {isSelf && <span className="text-gray" style={{ fontWeight: 400, fontSize: '12px' }}>(cannot deactivate yourself)</span>}
              </label>
            </div>
          </div>
        </div>

        {/* Role selection */}
        <div className="card-modern" style={{ marginBottom: '24px' }}>
          <h2 className="text-navy font-semibold" style={{ fontSize: '16px', marginBottom: '20px' }}>Role & Permissions</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {ROLES.map(r => (
              <label key={r} style={{
                display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px',
                border: `2px solid ${form.role === r ? 'var(--navy)' : 'var(--border)'}`,
                borderRadius: '10px', cursor: 'pointer', background: form.role === r ? 'rgba(11,20,55,0.03)' : 'transparent',
                transition: 'all 0.15s',
              }}>
                <input type="radio" name="role" value={r} checked={form.role === r} onChange={handleChange}
                  style={{ marginTop: '2px', accentColor: 'var(--navy)' }} />
                <div>
                  <p className="font-semibold text-navy" style={{ fontSize: '14px', textTransform: 'capitalize', marginBottom: '3px' }}>{r}</p>
                  <p className="text-gray" style={{ fontSize: '13px' }}>{ROLE_DESC[r]}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Link href="/admin/users"
            style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: '600', fontSize: '14px', color: 'var(--text2)', textDecoration: 'none' }}>
            Cancel
          </Link>
          <button type="submit" disabled={loading}
            style={{ padding: '12px 28px', background: loading ? 'var(--gray4)' : 'var(--navy)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--navy)', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
