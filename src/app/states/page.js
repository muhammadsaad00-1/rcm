import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';

const states = [
    { f: '🏙️', n: 'Illinois', a: 'IL' }, { f: '🤠', n: 'Texas', a: 'TX' }, { f: '🌞', n: 'California', a: 'CA' }, { f: '🌴', n: 'Florida', a: 'FL' },
    { f: '🗽', n: 'New York', a: 'NY' }, { f: '🏔️', n: 'Colorado', a: 'CO' }, { f: '🌊', n: 'Washington', a: 'WA' }, { f: '🌻', n: 'Ohio', a: 'OH' },
    { f: '🎸', n: 'Tennessee', a: 'TN' }, { f: '🌹', n: 'Georgia', a: 'GA' }, { f: '🌽', n: 'Michigan', a: 'MI' }, { f: '🎶', n: 'North Carolina', a: 'NC' },
    { f: '🌾', n: 'Minnesota', a: 'MN' }, { f: '🍑', n: 'Pennsylvania', a: 'PA' }, { f: '🌵', n: 'Arizona', a: 'AZ' }, { f: '🌿', n: 'Virginia', a: 'VA' },
    { f: '🦞', n: 'Massachusetts', a: 'MA' }, { f: '🌲', n: 'Oregon', a: 'OR' }, { f: '🏖️', n: 'Nevada', a: 'NV' }, { f: '🌺', n: 'Hawaii', a: 'HI' },
];

export default function StatesPage() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'States We Serve' }]} />
            <PageHero tag="🗺️ National Coverage" title="Medical Billing Services" titleAccent="Across All 50 States" description="State-specific Medicaid billing, payer rules, and compliance requirements — our team knows every state's nuances so you don't have to." />
            <section className="section"><div className="container">
                <div className="center" style={{ marginBottom: 44 }}><h2 className="sec-title">All 50 US States Covered</h2><p className="sec-sub" style={{ margin: '0 auto' }}>Our billers are trained on state-specific Medicaid programs, fee schedules and compliance rules — from California's complex Medi-Cal to New York's Medicaid Managed Care.</p></div>
                <div className="states-grid">
                    {states.map(s => (
                        <div key={s.a} className="state-card"><div className="state-flag">{s.f}</div><div className="state-name">{s.n}</div><div className="state-abbr">{s.a}</div></div>
                    ))}
                    <div className="state-card" style={{ borderColor: 'var(--teal)', background: 'var(--teal-soft)' }}><div className="state-flag">➕</div><div className="state-name" style={{ color: 'var(--teal)' }}>+30 More</div><div className="state-abbr">All 50 States</div></div>
                </div>
                <div className="center" style={{ marginTop: 36 }}><Link href="/contact" className="btn-primary">Check Your State →</Link></div>
            </div></section>
            <MiniFooter />
        </>
    );
}
