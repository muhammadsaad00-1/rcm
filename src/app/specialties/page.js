import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import CtaBanner from '@/components/CtaBanner';
import { MiniFooter } from '@/components/Footer';

const specialties = [
    { i: '🫀', n: 'Cardiology', s: 'EP · Interventional · Nuclear' },
    { i: '🧠', n: 'Neurology', s: 'Pain Mgmt · Neurosurgery' },
    { i: '🦴', n: 'Orthopedics', s: 'Sports Med · Joint Replacement' },
    { i: '🩺', n: 'Family Practice', s: 'Primary · Preventive' },
    { i: '👶', n: 'Pediatrics', s: 'Primary · Neonatology' },
    { i: '🔬', n: 'Internal Medicine', s: 'Chronic Disease' },
    { i: '💊', n: 'Nephrology', s: 'Dialysis · ESRD' },
    { i: '🏥', n: 'Urgent Care', s: 'Multi-Site Billing' },
    { i: '👁️', n: 'Ophthalmology', s: 'Vision · Surgical' },
    { i: '🦷', n: 'Dental / Oral Surgery', s: 'Oral Maxillofacial' },
    { i: '🤱', n: 'OB / GYN', s: 'Obstetrics · Gynecology' },
    { i: '🧘', n: 'Behavioral Health', s: 'Mental Health · SUD' },
    { i: '🫁', n: 'Pulmonology', s: 'Sleep Medicine · Respiratory' },
    { i: '🩹', n: 'Dermatology', s: 'Medical · Mohs · Cosmetic' },
    { i: '🦠', n: 'Oncology', s: 'Chemotherapy · Radiation' },
    { i: '🔴', n: 'Rheumatology', s: 'Infusion · Biologics' },
    { i: '🏃', n: 'Physical Therapy', s: 'PT · OT · Speech' },
    { i: '🫘', n: 'Gastroenterology', s: 'Endoscopy · Colonoscopy' },
    { i: '🔮', n: 'Urology', s: 'Surgical · Diagnostic' },
    { i: '🩺', n: 'Radiology', s: 'Diagnostic · Interventional' },
];

export default function SpecialtiesPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Specialties' }]} />
            <PageHero tag="🏥 Medical Specialties" title="Billing Expertise Across" titleAccent="40+ Specialties" description="Generic billing is the #1 cause of preventable denials. Our certified billers speak the coding language of your specific specialty — from complex surgical subspecialties to behavioral health." />
            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                        {specialties.map(s => (
                            <div key={s.n} className="spec-card"><span className="spec-ico">{s.i}</span><div><div className="spec-name">{s.n}</div><div className="spec-tag">{s.s}</div></div></div>
                        ))}
                    </div>
                    <CtaBanner title="Don't See Your Specialty?" description="We serve 40+ specialties. Contact us to confirm we have expertise in your area." primaryText="Ask a Specialist" primaryHref="/contact" />
                </div>
            </section>
            <MiniFooter />
        </>
    );
}
