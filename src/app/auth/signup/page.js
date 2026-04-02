'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('support');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError('Failed to create user account');
      setLoading(false);
      return;
    }

    // 2. Create user record in public.users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        phone: phone,
        role: role,
        is_active: true,
      });

    if (userError) {
      setError('Account created but failed to set up profile: ' + userError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-bg-grid"></div>
        <div className="auth-glow"></div>
        <div className="auth-glow2"></div>
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
          <h2 className="auth-title">Account Created!</h2>
          <p className="auth-sub">Your account has been created successfully. Please check your email to verify your account.</p>
          <p style={{ color: 'var(--text3)', fontSize: 14 }}>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-grid"></div>
      <div className="auth-glow"></div>
      <div className="auth-glow2"></div>
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <img src="/logo.jpg" alt="RenoxMed" className="logo-img" />
          <div className="logo-text"><div className="logo-name">Renox<span>Med</span></div></div>
        </div>
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-sub">Join RenoxMed to manage medical billing</p>

        {error && (
          <div style={{ background: 'rgba(232,83,75,.1)', color: 'var(--red)', padding: '12px 16px', borderRadius: 'var(--r-sm)', marginBottom: 24, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="form-group"><label>Full Name *</label><input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" /></div>
          <div className="form-group"><label>Email Address *</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@practice.com" /></div>
          <div className="form-group"><label>Phone Number</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" /></div>
          <div className="form-group">
            <label>Role *</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="support">Support - Patient Registration</option>
              <option value="billing">Billing - Claims Management</option>
              <option value="finance">Finance - Payment & Reporting</option>
            </select>
          </div>
          <div className="form-group">
            <label>Password *</label>
            <div className="password-row">
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
              <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>
          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-switch">Already have an account? <Link href="/auth/login">Sign in</Link></div>
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--text3)' }}>← Back to Website</Link>
        </div>
      </div>
    </div>
  );
}
