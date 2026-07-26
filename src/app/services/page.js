import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import CtaBanner from '@/components/CtaBanner';
import { MiniFooter } from '@/components/Footer';

export default function ServicesPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Revenue Cycle Management' }]} />
            <PageHero tag="🏷️ Full-Service RCM" title="Revenue Cycle Management" titleAccent="Services" description="End-to-end billing management — from patient registration through final payment. Every step handled by certified billing specialists who know your specialty." />
            <section className="section">
                <div className="container">
                    <div className="svc-overview-grid">
                        <Link href="/services/audit" className="svc-ov-card"><div className="svc-ov-ico">🔎</div><h3>Medical Billing Audit</h3><p>Uncover hidden revenue, fix compliance issues, and benchmark your billing against industry standards.</p><div className="svc-link">Full Details →</div></Link>
                        <Link href="/services/billing" className="svc-ov-card"><div className="svc-ov-ico">🏷️</div><h3>Medical Billing</h3><p>Accurate CPT/ICD-10 coding, claim preparation and fast electronic submission to all major payers.</p><div className="svc-link">Full Details →</div></Link>
                        <Link href="/services/eligibility" className="svc-ov-card"><div className="svc-ov-ico">✅</div><h3>Eligibility Verification</h3><p>Same-day coverage verification before every visit — preventing the most common cause of claim denials.</p><div className="svc-link">Full Details →</div></Link>
                        <Link href="/services/denial" className="svc-ov-card"><div className="svc-ov-ico">🚫</div><h3>Denial Management</h3><p>Every denial categorized, appealed quickly with trend analysis to prevent recurrence.</p><div className="svc-link">Full Details →</div></Link>
                        <Link href="/services/ar" className="svc-ov-card"><div className="svc-ov-ico">💰</div><h3>Account Receivable</h3><p>Systematic follow-up on aged claims. We work even older claims and pursue every dollar.</p><div className="svc-link">Full Details →</div></Link>
                        <Link href="/services/credentialing" className="svc-ov-card"><div className="svc-ov-ico">📋</div><h3>Credentialing & Enrollment</h3><p>Complete payer contracting, CAQH management and re-credentialing — never lose billing privileges again.</p><div className="svc-link">Full Details →</div></Link>
                        <Link href="/services/coding" className="svc-ov-card"><div className="svc-ov-ico">🔬</div><h3>Medical Coding</h3><p>CPC-certified coders assign precise CPT, ICD-10, and HCPCS codes with specialty-specific accuracy.</p><div className="svc-link">Full Details →</div></Link>
                        <Link href="/services/payment-posting" className="svc-ov-card"><div className="svc-ov-ico">💳</div><h3>Payment Posting</h3><p>Accurate ERA/EOB posting, payment reconciliation, and contractual adjustment tracking in real time.</p><div className="svc-link">Full Details →</div></Link>
                        <Link href="/services/patient-billing" className="svc-ov-card"><div className="svc-ov-ico">📨</div><h3>Patient Billing & Statements</h3><p>Professional patient statement generation, balance follow-up, and payment plan management.</p><div className="svc-link">Full Details →</div></Link>
                    </div>
                </div>
            </section>
            <CtaBanner title="Not Sure Where to Start?" description="Get a free audit and we'll show you exactly which services your practice needs most." primaryText="Get Free Audit" primaryHref="/contact" />
            <MiniFooter />
        </>
    );
}
