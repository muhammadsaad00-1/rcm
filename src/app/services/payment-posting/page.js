import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';
import Image from 'next/image';

export default function PaymentPostingPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM Services', href: '/services' }, { label: 'Payment Posting' }]} />
            <PageHero tag="💳 Payment Posting" title="Accurate Payment" titleAccent="Posting Services" description="Precise ERA/EOB posting, payment reconciliation, and contractual adjustment tracking — ensuring your financial records are always accurate and up-to-date." />
            <section className="section">
                <div className="container">
                    <div className="svc-detail-section">
                        <div>
                            <div className="sec-label">What We Handle</div>
                            <h2 className="sec-title">Every Payment Posted Accurately, Every Time</h2>
                            <p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>Inaccurate payment posting leads to incorrect patient balances, missed underpayments, and compliance issues. Our payment posting team ensures every ERA and EOB is reconciled correctly, contractual adjustments are applied properly, and discrepancies are flagged immediately.</p>
                            <ul className="check-list">
                                <li>Electronic Remittance Advice (ERA) auto-posting</li>
                                <li>Manual EOB posting for paper remittances</li>
                                <li>Contractual adjustment verification</li>
                                <li>Underpayment identification and flagging</li>
                                <li>Patient responsibility balance calculation</li>
                                <li>Denial reason code tracking and categorization</li>
                                <li>Daily reconciliation with deposit verification</li>
                            </ul>
                        </div>
                        <div>
                            <Image src="/images/billing-audit.png" alt="Payment posting and reconciliation" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} />
                        </div>
                    </div>
                    <div className="svc-detail-section">
                        <div>
                            <Image src="/images/denial-management.png" alt="Financial reconciliation team" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} />
                        </div>
                        <div>
                            <div className="sec-label">Key Metrics</div>
                            <h2 className="sec-title">What Accurate Payment Posting Delivers</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                                {[{ v: 'Industry-Leading', l: 'Posting Accuracy' }, { v: 'Fast', l: 'Posting Turnaround' }, { v: 'None', l: 'Missed Underpayments' }, { v: 'Consistent', l: 'ERA Auto-Match Rate' }].map(m => (
                                    <div key={m.l} style={{ background: 'var(--teal-soft)', border: '1px solid var(--teal-mid)', borderRadius: 'var(--r-md)', padding: 20, textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>{m.v}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 5, textTransform: 'uppercase', letterSpacing: '.05em' }}>{m.l}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="info-box" style={{ marginTop: 24 }}>
                                <div className="info-box-title">💡 Why It Matters</div>
                                <p>Incorrect payment posting is the hidden leak in revenue cycle management. On average, practices with manual posting suffer significant revenue losses from posting errors they never catch.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section" style={{ background: 'var(--off)' }}>
                <div className="container">
                    <div className="grid-2 grid-align" style={{ gap: 60 }}>
                        <div><div className="sec-label">Get Started</div><h2 className="sec-title">Eliminate Posting Errors Today</h2><p className="sec-sub">Let our team handle your payment posting with industry-leading accuracy so you can focus on patient care.</p><div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}><Link href="/contact" className="btn-primary">Start Today</Link><Link href="/services" className="btn-outline">All Services</Link></div></div>
                        <div className="cform-wrap">
                            <div className="cform-title">Get a Free Consultation</div>
                            <div className="cform-sub">Speak with a payment posting specialist</div>
                            <div className="form-row"><div className="form-group"><label>Name *</label><input type="text" placeholder="Dr. Name" /></div><div className="form-group"><label>Practice Name *</label><input type="text" placeholder="Practice Name" /></div></div>
                            <div className="form-group"><label>Email *</label><input type="email" placeholder="email@practice.com" /></div>
                            <div className="form-group"><label>Phone *</label><input type="tel" placeholder="(555) 000-0000" /></div>
                            <div className="form-group"><label>Message</label><textarea placeholder="Tell us about your payment posting needs..."></textarea></div>
                            <button className="form-submit" type="button">Request Consultation →</button>
                        </div>
                    </div>
                </div>
            </section>
            <MiniFooter />
        </>
    );
}
