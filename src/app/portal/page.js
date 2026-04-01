import Link from 'next/link';
import FooterSimple from '@/components/FooterSimple';

export default function PortalPage() {
    return (
        <>
            <div className="portal-hero">
                <div className="breadcrumb" style={{ justifyContent: 'center', marginBottom: '20px' }}>
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Home</Link>
                    <span className="sep">›</span>
                    <span className="current">Portal Access</span>
                </div>
                <h1>Secure Portal Access</h1>
                <p>HIPAA-compliant access to your billing information, account statements, and practice analytics — anytime, anywhere.</p>
                <div className="portal-badges">
                    <span className="portal-badge">🔒 256-bit Encrypted</span>
                    <span className="portal-badge">✅ HIPAA Compliant</span>
                    <span className="portal-badge">📱 Mobile Friendly</span>
                </div>
            </div>

            <section>
                <div className="section-inner">
                    <div className="section-header centered">
                        <div className="section-tag">Choose Your Portal</div>
                        <h2 className="section-title">Who Are You?</h2>
                        <p className="section-desc" style={{ margin: '0 auto' }}>Select your portal below to access your account. Each portal is tailored to your specific role and access level.</p>
                    </div>
                    <div className="portal-options">
                        {/* Patient Portal */}
                        <div className="portal-card">
                            <div className="portal-icon" style={{ background: 'linear-gradient(135deg,#EBF8F5,#F0FFF4)' }}>🏥</div>
                            <h3>Patient Portal</h3>
                            <p>View your statements, pay outstanding balances, and access your billing history securely.</p>
                            <ul style={{ textAlign: 'left', color: 'var(--slate)', fontSize: '13px', marginBottom: '24px', paddingLeft: '20px', lineHeight: '2' }}>
                                <li>View outstanding balances</li>
                                <li>Track your claims status</li>
                                <li>See insurance on file</li>
                                <li>View payment history</li>
                                <li>Contact billing support</li>
                            </ul>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Link href="/portal/login" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                                    Patient Login →
                                </Link>
                                <Link href="/portal/signup" style={{ textAlign: 'center', fontSize: '13px', color: 'var(--slate)', textDecoration: 'underline' }}>
                                    New patient? Request access
                                </Link>
                            </div>
                        </div>

                        {/* Provider / Staff Portal */}
                        <div className="portal-card">
                            <div className="portal-icon" style={{ background: 'linear-gradient(135deg,#EBF3FF,#F0F4FF)' }}>👨‍⚕️</div>
                            <h3>Provider &amp; Staff Dashboard</h3>
                            <p>Full revenue cycle analytics, claim status tracking, denial management, and real-time KPI reporting for your practice.</p>
                            <ul style={{ textAlign: 'left', color: 'var(--slate)', fontSize: '13px', marginBottom: '24px', paddingLeft: '20px', lineHeight: '2' }}>
                                <li>Real-time claims status &amp; tracking</li>
                                <li>Revenue analytics dashboard</li>
                                <li>Denial reports &amp; appeal status</li>
                                <li>AR aging analysis</li>
                                <li>Provider performance reports</li>
                            </ul>
                            <Link href="/auth/login" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                                Staff / Provider Login →
                            </Link>
                        </div>

                        {/* Admin Portal */}
                        <div className="portal-card">
                            <div className="portal-icon" style={{ background: 'linear-gradient(135deg,#FFF5EB,#FFF8F0)' }}>⚙️</div>
                            <h3>Admin Portal</h3>
                            <p>Practice administrator access with user management, full billing oversight, custom reporting, and compliance tools.</p>
                            <ul style={{ textAlign: 'left', color: 'var(--slate)', fontSize: '13px', marginBottom: '24px', paddingLeft: '20px', lineHeight: '2' }}>
                                <li>Approve patient portal access</li>
                                <li>Manage staff accounts</li>
                                <li>Custom report builder</li>
                                <li>Staff access controls</li>
                                <li>HIPAA audit logs</li>
                            </ul>
                            <Link href="/auth/login" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                                Admin Login →
                            </Link>
                        </div>
                    </div>

                    {/* New Patient Help Box */}
                    <div className="portal-help-box">
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔑</div>
                        <h3 style={{ marginBottom: '8px' }}>New Patient? Here&apos;s How It Works</h3>
                        <p style={{ color: 'var(--slate)', marginBottom: '24px' }}>
                            Submit a portal access request with your name, email, and date of birth. An administrator will verify your identity and approve your account — then you can sign in to view your bills and payment history.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/portal/signup" className="btn-primary">Request Portal Access →</Link>
                            <Link href="/contact" className="btn-outline" style={{ borderColor: 'var(--border)', color: 'var(--navy)' }}>Contact Support</Link>
                        </div>
                    </div>
                </div>
            </section>

            <FooterSimple />
        </>
    );
}
