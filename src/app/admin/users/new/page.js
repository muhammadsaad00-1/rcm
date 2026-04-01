'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'support',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      router.push('/admin/users');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', padding: '32px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link href="/admin/users" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            ← Back to Users
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginTop: '16px', color: '#1a202c' }}>
            Create New User
          </h1>
          <p style={{ color: '#718096', marginTop: '8px' }}>
            Add a new user to the system with their role and credentials
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <div style={{
                background: '#fed7d7',
                border: '1px solid #fc8181',
                color: '#c53030',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div style={{ display: 'grid', gap: '24px' }}>
              <FormField
                label="Full Name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />

              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
              />

              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '8px'
                }}>
                  Role <span style={{ color: '#e53e3e' }}>*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                >
                  <option value="support">Support</option>
                  <option value="billing">Billing</option>
                  <option value="finance">Finance</option>
                  <option value="admin">Admin</option>
                </select>
                <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
                  Select the user's role in the system
                </p>
              </div>

              <FormField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                helpText="Minimum 6 characters"
              />

              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'flex-end' }}>
              <Link href="/admin/users" style={{
                padding: '12px 24px',
                border: '1px solid #e2e8f0',
                background: 'white',
                color: '#4a5568',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                display: 'inline-block'
              }}>
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: loading ? '#a0aec0' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, type, value, onChange, placeholder, required, helpText }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '8px'
      }}>
        {label} {required && <span style={{ color: '#e53e3e' }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '14px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          outline: 'none'
        }}
      />
      {helpText && (
        <p style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
          {helpText}
        </p>
      )}
    </div>
  );
}
