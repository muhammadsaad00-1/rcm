'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FooterSimple from '@/components/FooterSimple';

export default function PatientLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = createClient();

        // Sign in with Supabase auth
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError) {
            setError('Invalid email or password. Please check your credentials.');
            setLoading(false);
            return;
        }

        // Check if this user is a portal user (not a staff user)
        const { data: portalUser, error: portalError } = await supabase
            .from('patient_portal_users')
            .select('id, full_name, is_active')
            .eq('id', data.user.id)
            .single();

        if (portalError || !portalUser) {
            // Sign them back out — they may be a staff member using wrong portal
            await supabase.auth.signOut();
            setError('No patient portal account found for this email. If you are a staff member, please use the staff login.');
            setLoading(false);
            return;
        }

        if (!portalUser.is_active) {
            await supabase.auth.signOut();
            setError('Your portal account has been deactivated. Please contact our billing office for assistance.');
            setLoading(false);
            return;
        }

        // Update last login timestamp
        await supabase
            .from('patient_portal_users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', data.user.id);

        router.push('/portal/dashboard');
    };

    return (
        <>
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0B1E3D 0%,#1a3a6b 100%)', padding: '40px 20px' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '48px 40px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔑</div>
                        <h1 style={{ color: '#0B1E3D', fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>Patient Portal Login</h1>
                        <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
                            Sign in to view your bills, statements, and payment history.
                        </p>
                    </div>

                    {error && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#DC2626', fontSize: '14px', lineHeight: '1.6' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={inputStyle}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={labelStyle}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Your password"
                                style={inputStyle}
                                required
                                autoComplete="current-password"
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
                            }}
                        >
                            {loading ? 'Signing In...' : 'Sign In →'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
                        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '8px' }}>
                            New patient?{' '}
                            <Link href="/portal/signup" style={{ color: '#0B1E3D', fontWeight: '600', textDecoration: 'none' }}>Request portal access →</Link>
                        </p>
                        <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}>
                            Staff member?{' '}
                            <Link href="/auth/login" style={{ color: '#9CA3AF', textDecoration: 'underline' }}>Use staff login</Link>
                        </p>
                        <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '12px' }}>
                            🔒 HIPAA Compliant &nbsp;·&nbsp; <Link href="/contact" style={{ color: '#9CA3AF' }}>Need Help?</Link>
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
};
