import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';

export default function BillingPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM Services', href: '/services' }, { label: 'Medical Billing' }]} />
            <PageHero tag="🏷️ Medical Billing" title="Professional Medical" titleAccent="Billing Services" description="Accurate CPT/ICD-10 coding, claim preparation and electronic submission within 48 hours. CPC-certified billers with specialty-specific expertise across 40+ disciplines." />
            <section className="section">
                <div className="container">
                    <div className="svc-detail-section">
                        <div>
                            <div className="sec-label">Our Billing Process</div>
                            <h2 className="sec-title">From Clinical Notes to Paid Claims in 48 Hours</h2>
                            <p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>Our billing specialists review clinical documentation, assign precise CPT and ICD-10 codes, apply proper modifiers, scrub claims for errors, and submit electronically to 2,500+ payers — all within 48 hours of receiving your documentation.</p>
                            <ul className="check-list">
                                <li>CPC-certified coders for all 40+ specialties</li>
                                <li>CPT, ICD-10-CM and HCPCS code assignment</li>
                                <li>Proper modifier application (25, 59, LT/RT, etc.)</li>
                                <li>Electronic claim submission to 2,500+ payers</li>
                                <li>ERA/EOB posting and reconciliation</li>
                                <li>Secondary and tertiary billing included</li>
                                <li>Patient statement generation and management</li>
                            </ul>
                        </div>
                        <div><Image src="/images/coding-team.png" alt="Medical billing process" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} /></div>
                    </div>
                    <div className="svc-detail-section">
                        <div><Image src="/images/medical-team.png" alt="Medical billing team" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} /></div>
                        <div>
                            <div className="sec-label">Key Performance Metrics</div>
                            <h2 className="sec-title">What You Can Expect When You Switch to ClearClaim</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                                {[{ v: '98.3%', l: 'Clean Claim Rate' }, { v: '48 hrs', l: 'Submission Time' }, { v: '+21%', l: 'Avg Revenue Increase' }, { v: '18 days', l: 'Average AR Days' }].map(m => (
                                    <div key={m.l} style={{ background: 'var(--teal-soft)', border: '1px solid var(--teal-mid)', borderRadius: 'var(--r-md)', padding: 20, textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>{m.v}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 5, textTransform: 'uppercase', letterSpacing: '.05em' }}>{m.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section" style={{ background: 'var(--off)' }}>
                <div className="container">
                    <div className="grid-2 grid-align" style={{ gap: 60 }}>
                        <div><div className="sec-label">Get Started</div><h2 className="sec-title">Ready to Improve Your Clean Claim Rate?</h2><p className="sec-sub">Join 1,200+ providers who trust ClearClaim with their medical billing. Request a free audit to see how much additional revenue you can recover.</p><div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}><Link href="/contact" className="btn-primary">Start Today</Link><Link href="/services" className="btn-outline">All Services</Link></div></div>
                        <div className="cform-wrap"><div className="cform-title">Get a Free Consultation</div><div className="cform-sub">Speak with a billing specialist within 2 hours</div>
                            <div className="form-row"><div className="form-group"><label>Name *</label><input type="text" placeholder="Dr. Name" /></div><div className="form-group"><label>Practice Name *</label><input type="text" placeholder="Practice Name" /></div></div>
                            <div className="form-group"><label>Email *</label><input type="email" placeholder="email@practice.com" /></div>
                            <div className="form-group"><label>Phone *</label><input type="tel" placeholder="(555) 000-0000" /></div>
                            <div className="form-group"><label>Message</label><textarea placeholder="Tell us about your billing challenges..."></textarea></div>
                            <button className="form-submit" type="button">Request Consultation →</button>
                        </div>
                    </div>
                </div>
            </section>
            <MiniFooter />
        </>
    );
}
