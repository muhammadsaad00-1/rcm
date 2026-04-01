import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';
import Image from 'next/image';

export default function CodingPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM Services', href: '/services' }, { label: 'Medical Coding' }]} />
            <PageHero tag="🔬 Medical Coding" title="Professional Medical" titleAccent="Coding Services" description="CPC-certified coders assign precise CPT, ICD-10-CM, and HCPCS codes with specialty-specific accuracy — ensuring maximum reimbursement on every encounter." />
            <section className="section">
                <div className="container">
                    <div className="svc-detail-section">
                        <div>
                            <div className="sec-label">Our Coding Expertise</div>
                            <h2 className="sec-title">Accurate Coding Is the Foundation of Your Revenue</h2>
                            <p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>Incorrect coding is the #1 cause of claim denials, underpayments, and compliance risk. Our CPC-certified coders bring deep specialty knowledge to every chart, ensuring codes are assigned accurately, documentation supports the level of service, and modifiers are applied correctly.</p>
                            <ul className="check-list">
                                <li>CPC-certified coders with specialty-specific training</li>
                                <li>CPT, ICD-10-CM, and HCPCS Level II code assignment</li>
                                <li>E/M leveling based on 2021 AMA guidelines</li>
                                <li>Modifier selection (25, 59, XE/XS/XU, LT/RT)</li>
                                <li>Surgical coding with global period tracking</li>
                                <li>Multi-specialty coding across 40+ disciplines</li>
                                <li>Coding compliance audit and education</li>
                            </ul>
                            <div className="info-box" style={{ marginTop: 28 }}>
                                <div className="info-box-title">📊 Impact</div>
                                <p>Practices using our coding service see an average 12% increase in per-encounter reimbursement within 90 days — simply by capturing codes that were previously missed.</p>
                            </div>
                        </div>
                        <div>
                            <Image src="/images/coding-team.png" alt="Medical coding experts at work" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} />
                        </div>
                    </div>
                    <div className="svc-detail-section">
                        <div>
                            <Image src="/images/billing-audit.png" alt="Certified coding team" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} />
                        </div>
                        <div>
                            <div className="sec-label">Coding Process</div>
                            <h2 className="sec-title">How Our Coding Process Works</h2>
                            <div className="process-steps">
                                <div className="step-item"><div className="step-num">1</div><div className="step-body"><h4>Chart Review</h4><p>Our coders review clinical documentation, operative notes, and provider attestation for completeness.</p></div></div>
                                <div className="step-item"><div className="step-num">2</div><div className="step-body"><h4>Code Assignment</h4><p>Precise CPT, ICD-10, and HCPCS codes assigned following CMS, AMA, and payer-specific guidelines.</p></div></div>
                                <div className="step-item"><div className="step-num">3</div><div className="step-body"><h4>Modifier Application</h4><p>Proper modifier selection to avoid bundling edits, ensure correct reimbursement, and prevent denials.</p></div></div>
                                <div className="step-item"><div className="step-num">4</div><div className="step-body"><h4>Quality Assurance</h4><p>Every coded encounter passes through a QA review by a senior coder before submission.</p></div></div>
                                <div className="step-item"><div className="step-num">5</div><div className="step-body"><h4>Feedback Loop</h4><p>We provide documentation improvement recommendations back to your providers to optimize future encounters.</p></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section" style={{ background: 'var(--off)' }}>
                <div className="container">
                    <div className="grid-2 grid-align" style={{ gap: 60 }}>
                        <div>
                            <div className="sec-label">Get Started</div>
                            <h2 className="sec-title">Ready to Improve Your Coding Accuracy?</h2>
                            <p className="sec-sub">Incorrect coding costs the average practice $125,000+ per year in underpayments and denials. Let us show you what you&apos;re leaving on the table.</p>
                            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}><Link href="/contact" className="btn-primary">Start Today</Link><Link href="/services" className="btn-outline">All Services</Link></div>
                        </div>
                        <div className="cform-wrap">
                            <div className="cform-title">Get a Free Consultation</div>
                            <div className="cform-sub">Speak with a coding specialist within 2 hours</div>
                            <div className="form-row"><div className="form-group"><label>Name *</label><input type="text" placeholder="Dr. Name" /></div><div className="form-group"><label>Practice Name *</label><input type="text" placeholder="Practice Name" /></div></div>
                            <div className="form-group"><label>Email *</label><input type="email" placeholder="email@practice.com" /></div>
                            <div className="form-group"><label>Phone *</label><input type="tel" placeholder="(555) 000-0000" /></div>
                            <div className="form-group"><label>Message</label><textarea placeholder="Tell us about your coding challenges..."></textarea></div>
                            <button className="form-submit" type="button">Request Consultation →</button>
                        </div>
                    </div>
                </div>
            </section>
            <MiniFooter />
        </>
    );
}
