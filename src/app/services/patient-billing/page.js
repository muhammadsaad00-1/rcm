import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';
import Image from 'next/image';

export default function PatientBillingPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM Services', href: '/services' }, { label: 'Patient Billing' }]} />
            <PageHero tag="📨 Patient Billing" title="Patient Billing &" titleAccent="Statement Services" description="Professional patient statement generation, balance follow-up, and payment plan management — maximizing patient collections while maintaining positive patient relationships." />
            <section className="section">
                <div className="container">
                    <div className="svc-detail-section">
                        <div>
                            <div className="sec-label">Our Approach</div>
                            <h2 className="sec-title">Collect More While Keeping Patients Happy</h2>
                            <p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>Patient responsibility now accounts for 30%+ of practice revenue. Our patient billing service ensures clear, professional statements are delivered promptly, payment plans are offered proactively, and collection follow-ups are handled with compassion and compliance.</p>
                            <ul className="check-list">
                                <li>Branded patient statement generation and delivery</li>
                                <li>Electronic and paper statement options</li>
                                <li>Automated balance reminder sequences</li>
                                <li>Payment plan setup and monitoring</li>
                                <li>Patient payment portal integration</li>
                                <li>Compassionate collections follow-up</li>
                                <li>Bad debt identification and write-off management</li>
                            </ul>
                        </div>
                        <div>
                            <Image src="/images/patient-billing.png" alt="Patient billing and communication" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} />
                        </div>
                    </div>
                    <div className="svc-detail-section">
                        <div>
                            <Image src="/images/coding-team.png" alt="Patient statement management" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} />
                        </div>
                        <div>
                            <div className="sec-label">Statement Cycle</div>
                            <h2 className="sec-title">Our Patient Billing Process</h2>
                            <div className="process-steps">
                                <div className="step-item"><div className="step-num">1</div><div className="step-body"><h4>Insurance EOB Processing</h4><p>Once payer adjudication is complete, we calculate the exact patient responsibility amount.</p></div></div>
                                <div className="step-item"><div className="step-num">2</div><div className="step-body"><h4>Statement Generation</h4><p>Clear, professional statements with itemized charges, insurance payments, and balance due.</p></div></div>
                                <div className="step-item"><div className="step-num">3</div><div className="step-body"><h4>Delivery & Follow-Up</h4><p>Statements delivered via mail, email, or patient portal with automated reminder sequences.</p></div></div>
                                <div className="step-item"><div className="step-num">4</div><div className="step-body"><h4>Payment Plan Options</h4><p>Flexible payment arrangements offered to patients who need them — reducing bad debt.</p></div></div>
                                <div className="step-item"><div className="step-num">5</div><div className="step-body"><h4>Collections Escalation</h4><p>Graduated escalation process for aged balances, always maintaining FDCPA compliance.</p></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section" style={{ background: 'var(--off)' }}>
                <div className="container">
                    <div className="grid-2 grid-align" style={{ gap: 60 }}>
                        <div><div className="sec-label">Get Started</div><h2 className="sec-title">Maximize Your Patient Collections</h2><p className="sec-sub">Stop losing revenue to patient non-payment. Our team collects an average of 94% of patient balances within 60 days.</p><div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}><Link href="/contact" className="btn-primary">Start Today</Link><Link href="/services" className="btn-outline">All Services</Link></div></div>
                        <div className="cform-wrap">
                            <div className="cform-title">Get a Free Consultation</div>
                            <div className="cform-sub">Speak with a patient billing specialist</div>
                            <div className="form-row"><div className="form-group"><label>Name *</label><input type="text" placeholder="Dr. Name" /></div><div className="form-group"><label>Practice Name *</label><input type="text" placeholder="Practice Name" /></div></div>
                            <div className="form-group"><label>Email *</label><input type="email" placeholder="email@practice.com" /></div>
                            <div className="form-group"><label>Phone *</label><input type="tel" placeholder="(555) 000-0000" /></div>
                            <div className="form-group"><label>Message</label><textarea placeholder="Tell us about your patient billing needs..."></textarea></div>
                            <button className="form-submit" type="button">Request Consultation →</button>
                        </div>
                    </div>
                </div>
            </section>
            <MiniFooter />
        </>
    );
}
