'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Get user role from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, full_name')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      setError('Failed to fetch user details');
      setLoading(false);
      return;
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', data.user.id);

    // Redirect based on role
    setLoading(false);

    if (userData.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (userData.role === 'billing') {
      router.push('/billing/dashboard');
    } else if (userData.role === 'support') {
      router.push('/patients');
    } else if (userData.role === 'finance') {
      router.push('/payments/dashboard');
    } else {
      router.push(redirectTo);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-grid"></div>
      <div className="auth-glow"></div>
      <div className="auth-glow2"></div>
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.jpg" alt="RenoxMed" className="logo-img" />
          <div className="logo-text">
            <div className="logo-name">Renox<span>Med</span></div>
            <div className="logo-tag">Secure Portal</div>
          </div>
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Sign in to your RenoxMed dashboard</p>

        {error && (
          <div style={{ background: 'rgba(232,83,75,.1)', color: 'var(--red)', padding: '12px 16px', borderRadius: 'var(--r-sm)', marginBottom: 24, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@practice.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-row">
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div className="remember-row">
            <label><input type="checkbox" /> Remember me</label>
            <a style={{ cursor: 'pointer' }}>Forgot password?</a>
          </div>
          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-switch">
          Don&apos;t have an account? <Link href="/auth/signup">Sign up free</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--text3)' }}>← Back to Website</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card" style={{ textAlign: 'center', padding: 48 }}>Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
