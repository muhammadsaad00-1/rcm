import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export default function CredentialingPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'RCM', href: '/services' }, { label: 'Credentialing & Enrollment' }]} />
            <PageHero tag="📋 Credentialing" title="Provider Credentialing &" titleAccent="Payer Enrollment" description="Complete credentialing and enrollment services — from initial payer contracting to re-credentialing and CAQH maintenance. Never lose billing privileges again." />
            <section className="section"><div className="container">
                <div className="svc-detail-section">
                    <div><div className="sec-label">Credentialing Services</div><h2 className="sec-title">Full Payer Credentialing — Start to Finish</h2><p style={{ color: 'var(--text3)', lineHeight: 1.75, marginBottom: 22 }}>Credentialing delays cost practices thousands in lost revenue every month. Our dedicated credentialing specialists manage your entire payer enrollment portfolio — from initial applications through re-credentialing cycles — so you never miss a billing opportunity.</p>
                        <ul className="check-list"><li>Medicare and Medicaid enrollment & revalidation</li><li>Commercial payer contract negotiation</li><li>CAQH ProView setup and maintenance</li><li>NPI registration (Type 1 and Type 2)</li><li>Hospital privilege applications</li><li>Re-credentialing cycle management</li><li>Status tracking with weekly updates</li></ul>
                    </div>
                    <div><Image src="/images/coding-team.png" alt="Provider credentialing" width={500} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-xl)' }} /></div>
                </div>
            </div></section>
            <section className="section" style={{ background: 'var(--off)' }}><div className="container"><div className="grid-2 grid-align" style={{ gap: 60 }}><div><div className="sec-label">Get Credentialed Fast</div><h2 className="sec-title">Efficient Credentialing Turnaround</h2><p className="sec-sub">New provider? Expanding your practice? We handle all credentialing paperwork so you can start billing immediately after approval.</p></div>
                <ContactForm
                    title="Credentialing Inquiry"
                    subtitle="Tell us about your credentialing needs"
                    submitButtonText="Start Credentialing Process →"
                    emailSubject="Provider Credentialing Inquiry"
                    includeSpecialty={false}
                    includeEHR={false}
                /></div></div></section>
            <MiniFooter />
        </>
    );
}
