import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export default function DenialPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM', href: '/services' }, { label: 'Denial Management' }]} />
            <PageHero tag="🚫 Denial Management" title="Claim Denial Management &" titleAccent="Appeals" description="Every denied claim is a revenue recovery opportunity. We categorize, appeal and resubmit denied claims quickly — and systematically eliminate the root causes so denials don't recur." />
            <section className="section"><div className="container">
                <div className="svc-detail-section">
                    <div><div className="sec-label">Our Approach</div><h2 className="sec-title">Rapid Denial Resolution with Root-Cause Analysis</h2><p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>We don't just appeal denials — we fix them permanently. Our denial management team categorizes every denial by payer, reason code, and provider, then addresses systemic issues at the source to prevent recurrence.</p>
                        <ul className="check-list"><li>All denials appealed quickly upon receipt</li><li>Extensive library of payer-specific appeal letter templates</li><li>Peer-to-peer review coordination for clinical denials</li><li>Root-cause analysis reporting monthly</li><li>Coding denial prevention workflows</li><li>Timely filing limit tracking and alerts</li><li>Secondary payer resubmission included</li></ul>
                    </div>
                    <div><Image src="/images/denial-management.png" alt="Denial management specialists" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} /></div>
                </div>
            </div></section>
            <section className="section" style={{ background: 'var(--off)' }}><div className="container"><div className="grid-2 grid-align" style={{ gap: 60 }}><div><div className="sec-label">Stop Losing Revenue</div><h2 className="sec-title">Turn Your Denials Into Paid Claims</h2><p className="sec-sub">Our denial management service typically recovers most appealed claims. Get started with a free denial analysis today.</p></div>
                <ContactForm
                    title="Free Denial Analysis"
                    subtitle="See how much denied revenue we can recover"
                    submitButtonText="Get Free Denial Analysis →"
                    emailSubject="Denial Management Inquiry"
                    includeSpecialty={false}
                    includeEHR={false}
                /></div></div></section>
            <MiniFooter />
        </>
    );
}
