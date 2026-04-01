import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';

export default function AuditPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM Services', href: '/services' }, { label: 'Medical Billing Audit' }]} />
            <PageHero tag="🔎 Billing Audit" title="Medical Billing" titleAccent="Audit Services" description="A comprehensive review of your practice's billing processes — uncovering lost revenue, coding errors, compliance risks, and inefficiencies that cost you thousands every month." />
            <section className="section">
                <div className="container">
                    <div className="svc-detail-section">
                        <div>
                            <div className="sec-label">What We Audit</div>
                            <h2 className="sec-title">A Deep Dive Into Every Aspect of Your Revenue Cycle</h2>
                            <p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>Our certified billing auditors examine 12 months of claims data, identify patterns of undercoding and overcoding, flag compliance vulnerabilities, and benchmark your performance against specialty-specific standards.</p>
                            <ul className="check-list">
                                <li>CPT and ICD-10 coding accuracy assessment</li>
                                <li>Modifier usage review and correction</li>
                                <li>E/M documentation level analysis</li>
                                <li>Claim denial pattern identification</li>
                                <li>Payer contract performance review</li>
                                <li>HIPAA compliance vulnerability assessment</li>
                                <li>Benchmark comparison vs. specialty peers</li>
                            </ul>
                            <div className="info-box" style={{ marginTop: 28 }}>
                                <div className="info-box-title">💡 Did You Know?</div>
                                <p>The average medical practice loses 15–22% of earned revenue to billing errors and inefficiencies. Our audit typically reveals $40,000–$200,000 in recoverable annual revenue.</p>
                            </div>
                        </div>
                        <div><Image src="/images/billing-audit.png" alt="Medical billing audit process" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} /></div>
                    </div>
                    <div className="svc-detail-section">
                        <div><Image src="/images/medical-team.png" alt="Billing audit specialists" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} /></div>
                        <div>
                            <div className="sec-label">Audit Process</div>
                            <h2 className="sec-title">How Our Billing Audit Works</h2>
                            <div className="process-steps">
                                <div className="step-item"><div className="step-num">1</div><div className="step-body"><h4>Data Collection & Access</h4><p>Secure HIPAA-compliant access to your EHR/billing system. We pull 90–365 days of claims data for analysis.</p></div></div>
                                <div className="step-item"><div className="step-num">2</div><div className="step-body"><h4>Coding & Documentation Review</h4><p>Line-by-line review of CPT codes, ICD-10 diagnoses, modifiers and supporting clinical documentation.</p></div></div>
                                <div className="step-item"><div className="step-num">3</div><div className="step-body"><h4>Denial & Pattern Analysis</h4><p>We categorize every denial by root cause, payer and provider to identify systemic issues.</p></div></div>
                                <div className="step-item"><div className="step-num">4</div><div className="step-body"><h4>Revenue Recovery Report</h4><p>Detailed findings report with specific dollar amounts of recoverable revenue and prioritized action steps.</p></div></div>
                                <div className="step-item"><div className="step-num">5</div><div className="step-body"><h4>Live Presentation & Recommendations</h4><p>60-minute call with your team to walk through findings and create a revenue recovery roadmap.</p></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section" style={{ background: 'var(--off)' }}>
                <div className="container">
                    <div className="grid-2 grid-align" style={{ gap: 60 }}>
                        <div>
                            <div className="sec-label">Request a Billing Audit</div>
                            <h2 className="sec-title">Get Your Free Billing Audit</h2>
                            <p className="sec-sub">Complete the form and a billing audit specialist will contact you within 2 hours to schedule your complimentary practice review.</p>
                            <div style={{ marginTop: 28 }}>
                                <div className="cinfo-card"><div className="cinfo-ico">⏱️</div><div><div className="cinfo-label">Turnaround</div><div className="cinfo-val">Results delivered within 5–7 business days</div></div></div>
                                <div className="cinfo-card"><div className="cinfo-ico">🔒</div><div><div className="cinfo-label">Confidential</div><div className="cinfo-val">All data handled under signed BAA</div></div></div>
                                <div className="cinfo-card"><div className="cinfo-ico">💲</div><div><div className="cinfo-label">Cost</div><div className="cinfo-val">100% Free — No Obligation Whatsoever</div></div></div>
                            </div>
                        </div>
                        <div className="cform-wrap">
                            <div className="cform-title">Request Your Billing Audit</div>
                            <div className="cform-sub">Free · Confidential · No Commitment Required</div>
                            <div className="form-row"><div className="form-group"><label>First Name *</label><input type="text" placeholder="Dr. Jane" /></div><div className="form-group"><label>Last Name *</label><input type="text" placeholder="Doe" /></div></div>
                            <div className="form-group"><label>Practice Name *</label><input type="text" placeholder="Doe Family Medicine" /></div>
                            <div className="form-group"><label>Email Address *</label><input type="email" placeholder="jane@yourpractice.com" /></div>
                            <div className="form-group"><label>Phone *</label><input type="tel" placeholder="(555) 000-0000" /></div>
                            <div className="form-group"><label>Specialty</label><select><option>Select Specialty</option><option>Cardiology</option><option>Orthopedics</option><option>Family Practice</option><option>Internal Medicine</option><option>Other</option></select></div>
                            <div className="form-group"><label>Current EHR / Billing Software</label><input type="text" placeholder="Epic, Athena, Kareo..." /></div>
                            <button className="form-submit" type="button">Request Free Billing Audit →</button>
                            <p className="form-note">🔒 HIPAA Protected · No spam, ever</p>
                        </div>
                    </div>
                </div>
            </section>
            <MiniFooter />
        </>
    );
}
