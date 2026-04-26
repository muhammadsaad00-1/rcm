import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import CtaBanner from '@/components/CtaBanner';
import { MiniFooter } from '@/components/Footer';

export default function AboutPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
            <PageHero tag="🏢 Our Story" title="About" titleAccent="RenoxMed" description="Founded in 2018 by healthcare administrators who watched thousands slip through billing inefficiencies — and decided to fix it." />
            <section className="section"><div className="container">
                <div className="about-story">
                    <div>
                        <div className="sec-label">Our Story</div>
                        <h2 className="sec-title">Built by Billers, for Clinicians</h2>
                        <p style={{ color: 'var(--text3)', lineHeight: 1.8, marginBottom: 16 }}>RenoxMed was founded after our CEO spent over a decade as a practice administrator watching healthcare providers lose significant revenue annually to billing errors, coding inefficiencies, and uncollected claims.</p>
                        <p style={{ color: 'var(--text3)', lineHeight: 1.8, marginBottom: 16 }}>In 2018, he assembled a team of CPC-certified coders, healthcare attorneys, and revenue cycle technology experts to build a smarter billing company — one that combined human expertise with technology to achieve results that in-house billing never could.</p>
                        <p style={{ color: 'var(--text3)', lineHeight: 1.8, marginBottom: 28 }}>Today, RenoxMed serves multiple providers across many specialties, processing thousands in annual claims from our US-based headquarters in Ohio, USA.</p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}><Link href="/contact" className="btn-primary">Work With Us</Link><Link href="/services" className="btn-outline">Our Services</Link></div>
                    </div>
                    <div className="about-img">
                        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle,rgba(0,201,167,.2),transparent 70%)' }}></div>
                        <div className="about-img-inner">
                            <div className="abt-stat"><span className="abt-val">Thousands+</span><span className="abt-lbl">Annual Claims Processed</span></div>
                            <div className="abt-stat"><span className="abt-val">2018</span><span className="abt-lbl">Year Founded</span></div>
                            <div className="abt-stat"><span className="abt-val">Multiple</span><span className="abt-lbl">Provider Clients</span></div>
                            <div className="abt-stat"><span className="abt-val">Expert</span><span className="abt-lbl">US-Based Staff</span></div>
                            <div className="abt-stat"><span className="abt-val">High</span><span className="abt-lbl">Clean Claim Rate</span></div>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 80 }}><div className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>Our Values</div><h2 className="sec-title center">What We Stand For</h2></div>
                <div className="values-grid">
                    <div className="val-card"><div className="val-ico">🎯</div><h4>Accuracy First</h4><p>We hold ourselves to a 98%+ clean claim standard. Every claim reviewed before submission.</p></div>
                    <div className="val-card"><div className="val-ico">🤝</div><h4>True Partnership</h4><p>We are an extension of your team — not a vendor. Your KPIs are our performance benchmarks.</p></div>
                    <div className="val-card"><div className="val-ico">🔍</div><h4>Full Transparency</h4><p>Real-time access to every claim, denial, and payment. No black-box billing, ever.</p></div>
                    <div className="val-card"><div className="val-ico">🔒</div><h4>Uncompromising Compliance</h4><p>HIPAA, SOC 2, FIPS — audited annually by independent third parties.</p></div>
                    <div className="val-card"><div className="val-ico">⚡</div><h4>Technology-Driven</h4><p>AI claim scrubbing, automation, and live analytics give you an unfair competitive advantage.</p></div>
                    <div className="val-card"><div className="val-ico">❤️</div><h4>Patient-Centered Billing</h4><p>We treat your patients' billing experience with the same care you give their health.</p></div>
                </div>
                <div style={{ marginTop: 80 }}><div className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>Reliability & Trust</div><h2 className="sec-title center">An Experienced Team You Can Count On</h2></div>
                <div style={{ maxWidth: 800, margin: '0 auto 40px', textAlign: 'center', color: 'var(--text3)', lineHeight: 1.8 }}>
                    Our team brings together decades of collective experience in medical billing, coding compliance, and healthcare technology. We don't just process claims; we partner with your practice to ensure long-term financial health and operational stability.
                </div>
                <div className="values-grid">
                    <div className="val-card"><div className="val-ico">🛡️</div><h4>Proven Reliability</h4><p>With a track record of stability and consistent performance, we are a trusted partner for practices of all sizes.</p></div>
                    <div className="val-card"><div className="val-ico">📈</div><h4>Scaling With You</h4><p>Our solutions are designed to grow with your practice, providing the support you need at every stage.</p></div>
                    <div className="val-card"><div className="val-ico">👩‍⚕️</div><h4>Clinical Focus</h4><p>We handle the complex backend so your clinical team can focus entirely on patient care.</p></div>
                </div>
            </div></section>
            <CtaBanner title="Join Multiple Practices That Trust RenoxMed" description="Start with a free, no-pressure billing audit." primaryText="Get Your Free Audit" primaryHref="/contact" />
            <MiniFooter />
        </>
    );
}
