'use client';
import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageHero from '@/components/PageHero';
import { MiniFooter } from '@/components/Footer';

const posts = [
    { bg: 'linear-gradient(135deg, var(--navy) 0%, var(--navy3) 100%)', ico: '📋', cat: 'Coding Updates', title: '2025 CPT Code Changes: Complete Guide for Medical Billers', desc: 'Comprehensive breakdown of 400+ CPT code additions, deletions, and revisions effective January 2025.', date: 'Jan 8, 2025', read: '8 min', featured: true },
    { bg: 'linear-gradient(135deg, #E8534B20, #FFF3E0)', ico: '🚫', cat: 'Denial Management', title: 'Top 10 Claim Denial Reasons — And How to Prevent Every One', desc: 'Data from 2.8 billion claims processed: here are the exact denial patterns costing practices the most money.', date: 'Dec 15, 2024', read: '11 min' },
    { bg: 'linear-gradient(135deg, #E3F2FD, var(--teal-soft))', ico: '📊', cat: 'Revenue Cycle', title: 'KPI Benchmarks Every Practice Should Track in 2025', desc: 'The 12 key performance indicators that separate high-performing practices from those leaving money behind.', date: 'Nov 28, 2024', read: '7 min' },
    { bg: 'linear-gradient(135deg, #F3E5F5, #E8EAF6)', ico: '🔒', cat: 'Compliance', title: 'HIPAA Compliance Checklist for Medical Billing Practices 2025', desc: '24 actionable items to ensure your billing operations meet all HIPAA Security and Privacy Rule requirements.', date: 'Nov 10, 2024', read: '9 min' },
    { bg: 'linear-gradient(135deg, #E8F5E9, var(--teal-soft))', ico: '💊', cat: 'Specialty Billing', title: 'Telehealth Billing Guide 2025: Payer-by-Payer Breakdown', desc: 'Medicare, Medicaid and commercial payer rules for telehealth — including new audio-only billing codes.', date: 'Oct 22, 2024', read: '14 min' },
    { bg: 'linear-gradient(135deg, #FFF8E1, #FFF3E0)', ico: '✅', cat: 'Eligibility', title: 'Why 23% of Claim Denials Start at Patient Check-In', desc: 'How front-desk eligibility failures cascade into billing disasters — and the verification protocol that stops it.', date: 'Oct 5, 2024', read: '6 min' },
    { bg: 'linear-gradient(135deg, var(--teal-soft), #E3F2FD)', ico: '💰', cat: 'Revenue Cycle', title: 'Medical Billing Outsourcing Benefits in 2025: Provider Guide', desc: 'A comprehensive guide to the advantages of outsourcing medical billing — from cost savings to compliance.', date: 'Sep 18, 2024', read: '10 min' },
    { bg: 'linear-gradient(135deg, #FCE4EC, #F3E5F5)', ico: '🏥', cat: 'Practice Management', title: 'How to Choose the Best Medical Billing Company in 2025', desc: 'The complete guide for healthcare providers evaluating billing partners — 15 critical questions to ask.', date: 'Sep 2, 2024', read: '12 min' },
    { bg: 'linear-gradient(135deg, #E8EAF6, #E3F2FD)', ico: '📈', cat: 'Revenue Cycle', title: 'Medical Billing Rates & Fees: How Much Does It Cost in 2025?', desc: 'An honest breakdown of billing service pricing models — percentage-based, fixed-fee, and hybrid approaches.', date: 'Aug 15, 2024', read: '8 min' },
    { bg: 'linear-gradient(135deg, var(--teal-soft), #E8F5E9)', ico: '🔎', cat: 'Coding Updates', title: 'E/M Code Changes 2025: Office Visit Coding Updates', desc: 'Updated evaluation and management coding guidelines — what changed and how to maximize compliant coding.', date: 'Jul 28, 2024', read: '7 min' },
    { bg: 'linear-gradient(135deg, #FFF8E1, var(--teal-soft))', ico: '📋', cat: 'Compliance', title: 'Prior Authorization: Understanding the Process and Impact on Revenue', desc: 'How prior authorization delays affect cash flow and the strategies to streamline the process.', date: 'Jul 10, 2024', read: '9 min' },
    { bg: 'linear-gradient(135deg, #E3F2FD, #E8EAF6)', ico: '🧠', cat: 'Specialty Billing', title: 'Neurology Billing Guide: CPT Codes, Modifiers & Common Denials', desc: 'Complete coding reference for EEGs, EMGs, nerve conduction studies, and neurosurgical procedures.', date: 'Jun 22, 2024', read: '15 min' },
];

const categories = ['All', 'Coding Updates', 'Denial Management', 'Revenue Cycle', 'Compliance', 'Specialty Billing', 'Practice Management', 'Eligibility'];

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const featured = posts[0];
    const filtered = activeCategory === 'All' ? posts.slice(1) : posts.filter(p => p.cat === activeCategory && p !== featured);

    return (
        <>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog & Resources' }]} />
            <PageHero tag="📚 Resources" title="Billing Intelligence" titleAccent="Hub" description="Expert guides, coding updates, and industry insights to keep your practice ahead of billing changes." />

            {/* Featured Article */}
            <section className="section-sm" style={{ background: 'var(--off)' }}>
                <div className="container">
                    <div className="grid-2 grid-align" style={{ gap: 40 }}>
                        <div style={{ background: featured.bg, borderRadius: 'var(--r-xl)', padding: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, minHeight: 300 }}>
                            {featured.ico}
                        </div>
                        <div>
                            <div style={{ display: 'inline-block', background: 'var(--teal-soft)', color: 'var(--teal)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '4px 12px', borderRadius: 100, marginBottom: 14 }}>{featured.cat}</div>
                            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.2, marginBottom: 14 }}>{featured.title}</h2>
                            <p style={{ fontSize: 15, color: 'var(--text3)', lineHeight: 1.75, marginBottom: 20 }}>{featured.desc}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>
                                <span>📅 {featured.date}</span><span>•</span><span>⏱ {featured.read} read</span>
                            </div>
                            <button className="btn-primary">Read Article →</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filters */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s', border: 'none',
                                    background: activeCategory === cat ? 'var(--navy)' : 'var(--gray1)',
                                    color: activeCategory === cat ? 'white' : 'var(--text3)',
                                }}
                            >{cat}</button>
                        ))}
                    </div>

                    <div className="blog-grid">
                        {filtered.map((p, i) => (
                            <div key={i} className="blog-card">
                                <div className="blog-thumb" style={{ background: p.bg }}>{p.ico}</div>
                                <div className="blog-body">
                                    <div className="blog-cat">{p.cat}</div>
                                    <h3>{p.title}</h3>
                                    <p>{p.desc}</p>
                                    <div className="blog-meta"><span>{p.date}</span><span>•</span><span>{p.read} read</span></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter CTA */}
                    <div style={{ marginTop: 60, background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy3) 100%)', borderRadius: 'var(--r-xl)', padding: '48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
                        <div>
                            <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>Stay Ahead of Billing Changes</h3>
                            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14 }}>Get weekly coding updates, compliance alerts, and revenue tips delivered to your inbox.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 0 }}>
                            <input type="email" placeholder="Enter your email" className="newsletter-input" style={{ width: 260, borderRadius: 'var(--r-sm) 0 0 var(--r-sm)' }} />
                            <button className="newsletter-btn" style={{ borderRadius: '0 var(--r-sm) var(--r-sm) 0' }}>Subscribe →</button>
                        </div>
                    </div>
                </div>
            </section>
            <MiniFooter />
        </>
    );
}
