import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export default function ARPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM', href: '/services' }, { label: 'Account Receivable' }]} />
            <PageHero tag="💰 Account Receivable" title="Accounts Receivable" titleAccent="Management & Recovery" description="Aggressive, systematic follow-up on all outstanding claims. We reduce your AR days, maximize collections, and recover aged claims that most billing companies abandon." />
            <section className="section"><div className="container">
                <div className="svc-detail-section">
                    <div><div className="sec-label">AR Recovery Services</div><h2 className="sec-title">We Work Every Claim — No Matter How Old</h2><p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>Our AR team follows a systematic follow-up protocol for all outstanding claims — 30, 60, 90, and 180+ days. We work even older claims and pursue payers through escalation channels when standard follow-up fails.</p>
                        <ul className="check-list"><li>Systematic follow-up at regular intervals</li><li>Priority work on high-value aged claims</li><li>Payer escalation for claims exceeding timely filing</li><li>Patient balance billing and collections support</li><li>Write-off approval workflows and reporting</li><li>AR aging dashboard with real-time updates</li><li>Monthly AR performance reports by payer</li></ul>
                    </div>
                    <div><Image src="/images/billing-audit.png" alt="Accounts receivable management" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} /></div>
                </div>
            </div></section>
            <section className="section" style={{ background: 'var(--off)' }}><div className="container"><div className="grid-2 grid-align" style={{ gap: 60 }}><div><div className="sec-label">Reduce Your AR</div><h2 className="sec-title">From High AR Days to Low — Systematically</h2><p className="sec-sub">Practices that switch to RenoxMed AR management see a significant reduction from high AR days to low quickly.</p></div>
                <ContactForm
                    title="Free AR Analysis"
                    subtitle="See your AR recovery potential quickly"
                    submitButtonText="Get Free AR Analysis →"
                    emailSubject="AR Management Inquiry"
                    includeSpecialty={false}
                    includeEHR={false}
                /></div></div></section>
            <MiniFooter />
        </>
    );
}
