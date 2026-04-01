import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';

export default function DenialPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM', href: '/services' }, { label: 'Denial Management' }]} />
            <PageHero tag="🚫 Denial Management" title="Claim Denial Management &" titleAccent="Appeals" description="Every denied claim is a revenue recovery opportunity. We categorize, appeal and resubmit denied claims within 48 hours — and systematically eliminate the root causes so denials don't recur." />
            <section className="section"><div className="container">
                <div className="svc-detail-section">
                    <div><div className="sec-label">Our Approach</div><h2 className="sec-title">48-Hour Denial Resolution with Root-Cause Analysis</h2><p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>We don't just appeal denials — we fix them permanently. Our denial management team categorizes every denial by payer, reason code, and provider, then addresses systemic issues at the source to prevent recurrence.</p>
                        <ul className="check-list"><li>All denials appealed within 48 hours of receipt</li><li>Payer-specific appeal letter templates (500+ payers)</li><li>Peer-to-peer review coordination for clinical denials</li><li>Root-cause analysis reporting monthly</li><li>Coding denial prevention workflows</li><li>Timely filing limit tracking and alerts</li><li>Secondary payer resubmission included</li></ul>
                    </div>
                    <div><Image src="/images/denial-management.png" alt="Denial management specialists" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} /></div>
                </div>
            </div></section>
            <section className="section" style={{ background: 'var(--off)' }}><div className="container"><div className="grid-2 grid-align" style={{ gap: 60 }}><div><div className="sec-label">Stop Losing Revenue</div><h2 className="sec-title">Turn Your Denials Into Paid Claims</h2><p className="sec-sub">Our denial management service typically recovers 85–95% of appealed claims. Get started with a free denial analysis today.</p></div>
                <div className="cform-wrap"><div className="cform-title">Free Denial Analysis</div><div className="cform-sub">See how much denied revenue we can recover</div>
                    <div className="form-row"><div className="form-group"><label>Name *</label><input type="text" /></div><div className="form-group"><label>Practice *</label><input type="text" /></div></div>
                    <div className="form-group"><label>Email *</label><input type="email" /></div>
                    <div className="form-group"><label>Phone *</label><input type="tel" /></div>
                    <div className="form-group"><label>Approx. Monthly Denial Volume</label><select><option>Select</option><option>Under $10K</option><option>$10K–$50K</option><option>$50K–$100K</option><option>$100K+</option></select></div>
                    <button className="form-submit" type="button">Get Free Denial Analysis →</button>
                </div></div></div></section>
            <MiniFooter />
        </>
    );
}
