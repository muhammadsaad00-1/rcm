'use client';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import FaqSection from '@/components/FaqSection';
import { MiniFooter } from '@/components/Footer';

const faqs = [
    { q: 'How quickly can ClearClaim take over our billing?', a: 'Most practices go live within 10–14 business days. We handle the full transition — EHR integration, payer credentialing review, and staff coordination — with zero downtime to your existing billing workflow.' },
    { q: 'Do you integrate with our existing EHR?', a: 'Yes. We integrate with 300+ EHR and practice management systems including Epic, Athena, eClinicalWorks, NextGen, Kareo/Tebra, DrChrono, and many more. Our integration team evaluates your platform during the free onboarding audit.' },
    { q: 'What is your clean claim rate and how do you achieve it?', a: 'Our current first-pass clean claim rate is 98.3%, compared to the industry average of 85–90%. We achieve this through AI-powered claim scrubbing, certified coder review on every claim, and real-time eligibility verification before every patient visit.' },
    { q: 'How do you handle denied claims?', a: 'Every denial triggers an automatic workflow: categorization by reason code, root-cause identification, payer-specific appeal drafting, and resubmission within 48–72 hours. We also run monthly denial trend analysis to prevent recurrence at the source.' },
    { q: 'What is your pricing model?', a: 'We operate on a percentage of collections model starting at 2.95%, which aligns our incentives perfectly with yours — we earn more when you earn more. There are no setup fees, no long-term contracts required, and no hidden charges.' },
    { q: 'Is ClearClaim HIPAA compliant?', a: 'Yes, fully. We operate under signed Business Associate Agreements (BAAs), use 256-bit AES encryption for all data, and undergo annual SOC 2 Type II and HIPAA compliance audits by independent third-party firms. All staff receive annual HIPAA security training.' },
    { q: 'Do you require a long-term contract?', a: 'No long-term lock-in is required. We work month-to-month because we\'re confident our results speak for themselves. Enterprise clients may choose 12-month agreements for preferred pricing and SLA guarantees.' },
    { q: 'Who will be our point of contact?', a: 'You\'ll be assigned a dedicated Account Manager who knows your practice, specialty, and payer mix from day one. This person is reachable directly by phone, email, and chat — not a general call center queue.' },
];

export default function FaqsPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQs' }]} />
            <PageHero tag="❓ FAQs" title="Frequently Asked" titleAccent="Questions" description="Everything you need to know about working with ClearClaim Medical Billing." />
            <section className="section"><div className="container" style={{ maxWidth: 860 }}>
                <FaqSection faqs={faqs} />
                <div style={{ textAlign: 'center', marginTop: 44 }}>
                    <p style={{ color: 'var(--text3)', marginBottom: 20 }}>Still have questions?</p>
                    <Link href="/contact" className="btn-primary">Contact Our Team →</Link>
                </div>
            </div></section>
            <MiniFooter />
        </>
    );
}
