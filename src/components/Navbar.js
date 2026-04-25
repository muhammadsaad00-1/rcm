'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => { setMobileOpen(false); }, [pathname]);
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const isActive = (paths) => paths.some(p => p === '/' ? pathname === '/' : pathname.startsWith(p));

    return (
        <>
            {/* Topbar */}
            <div className="topbar">
                <div className="topbar-left">
                    <div className="tb-item"><span>📞</span>&nbsp;<a href="tel:8662007200" style={{ color: 'rgba(255,255,255,.6)' }}>(866) 200-7200</a></div>
                    <div className="tb-item"><span>✉</span>&nbsp;<a href="mailto:info@renoxmed.com" style={{ color: 'rgba(255,255,255,.6)' }}>info@renoxmed.com</a></div>
                    <div className="tb-item"><span>📍</span>&nbsp;Ohio, USA</div>
                </div>
                <div className="topbar-right">
                    <a>HIPAA Compliant</a>
                    <Link href="/blog">Blog</Link>
                    <Link href="/reviews">Reviews</Link>
                    <Link href="/contact" className="top-cta">Free Audit →</Link>
                </div>
            </div>

            {/* Nav */}
            <nav className="site-nav">
                <div className="nav-inner">
                    <Link href="/" className="nav-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0' }}>
                        <div style={{ height: '52px', overflow: 'hidden', display: 'flex', alignItems: 'flex-start' }}>
                            <img src="/logo-transparent.png" alt="RenoxMed" style={{ height: '70px', width: 'auto', maxWidth: 'none', display: 'block' }} />
                        </div>
                        <span className="logo-tagline" style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: '600', marginTop: '-4px', marginLeft: '5px' }}>Transforming Healthcare Revenue</span>
                    </Link>

                    <ul className="nav-menu">
                        {/* RCM */}
                        <li className="nav-item">
                            <Link href="/services" className={`nav-link${isActive(['/services']) ? ' active' : ''}`}>
                                Revenue Cycle Management <span className="nav-chevron">▾</span>
                            </Link>
                            <div className="dropdown">
                                <div className="dropdown-inner dd-cols-3">
                                    <div className="dd-header"><h4>RCM Services — Individual Pages</h4></div>
                                    <Link href="/services/audit" className="dd-item"><div className="dd-icon">🔎</div><div><div className="dd-item-title">Medical Billing Audit</div><div className="dd-item-sub">Detailed analysis of your practice billing</div></div></Link>
                                    <Link href="/services/billing" className="dd-item"><div className="dd-icon">🏷️</div><div><div className="dd-item-title">Medical Billing</div><div className="dd-item-sub">Clean claim submissions within 48hrs</div></div></Link>
                                    <Link href="/services/eligibility" className="dd-item"><div className="dd-icon">✅</div><div><div className="dd-item-title">Eligibility Verification</div><div className="dd-item-sub">Real-time insurance benefit checks</div></div></Link>
                                    <Link href="/services/denial" className="dd-item"><div className="dd-icon">🚫</div><div><div className="dd-item-title">Denial Management</div><div className="dd-item-sub">Prevent and resolve claim denials fast</div></div></Link>
                                    <Link href="/services/ar" className="dd-item"><div className="dd-icon">💰</div><div><div className="dd-item-title">Account Receivable</div><div className="dd-item-sub">Maximize collections, minimize AR days</div></div></Link>
                                    <Link href="/services/credentialing" className="dd-item"><div className="dd-icon">📋</div><div><div className="dd-item-title">Credentialing & Enrollment</div><div className="dd-item-sub">Payer enrollment & license management</div></div></Link>
                                    <Link href="/services/coding" className="dd-item"><div className="dd-icon">🔬</div><div><div className="dd-item-title">Medical Coding</div><div className="dd-item-sub">Certified CPT & ICD-10 coding</div></div></Link>
                                    <Link href="/services/payment-posting" className="dd-item"><div className="dd-icon">💳</div><div><div className="dd-item-title">Payment Posting</div><div className="dd-item-sub">Accurate ERA/EOB reconciliation</div></div></Link>
                                    <Link href="/services/patient-billing" className="dd-item"><div className="dd-icon">📨</div><div><div className="dd-item-title">Patient Billing</div><div className="dd-item-sub">Statement management & collections</div></div></Link>
                                </div>
                            </div>
                        </li>

                        {/* Specialties */}
                        <li className="nav-item">
                            <Link href="/specialties" className={`nav-link${isActive(['/specialties']) ? ' active' : ''}`}>
                                Specialties <span className="nav-chevron">▾</span>
                            </Link>
                            <div className="dropdown">
                                <div className="dropdown-inner">
                                    <div className="dd-header"><h4>Medical Specialties We Serve</h4></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                                        <Link href="/specialties" className="dd-item"><div className="dd-icon">🫀</div><div><div className="dd-item-title">Cardiology</div><div className="dd-item-sub">EP, interventional, nuclear</div></div></Link>
                                        <Link href="/specialties" className="dd-item"><div className="dd-icon">🧠</div><div><div className="dd-item-title">Neurology</div><div className="dd-item-sub">Brain, spine, pain management</div></div></Link>
                                        <Link href="/specialties" className="dd-item"><div className="dd-icon">🦴</div><div><div className="dd-item-title">Orthopedics</div><div className="dd-item-sub">Sports medicine, joint replacement</div></div></Link>
                                        <Link href="/specialties" className="dd-item"><div className="dd-icon">👶</div><div><div className="dd-item-title">Pediatrics</div><div className="dd-item-sub">Primary care & neonatology</div></div></Link>
                                        <Link href="/specialties" className="dd-item"><div className="dd-icon">🩺</div><div><div className="dd-item-title">Family Practice</div><div className="dd-item-sub">General & preventive care</div></div></Link>
                                        <Link href="/specialties" className="dd-item"><div className="dd-icon">🔬</div><div><div className="dd-item-title">Internal Medicine</div><div className="dd-item-sub">Chronic disease management</div></div></Link>
                                    </div>
                                    <Link href="/specialties" className="dd-item" style={{ background: 'var(--teal-soft)', borderRadius: 8, marginTop: 6 }}>
                                        <div className="dd-icon" style={{ background: 'var(--teal-mid)' }}>🏥</div>
                                        <div><div className="dd-item-title">View All 40+ Specialties →</div><div className="dd-item-sub">Behavioral Specialty, Urgent Care, Oncology, and more</div></div>
                                    </Link>
                                </div>
                            </div>
                        </li>

                        {/* States */}
                        <li className="nav-item">
                            <Link href="/states" className={`nav-link${isActive(['/states']) ? ' active' : ''}`}>
                                States We Serve <span className="nav-chevron">▾</span>
                            </Link>
                            <div className="dropdown" style={{ minWidth: 560 }}>
                                <div className="dropdown-inner">
                                    <div className="dd-header"><h4>We serve all 50 US States</h4></div>
                                    <div className="dd-states-grid">
                                        {[{f:'🏙️',n:'Illinois'},{f:'🤠',n:'Texas'},{f:'🌴',n:'Florida'},{f:'🌞',n:'California'},{f:'🗽',n:'New York'},{f:'🏔️',n:'Colorado'},{f:'🌊',n:'Washington'},{f:'🌻',n:'Ohio'}].map(s => (
                                            <Link key={s.n} href="/states" className="dd-state"><span className="dd-state-flag">{s.f}</span>{s.n}</Link>
                                        ))}
                                    </div>
                                    <div className="dd-promo">
                                        <div className="dd-promo-text"><h5>Serving All 50 States</h5><p>State-specific Medicaid rules & compliance</p></div>
                                        <Link href="/states" className="dd-promo-btn">View All States</Link>
                                    </div>
                                </div>
                            </div>
                        </li>

                        {/* Learn */}
                        <li className="nav-item">
                            <span className={`nav-link${isActive(['/about', '/blog', '/reviews', '/faqs']) ? ' active' : ''}`}>
                                Learn <span className="nav-chevron">▾</span>
                            </span>
                            <div className="dropdown" style={{ minWidth: 400, left: 'auto', right: 0, transform: 'none' }}>
                                <div className="dropdown-inner">
                                    <Link href="/about" className="dd-item"><div className="dd-icon">🏢</div><div><div className="dd-item-title">About Us</div><div className="dd-item-sub">Our story, team & mission</div></div></Link>
                                    <Link href="/blog" className="dd-item"><div className="dd-icon">📚</div><div><div className="dd-item-title">Blog & Resources</div><div className="dd-item-sub">Guides, tips, industry insights</div></div></Link>
                                    <Link href="/reviews" className="dd-item"><div className="dd-icon">⭐</div><div><div className="dd-item-title">Client Reviews</div><div className="dd-item-sub">See what practices say about us</div></div></Link>
                                    <Link href="/faqs" className="dd-item"><div className="dd-icon">❓</div><div><div className="dd-item-title">FAQs</div><div className="dd-item-sub">Common questions answered</div></div></Link>
                                </div>
                            </div>
                        </li>

                        {/* Contact */}
                        <li className="nav-item">
                            <Link href="/contact" className={`nav-link${isActive(['/contact']) ? ' active' : ''}`}>Contact Us</Link>
                        </li>
                    </ul>

                    <div className="nav-right">
                        <Link href="/auth/login" className="btn-modern btn-modern-outline" style={{ background: 'var(--white)' }}>Login</Link>
                        <Link href="/contact" className="btn-modern btn-modern-primary">Free Practice Audit</Link>
                    </div>

                    <div className={`nav-hamburger${mobileOpen ? ' mobile-open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
                        <div className="ham-lines"><span></span><span></span><span></span></div>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav */}
            <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
                <div className="mob-nav-section">
                    <div className="mob-nav-title">RCM Services</div>
                    <Link href="/services/audit" className="mob-nav-link" onClick={() => setMobileOpen(false)}>🔎 Medical Billing Audit</Link>
                    <Link href="/services/billing" className="mob-nav-link" onClick={() => setMobileOpen(false)}>🏷️ Medical Billing</Link>
                    <Link href="/services/eligibility" className="mob-nav-link" onClick={() => setMobileOpen(false)}>✅ Eligibility Verification</Link>
                    <Link href="/services/denial" className="mob-nav-link" onClick={() => setMobileOpen(false)}>🚫 Denial Management</Link>
                    <Link href="/services/ar" className="mob-nav-link" onClick={() => setMobileOpen(false)}>💰 Account Receivable</Link>
                    <Link href="/services/credentialing" className="mob-nav-link" onClick={() => setMobileOpen(false)}>📋 Credentialing</Link>
                    <Link href="/services/coding" className="mob-nav-link" onClick={() => setMobileOpen(false)}>🔬 Medical Coding</Link>
                    <Link href="/services/payment-posting" className="mob-nav-link" onClick={() => setMobileOpen(false)}>💳 Payment Posting</Link>
                    <Link href="/services/patient-billing" className="mob-nav-link" onClick={() => setMobileOpen(false)}>📨 Patient Billing</Link>
                </div>
                <div className="mob-nav-section">
                    <div className="mob-nav-title">Company</div>
                    <Link href="/specialties" className="mob-nav-link" onClick={() => setMobileOpen(false)}>🏥 Specialties</Link>
                    <Link href="/states" className="mob-nav-link" onClick={() => setMobileOpen(false)}>🗺️ States We Serve</Link>
                    <Link href="/about" className="mob-nav-link" onClick={() => setMobileOpen(false)}>🏢 About Us</Link>
                    <Link href="/blog" className="mob-nav-link" onClick={() => setMobileOpen(false)}>📚 Blog</Link>
                    <Link href="/faqs" className="mob-nav-link" onClick={() => setMobileOpen(false)}>❓ FAQs</Link>
                    <Link href="/contact" className="mob-nav-link" onClick={() => setMobileOpen(false)}>📬 Contact Us</Link>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <Link href="/auth/login" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Login</Link>
                    <Link href="/contact" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Free Audit</Link>
                </div>
            </div>
        </>
    );
}
