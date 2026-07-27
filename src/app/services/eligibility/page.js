import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export default function EligibilityPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM', href: '/services' }, { label: 'Eligibility Verification' }]} />
            <PageHero tag="✅ Eligibility Verification" title="Patient Eligibility &" titleAccent="Benefits Verification" description="Real-time insurance eligibility checks performed before every patient visit — eliminating the most common cause of claim denials and patient billing disputes." />
            <section className="section"><div className="container">
                <div className="svc-detail-section">
                    <div><div className="sec-label">What We Verify</div><h2 className="sec-title">Complete Benefit Breakdown Before Every Visit</h2><p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>Insurance eligibility errors cause a large share of all claim denials. Our team verifies coverage the day before each scheduled appointment and flags any issues — giving you time to resolve them before the patient arrives.</p>
                        <ul className="check-list"><li>Active coverage confirmation</li><li>Deductible and out-of-pocket status</li><li>Copay and coinsurance amounts</li><li>Authorization requirements by service</li><li>Network participation status</li><li>Coordination of benefits (COB) for dual coverage</li><li>Referral requirements and restrictions</li></ul>
                        <div className="info-box" style={{ marginTop: 24 }}><div className="info-box-title">📊 Industry Data</div><p>Eligibility issues account for a significant share of all claim denials nationally. Verifying benefits before every appointment can significantly reduce your denial rate.</p></div>
                    </div>
                    <div><Image src="/images/denial-management.png" alt="Insurance eligibility verification" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} /></div>
                </div>
            </div></section>
            <section className="section" style={{ background: 'var(--off)' }}><div className="container"><div className="grid-2 grid-align" style={{ gap: 60 }}><div><div className="sec-label">Start Verifying</div><h2 className="sec-title">Eliminate Eligibility Denials Starting This Week</h2><p className="sec-sub">Our team can begin same-day eligibility verifications quickly after onboarding.</p></div>
                <ContactForm
                    title="Request Free Demo"
                    subtitle="See eligibility verification in action"
                    submitButtonText="Request Demo →"
                    emailSubject="Eligibility Verification Inquiry"
                    includeSpecialty={false}
                    includeEHR={true}
                /></div></div></section>
            <MiniFooter />
        </>
    );
}
