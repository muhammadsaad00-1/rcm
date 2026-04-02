'use client';
import { useState } from 'react';
import Link from 'next/link';

export function FullFooter() {
    const [email, setEmail] = useState('');
    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <Link href="/" className="nav-logo" style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center' }}>
                        <img src="/logo-transparent.png" alt="RenoxMed" style={{ height: '110px', width: 'auto', display: 'block' }} />
                    </Link>
                    <p>US-based revenue cycle management for healthcare providers of all sizes. HIPAA-compliant since 2012. Starting at 2.95% of monthly collections.</p>
                    <div className="footer-certif">
                        <div className="certif-badge"><span className="cb-ico">🔒</span>HIPAA</div>
                        <div className="certif-badge"><span className="cb-ico">🛡️</span>SOC 2</div>
                        <div className="certif-badge"><span className="cb-ico">✅</span>AAPC</div>
                        <div className="certif-badge"><span className="cb-ico">🏥</span>MGMA</div>
                    </div>
                    <div className="social-row">
                        <div className="soc-btn" title="LinkedIn">in</div>
                        <div className="soc-btn" title="Facebook">f</div>
                        <div className="soc-btn" title="Twitter">𝕏</div>
                        <div className="soc-btn" title="YouTube">▶</div>
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
                    <div className="footer-contact-item"><div className="fci-ico">📞</div><div><div className="fci-label">Phone</div><div className="fci-val">(866) 200-7200</div></div></div>
                    <div className="footer-contact-item"><div className="fci-ico">📧</div><div><div className="fci-label">Email</div><div className="fci-val">info@renoxmed.com</div></div></div>
                    <div className="footer-contact-item"><div className="fci-ico">📍</div><div><div className="fci-label">Office</div><div className="fci-val">Dallas, TX 75201</div></div></div>
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
                    <a>Privacy Policy</a>
                    <a>Terms of Use</a>
                    <a>HIPAA Notice</a>
                    <a>Sitemap</a>
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
                    <a>Privacy Policy</a>
                    <a>HIPAA Notice</a>
                </div>
            </div>
        </footer>
    );
}

export default FullFooter;
