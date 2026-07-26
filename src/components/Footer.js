'use client';
import { useState } from 'react';
import Link from 'next/link';

export function FullFooter() {
    const [email, setEmail] = useState('');
    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <Link href="/" className="nav-logo" style={{ marginBottom: '24px', display: 'inline-block' }}>
                        <img src="/logo1.jpg" alt="RenoxMed" style={{ height: '86px', width: 'auto', display: 'block', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    </Link>
                    <p>US-based revenue cycle management for healthcare providers of all sizes. HIPAA-compliant since 2018. Starting at a fixed percentage of monthly collections.</p>
                    <div className="footer-certif">
                        <div className="certif-badge"><span className="cb-ico">🔒</span>HIPAA</div>
                        <div className="certif-badge"><span className="cb-ico">🛡️</span>SOC 2</div>
                        <div className="certif-badge"><span className="cb-ico">✅</span>AAPC</div>
                        <div className="certif-badge"><span className="cb-ico">🏥</span>MGMA</div>
                    </div>
                    <div className="social-row">
                        <Link href="https://linkedin.com" className="soc-btn" title="LinkedIn">in</Link>
                        <Link href="https://facebook.com" className="soc-btn" title="Facebook">f</Link>
                        <Link href="https://twitter.com" className="soc-btn" title="Twitter">𝕏</Link>
                        <Link href="https://youtube.com" className="soc-btn" title="YouTube">▶</Link>
                    </div>
                </div>
                <div className="footer-col">
                    <h5>RCM Services</h5>
                    <ul className="footer-links">
                        <li><Link href="/services/audit">Billing Audit</Link></li>
                        <li><Link href="/services/billing">Medical Billing</Link></li>
                        <li><Link href="/services/eligibility">Eligibility Verification</Link></li>
                        <li><Link href="/services/denial">Denial Management</Link></li>
                        <li><Link href="/services/ar">Account Receivable</Link></li>
                        <li><Link href="/services/credentialing">Credentialing</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h5>Specialties</h5>
                    <ul className="footer-links">
                        <li><Link href="/specialties">Cardiology</Link></li>
                        <li><Link href="/specialties">Orthopedics</Link></li>
                        <li><Link href="/specialties">Neurology</Link></li>
                        <li><Link href="/specialties">Family Practice</Link></li>
                        <li><Link href="/specialties">Pediatrics</Link></li>
                        <li><Link href="/specialties">View All 40+ →</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h5>Company</h5>
                    <ul className="footer-links">
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/states">States We Serve</Link></li>
                        <li><Link href="/blog">Blog & Resources</Link></li>
                        <li><Link href="/reviews">Client Reviews</Link></li>
                        <li><Link href="/faqs">FAQs</Link></li>
                        <li><Link href="/contact">Careers</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h5>Contact</h5>
                    <div className="footer-contact-item"><div className="fci-ico">📞</div><div><div className="fci-label">Phone</div><div className="fci-val">(513) 966-2259</div></div></div>
                    <div className="footer-contact-item"><div className="fci-ico">📧</div><div><div className="fci-label">Email</div><div className="fci-val">info@renoxmed.com</div></div></div>
                    <div className="footer-contact-item"><div className="fci-ico">📍</div><div><div className="fci-label">Office</div><div className="fci-val">Cincinnati, OH, USA</div></div></div>
                    <div className="footer-newsletter">
                        <p>Subscribe to billing updates:</p>
                        <div className="newsletter-form">
                            <input className="newsletter-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                            <button className="newsletter-btn" onClick={() => { setEmail(''); }} type="button">→</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-copy">© 2025 RenoxMed Medical Billing Inc. All rights reserved.</div>
                <div className="footer-legal">
                    <Link href="/">Privacy Policy</Link>
                    <Link href="/">Terms of Use</Link>
                    <Link href="/">HIPAA Notice</Link>
                    <Link href="/">Sitemap</Link>
                </div>
            </div>
        </footer>
    );
}

export function MiniFooter() {
    return (
        <footer className="site-footer" style={{ marginTop: 0 }}>
            <div className="footer-bottom" style={{ maxWidth: 1320, margin: '0 auto', padding: '24px 5%', border: 'none' }}>
                <div className="footer-copy">© 2025 RenoxMed Medical Billing Inc.</div>
                <div className="footer-legal">
                    <Link href="/">Home</Link>
                    <Link href="/">Privacy Policy</Link>
                    <Link href="/">HIPAA Notice</Link>
                </div>
            </div>
        </footer>
    );
}

export default FullFooter;
