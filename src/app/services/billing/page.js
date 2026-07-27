import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export default function BillingPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM Services', href: '/services' }, { label: 'Medical Billing' }]} />
            <PageHero tag="🏷️ Medical Billing" title="Professional Medical" titleAccent="Billing Services" description="Accurate CPT/ICD-10 coding, claim preparation and fast electronic submission. CPC-certified billers with specialty-specific expertise across 40+ disciplines." />
            <section className="section">
                <div className="container">
                    <div className="svc-detail-section">
                        <div>
                            <div className="sec-label">Our Billing Process</div>
                            <h2 className="sec-title">From Clinical Notes to Paid Claims — Fast</h2>
                            <p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>Our billing specialists review clinical documentation, assign precise CPT and ICD-10 codes, apply proper modifiers, scrub claims for errors, and submit electronically to thousands of payers — rapidly after receiving your documentation.</p>
                            <ul className="check-list">
                                <li>CPC-certified coders for all 40+ specialties</li>
                                <li>CPT, ICD-10-CM and HCPCS code assignment</li>
                                <li>Proper modifier application (25, 59, LT/RT, etc.)</li>
                                <li>Electronic claim submission to thousands of payers</li>
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
                            <h2 className="sec-title">What You Can Expect When You Switch to RenoxMed</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                                {[{ v: 'Industry-Leading', l: 'Clean Claim Rate' }, { v: 'Fast', l: 'Submission Time' }, { v: 'Improved', l: 'Avg Revenue Increase' }, { v: 'Low', l: 'Average AR Days' }].map(m => (
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
                        <div><div className="sec-label">Get Started</div><h2 className="sec-title">Ready to Improve Your Clean Claim Rate?</h2><p className="sec-sub">Join many providers who trust RenoxMed with their medical billing. Request a free audit to see how much additional revenue you can recover.</p><div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}><Link href="/contact" className="btn-primary">Start Today</Link><Link href="/services" className="btn-outline">All Services</Link></div></div>
                        <ContactForm
                            title="Get a Free Consultation"
                            subtitle="Speak with a billing specialist promptly"
                            submitButtonText="Request Consultation →"
                            emailSubject="Medical Billing Inquiry"
                            includeEHR={false}
                        />
                    </div>
                </div>
            </section>
            <MiniFooter />
        </>
    );
}
