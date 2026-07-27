'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PatientEditForm({ patient, role }) {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: patient.first_name || '',
    last_name: patient.last_name || '',
    date_of_birth: patient.date_of_birth || '',
    gender: patient.gender || '',
    ssn_last_4: patient.ssn_last_4 || '',
    phone: patient.phone || '',
    email: patient.email || '',
    address: patient.address || '',
    city: patient.city || '',
    state: patient.state || '',
    zip_code: patient.zip_code || '',
    emergency_contact_name: patient.emergency_contact_name || '',
    emergency_contact_phone: patient.emergency_contact_phone || '',
    is_active: patient.is_active,
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
    setSuccess(false);

    try {
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update patient');
      setSuccess(true);
      setTimeout(() => router.push(`/patients/${patient.id}`), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Permanently delete ${patient.first_name} ${patient.last_name}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patient.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/patients');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Link href={`/patients/${patient.id}`} style={{ color: 'var(--teal)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            ← Back to Patient
          </Link>
          <h1 className="text-navy font-bold" style={{ fontSize: '28px', letterSpacing: '-0.02em', marginTop: '8px' }}>
            Edit — {patient.first_name} {patient.last_name}
          </h1>
        </div>
        {role === 'admin' && (
          <button onClick={handleDelete} disabled={loading}
            style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
            Delete Patient
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
          Patient updated successfully. Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Demographics */}
        <div className="card-modern" style={{ marginBottom: '20px' }}>
          <h2 className="text-navy font-semibold" style={{ fontSize: '16px', marginBottom: '20px' }}>Demographics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="First Name *" name="first_name" value={form.first_name} onChange={handleChange} required />
            <Field label="Last Name *" name="last_name" value={form.last_name} onChange={handleChange} required />
            <Field label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} />
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--navy)', marginBottom: '6px' }}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Field label="SSN Last 4" name="ssn_last_4" value={form.ssn_last_4} onChange={handleChange} maxLength={4} placeholder="0000" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '28px' }}>
              <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
              <label htmlFor="is_active" className="font-semibold text-navy" style={{ fontSize: '14px' }}>Active Patient</label>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card-modern" style={{ marginBottom: '20px' }}>
          <h2 className="text-navy font-semibold" style={{ fontSize: '16px', marginBottom: '20px' }}>Contact Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Field label="Address" name="address" value={form.address} onChange={handleChange} />
            <Field label="City" name="city" value={form.city} onChange={handleChange} />
            <Field label="State" name="state" value={form.state} onChange={handleChange} />
            <Field label="ZIP Code" name="zip_code" value={form.zip_code} onChange={handleChange} />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="card-modern" style={{ marginBottom: '24px' }}>
          <h2 className="text-navy font-semibold" style={{ fontSize: '16px', marginBottom: '20px' }}>Emergency Contact</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Name" name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} />
            <Field label="Phone" name="emergency_contact_phone" type="tel" value={form.emergency_contact_phone} onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Link href={`/patients/${patient.id}`}
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

function Field({ label, name, value, onChange, type = 'text', required, placeholder, maxLength }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--navy)', marginBottom: '6px' }}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder} maxLength={maxLength}
        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  );
}
