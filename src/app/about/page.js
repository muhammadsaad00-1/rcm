import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import CtaBanner from '@/components/CtaBanner';
import { MiniFooter } from '@/components/Footer';

export default function AboutPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
            <PageHero tag="🏢 Our Story" title="About" titleAccent="ClearClaim" description="Founded in 2012 by healthcare administrators who watched millions slip through billing inefficiencies — and decided to fix it." />
            <section className="section"><div className="container">
                <div className="about-story">
                    <div>
                        <div className="sec-label">Our Story</div>
                        <h2 className="sec-title">Built by Billers, for Clinicians</h2>
                        <p style={{ color: 'var(--text3)', lineHeight: 1.8, marginBottom: 16 }}>ClearClaim was founded after our CEO spent 14 years as a practice administrator watching healthcare providers lose hundreds of thousands of dollars annually to billing errors, coding inefficiencies, and uncollected claims.</p>
                        <p style={{ color: 'var(--text3)', lineHeight: 1.8, marginBottom: 16 }}>In 2012, he assembled a team of CPC-certified coders, healthcare attorneys, and revenue cycle technology experts to build a smarter billing company — one that combined human expertise with technology to achieve results that in-house billing never could.</p>
                        <p style={{ color: 'var(--text3)', lineHeight: 1.8, marginBottom: 28 }}>Today, ClearClaim serves 1,200+ providers across 40+ specialties, processing over $2.8 billion in annual claims from our US-based headquarters in Dallas, TX.</p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}><Link href="/contact" className="btn-primary">Work With Us</Link><Link href="/services" className="btn-outline">Our Services</Link></div>
                    </div>
                    <div className="about-img">
                        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle,rgba(0,201,167,.2),transparent 70%)' }}></div>
                        <div className="about-img-inner">
                            <div className="abt-stat"><span className="abt-val">$2.8B+</span><span className="abt-lbl">Annual Claims Processed</span></div>
                            <div className="abt-stat"><span className="abt-val">2012</span><span className="abt-lbl">Year Founded</span></div>
                            <div className="abt-stat"><span className="abt-val">1,200+</span><span className="abt-lbl">Provider Clients</span></div>
                            <div className="abt-stat"><span className="abt-val">350+</span><span className="abt-lbl">US-Based Staff</span></div>
                            <div className="abt-stat"><span className="abt-val">98.3%</span><span className="abt-lbl">Clean Claim Rate</span></div>
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
                <div style={{ marginTop: 80 }}><div className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>Leadership</div><h2 className="sec-title center">The Team Behind ClearClaim</h2></div>
                <div className="team-grid">
                    <div className="team-card"><div className="team-av" style={{ background: 'linear-gradient(135deg,#0B1437,#162257)' }}>MW</div><h4>Marcus Webb</h4><span className="team-role">CEO & Co-Founder</span><p className="team-bio">14 years practice administration. MBA Healthcare Management. Founded ClearClaim to fix what's broken in medical billing.</p></div>
                    <div className="team-card"><div className="team-av" style={{ background: 'linear-gradient(135deg,#00C9A7,#0B1437)' }}>SC</div><h4>Sandra Chen, CPC</h4><span className="team-role">Chief Coding Officer</span><p className="team-bio">20+ years medical coding. Former CMS consultant. Holds 12 specialty coding certifications.</p></div>
                    <div className="team-card"><div className="team-av" style={{ background: 'linear-gradient(135deg,#F5A623,#C17D00)' }}>RP</div><h4>Raj Patel</h4><span className="team-role">Chief Technology Officer</span><p className="team-bio">Healthcare interoperability expert. HL7 FHIR specialist. Built RCM technology at three prior companies.</p></div>
                    <div className="team-card"><div className="team-av" style={{ background: 'linear-gradient(135deg,#E8534B,#9B2020)' }}>LM</div><h4>Dr. Lisa Martinez</h4><span className="team-role">Compliance Officer</span><p className="team-bio">JD, Health Law. Former HHS OIG. HIPAA and healthcare fraud prevention specialist for 15+ years.</p></div>
                </div>
            </div></section>
            <CtaBanner title="Join 1,200+ Practices That Trust ClearClaim" description="Start with a free, no-pressure billing audit." primaryText="Get Your Free Audit" primaryHref="/contact" />
            <MiniFooter />
        </>
    );
}
