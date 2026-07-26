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
    { i: '🦷', n: 'Oral Surgery', s: 'Oral Maxillofacial' },
    { i: '🤱', n: 'OB / GYN', s: 'Obstetrics · Gynecology' },
    { i: '🧘', n: 'Behavioral Health', s: 'Mental Health · SUD' },
    { i: '🫁', n: 'Pulmonology', s: 'Sleep Medicine · Respiratory' },
    { i: '🩹', n: 'Dermatology', s: 'Medical · Mohs · Cosmetic' },
    { i: '🦠', n: 'Oncology', s: 'Chemotherapy · Radiation' },
    { i: '🔴', n: 'Rheumatology', s: 'Infusion · Biologics' },
    { i: '🏃', n: 'Physical Therapy', s: 'PT · OT · Speech' },
    { i: '🫘', n: 'Gastroenterology', s: 'Endoscopy · Colonoscopy' },
    { i: '🔮', n: 'Urology', s: 'Surgical · Diagnostic' },
    { i: '📡', n: 'Radiology', s: 'Diagnostic · Interventional' },
    { i: '💉', n: 'Anesthesiology', s: 'Surgical · Pain Blocks' },
    { i: '👂', n: 'ENT', s: 'Head · Neck · Sinus' },
    { i: '🩸', n: 'Endocrinology', s: 'Diabetes · Thyroid' },
    { i: '🤧', n: 'Allergy & Immunology', s: 'Testing · Immunotherapy' },
    { i: '🧬', n: 'Hematology', s: 'Infusion · Blood Disorders' },
    { i: '🦠', n: 'Infectious Disease', s: 'HIV · Antibiotic Mgmt' },
    { i: '✂️', n: 'Plastic Surgery', s: 'Reconstructive · Cosmetic' },
    { i: '🦶', n: 'Podiatry', s: 'Foot & Ankle · Wound Care' },
    { i: '🔧', n: 'General Surgery', s: 'Laparoscopic · Bariatric' },
    { i: '🫀', n: 'Vascular Surgery', s: 'Peripheral · Venous' },
    { i: '🧠', n: 'Neurosurgery', s: 'Brain · Spine' },
    { i: '🫁', n: 'Thoracic Surgery', s: 'Lung · Esophageal' },
    { i: '💪', n: 'Chiropractic', s: 'Spinal · Manipulation' },
    { i: '🏋️', n: 'Occupational Therapy', s: 'Functional Rehab · Work Injury' },
    { i: '🩹', n: 'Wound Care', s: 'Chronic · Hyperbaric' },
    { i: '👴', n: 'Geriatrics', s: 'Long-Term Care · Memory' },
    { i: '💊', n: 'Pain Management', s: 'Interventional · Chronic' },
    { i: '🔬', n: 'Pathology & Lab', s: 'Clinical · Anatomic' },
    { i: '🏠', n: 'Home Health', s: 'Medicare · Medicaid' },
    { i: '🏪', n: 'Surgery Centers', s: 'ASC Billing · Multi-Specialty' },
    { i: '⚽', n: 'Sports Medicine', s: 'Athletic · Ortho Rehab' },
    { i: '👓', n: 'Optometry', s: 'Eye Exams · Vision Therapy' },
];

export default function SpecialtiesPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Specialties' }]} />
            <PageHero tag="🏥 Medical Specialties" title="Billing Expertise Across" titleAccent="40+ Specialties" description="Generic billing is the #1 cause of preventable denials. Our certified billers speak the coding language of your specific specialty — from complex surgical subspecialties to behavioral health." />
            <section className="section">
                <div className="container">
                    <div className="spec-grid">
                        {specialties.map(s => (
                            <div key={s.n} className="spec-card"><span className="spec-ico">{s.i}</span><div><div className="spec-name">{s.n}</div><div className="spec-tag">{s.s}</div></div></div>
                        ))}
                    </div>
                    <CtaBanner title="Don't See Your Specialty?" description="We serve many specialties. Contact us to confirm we have expertise in your area." primaryText="Ask a Specialist" primaryHref="/contact" />
                </div>
            </section>
            <MiniFooter />
        </>
    );
}
