'use client';

import { useState } from 'react';
import Link from 'next/link';
import FooterSimple from '@/components/FooterSimple';

export default function PatientSignupPage() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        dateOfBirth: '',
        phone: '',
        address: '',
        requestMessage: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!form.fullName || !form.email || !form.dateOfBirth) {
            setError('Full name, email, and date of birth are required.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/portal/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong. Please try again.');
                setLoading(false);
                return;
            }

            setSubmitted(true);
        } catch {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0B1E3D 0%,#1a3a6b 100%)', padding: '40px 20px' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '48px 40px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                        <h2 style={{ color: '#0B1E3D', marginBottom: '12px', fontSize: '24px' }}>Request Submitted!</h2>
                        <p style={{ color: '#6B7280', marginBottom: '24px', lineHeight: '1.7' }}>
                            Your portal access request has been received. An administrator will review and approve your account shortly.
                        </p>
                        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '16px', marginBottom: '28px' }}>
                            <p style={{ color: '#166534', fontSize: '14px', margin: 0 }}>
                                Once approved, you will be able to log in at <strong>/portal/login</strong> with the email address you provided.
                            </p>
                        </div>
                        <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '24px' }}>
                            No email notifications at this time — please check back or contact our billing office.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <Link href="/portal/login" style={{ background: '#0B1E3D', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                                Go to Login
                            </Link>
                            <Link href="/contact" style={{ border: '2px solid #E5E7EB', color: '#374151', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
                <FooterSimple />
            </>
        );
    }

    return (
        <>
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0B1E3D 0%,#1a3a6b 100%)', padding: '40px 20px' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '48px 40px', maxWidth: '560px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏥</div>
                        <h1 style={{ color: '#0B1E3D', fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>Request Portal Access</h1>
                        <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
                            Submit your details. An admin will review and approve your account — then you can log in to view your bills and statements.
                        </p>
                    </div>

                    {/* Info banner */}
                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '14px 16px', marginBottom: '28px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ fontSize: '16px', marginTop: '1px' }}>ℹ️</span>
                        <p style={{ color: '#1D4ED8', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
                            Your date of birth is used to verify your identity and match your medical billing record. Already have an account? <Link href="/portal/login" style={{ fontWeight: '600', color: '#1D4ED8' }}>Sign In →</Link>
                        </p>
                    </div>

                    {error && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#DC2626', fontSize: '14px' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Full Name <span style={{ color: '#EF4444' }}>*</span></label>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="As it appears on your insurance card"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                style={inputStyle}
                                required
                            />
                            <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>This will be your login email once approved.</p>
                        </div>

                        {/* Date of Birth + Phone (side by side) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div>
                                <label style={labelStyle}>Date of Birth <span style={{ color: '#EF4444' }}>*</span></label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={form.dateOfBirth}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="(555) 000-0000"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Home Address</label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="123 Main St, City, State, ZIP"
                                style={inputStyle}
                            />
                        </div>

                        {/* Optional message */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={labelStyle}>Message to Admin (optional)</label>
                            <textarea
                                name="requestMessage"
                                value={form.requestMessage}
                                onChange={handleChange}
                                placeholder="E.g. I visited on 01/15/2026 and need to view my bill from Dr. Smith."
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: loading ? '#9CA3AF' : '#0B1E3D',
                                color: 'white',
                                border: 'none',
                                padding: '14px',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            {loading ? 'Submitting Request...' : 'Submit Access Request →'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
                        <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                            Already approved?{' '}
                            <Link href="/portal/login" style={{ color: '#0B1E3D', fontWeight: '600', textDecoration: 'none' }}>Sign in here →</Link>
                        </p>
                        <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '8px' }}>
                            🔒 HIPAA Compliant &nbsp;·&nbsp; 256-bit Encrypted &nbsp;·&nbsp; <Link href="/contact" style={{ color: '#9CA3AF' }}>Need Help?</Link>
                        </p>
                    </div>

                </div>
            </div>
            <FooterSimple />
        </>
    );
}

const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
};

const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111827',
    background: '#FAFAFA',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};
