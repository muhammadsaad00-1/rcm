'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'male',
    ssn_last_4: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to add patients');
      setLoading(false);
      return;
    }

    // Insert patient
    const { data, error: insertError } = await supabase
      .from('patients')
      .insert({
        ...formData,
        created_by: user.id
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Redirect to patient detail page
    router.push(`/patients/${data.id}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link href="/patients" style={{ 
            color: '#667eea', 
            textDecoration: 'none', 
            fontSize: '14px', 
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            ← Back to Patients
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginTop: '16px', color: '#1a202c' }}>
            Add New Patient
          </h1>
          <p style={{ color: '#718096', marginTop: '8px' }}>
            Enter patient demographics and contact information
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#2d3748' }}>
              Personal Information
            </h2>

            {error && (
              <div style={{
                background: '#fed7d7',
                color: '#c53030',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="John"
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Date of Birth *</label>
                <input
                  type="date"
                  name="date_of_birth"
                  required
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>SSN (Last 4)</label>
                <input
                  type="text"
                  name="ssn_last_4"
                  value={formData.ssn_last_4}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="1234"
                  maxLength="4"
                />
              </div>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '600', marginTop: '32px', marginBottom: '24px', color: '#2d3748' }}>
              Contact Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="patient@example.com"
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={inputStyle}
                placeholder="123 Main St"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="New York"
                />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="NY"
                  maxLength="2"
                />
              </div>
              <div>
                <label style={labelStyle}>ZIP Code</label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="10001"
                />
              </div>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '600', marginTop: '32px', marginBottom: '24px', color: '#2d3748' }}>
              Emergency Contact
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Contact Name</label>
                <input
                  type="text"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label style={labelStyle}>Contact Phone</label>
                <input
                  type="tel"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="(555) 987-6543"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px 32px',
                  background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Adding Patient...' : 'Add Patient'}
              </button>
              <Link href="/patients" style={{
                padding: '14px 32px',
                background: 'white',
                color: '#2d3748',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '500',
  color: '#2d3748',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none'
};
