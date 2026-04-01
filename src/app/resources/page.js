'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';
import { useToast } from '@/components/Toast';

const resources = [
    { type: 'guide', thumb: 'linear-gradient(135deg,#EBF8F5,#F0FFF4)', emoji: '📋', tag: 'Guide', title: '2025 CPT Code Update: What Every Biller Must Know', desc: 'A comprehensive breakdown of the 420+ CPT code changes effective January 2025, including new telehealth modalities and E/M documentation rules.', link: 'Download Free Guide →', toast: 'Guide downloaded!' },
    { type: 'blog', thumb: 'linear-gradient(135deg,#EBF3FF,#F0F4FF)', emoji: '📊', tag: 'Blog', title: 'How to Reduce Medical Claim Denials by 80% in 90 Days', desc: 'Step-by-step strategies our billing team uses to systematically eliminate the most common causes of payer rejection.', link: 'Read Article →' },
    { type: 'webinar', thumb: 'linear-gradient(135deg,#FFF5EB,#FFF8F0)', emoji: '🎥', tag: 'Webinar', title: 'MIPS 2025: Avoiding the Payment Adjustment Penalty', desc: 'On-demand webinar covering quality reporting, promoting interoperability, and improvement activity documentation for CMS compliance.', link: 'Watch Free →', toast: 'Webinar link sent to your email!' },
    { type: 'checklist', thumb: 'linear-gradient(135deg,#F5F0FF,#F8F0FF)', emoji: '✅', tag: 'Checklist', title: 'HIPAA Compliance Checklist for Medical Practices 2025', desc: '24-point audit checklist covering encryption, BAA agreements, data access controls, breach notification, and staff training requirements.', link: 'Download Checklist →', toast: 'Checklist downloaded!' },
    { type: 'blog', thumb: 'linear-gradient(135deg,#EBFBEE,#F0FFF4)', emoji: '🩺', tag: 'Blog', title: 'Telehealth Billing in 2025: Payer-by-Payer Guide', desc: "Medicare, Medicaid, and commercial payer differences in telehealth billing codes, place of service designations, and required modifiers.", link: 'Read Article →' },
    { type: 'guide', thumb: 'linear-gradient(135deg,#FEF3C7,#FFFBEB)', emoji: '💰', tag: 'Guide', title: "The Practice Owner's Guide to Revenue Cycle KPIs", desc: 'Learn the 15 metrics every medical practice should monitor: AR days, clean claim rate, denial rate, collection rate, and more.', link: 'Download Free Guide →', toast: 'Guide downloaded!' },
];

const filterTypes = ['all', 'guide', 'blog', 'webinar', 'checklist'];

export default function ResourcesPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const showToast = useToast();

    const filtered = activeFilter === 'all' ? resources : resources.filter(r => r.type === activeFilter);

    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Resources' }]} />
            <PageHero tag="📚 Resources" title="Resources &" titleAccent="Education" description="Stay ahead of billing regulations, coding changes, and compliance updates with expert content from our certified team." />

            <section className="section">
                <div className="container">
                    {/* Filter tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                        {filterTypes.map((type) => (
                            <button
                                key={type}
                                className={activeFilter === type ? 'btn-primary' : 'btn-outline'}
                                style={{ padding: '8px 18px', fontSize: 13 }}
                                onClick={() => setActiveFilter(type)}
                            >
                                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + (type === 'blog' ? ' Articles' : type === 'checklist' ? 's' : 's')}
                            </button>
                        ))}
                    </div>

                    <div className="blog-grid">
                        {filtered.map((resource, i) => (
                            <div key={i} className="blog-card">
                                <div className="blog-thumb" style={{ background: resource.thumb }}>{resource.emoji}</div>
                                <div className="blog-body">
                                    <div className="blog-cat">{resource.tag}</div>
                                    <h3>{resource.title}</h3>
                                    <p>{resource.desc}</p>
                                    <a
                                        style={{ color: 'var(--teal)', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 12, display: 'inline-block' }}
                                        onClick={resource.toast ? () => showToast(resource.toast) : undefined}
                                    >
                                        {resource.link}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <MiniFooter />
        </>
    );
}
