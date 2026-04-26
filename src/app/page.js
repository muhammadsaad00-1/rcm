'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import HomeHero from '@/components/HomeHero';
import ContactForm from '@/components/ContactForm';

/* ── Small reusable check SVG ── */
const CheckSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Testimonial card data (9 reviews) ── */
const testimonials = [
  { text: "RenoxMed dropped our denial rate from 14% to under 2% in just 60 days. We recovered over $180,000 in revenue we didn't know we were losing.", name: 'Dr. Rachel Torres, MD', role: 'Cardiology Associates · Ohio, USA', init: 'RT', bg: 'linear-gradient(135deg, #0B1437, #162257)' },
  { text: "Our AR days dropped from 58 to 19 within the first quarter. The specialty coding expertise is exactly what a 3-location orthopedic group needs.", name: 'James Kowalski', role: 'Summit Orthopedics · 3 Locations · IL', init: 'JK', bg: 'linear-gradient(135deg, #00C9A7, #0B1437)' },
  { text: "Zero telehealth claim denials in 9 months. They stay ahead of every payer-specific rule change before it impacts our collections.", name: 'Dr. Anita Patel, LCSW', role: 'ClearMind Behavioral Health · CA', init: 'AP', bg: 'linear-gradient(135deg, #F5A623, #C17D00)' },
  { text: "The transition took 11 days and we didn't miss a single claim. Our collections increased 24% in the first 6 months.", name: 'Dr. Michael Brown', role: 'Brown Family Practice · Atlanta, GA', init: 'MB', bg: 'linear-gradient(135deg, #27AE60, #1A7040)' },
  { text: "As a behavioral health practice with complex billing, RenoxMed's specialty expertise is unmatched. They know every clinical nuance and payer rule.", name: 'Dr. Sarah Kim, MD', role: 'Psychiatry Center · Chicago, IL', init: 'SK', bg: 'linear-gradient(135deg, #E8534B, #9B2020)' },
  { text: "The real-time dashboard is a game changer. I can see every claim status, denial, and payment from my phone. Total transparency.", name: 'Thomas Walsh, MBA', role: 'Practice Admin · Midwest Urgent Care', init: 'TW', bg: 'linear-gradient(135deg, #0B1437, #162257)' },
  { text: "We switched from a big-name billing company and immediately saw a 31% jump in collections. RenoxMed actually cares about your revenue.", name: 'Dr. Lisa Chen, DPM', role: 'Metro Podiatry Group · New York, NY', init: 'LC', bg: 'linear-gradient(135deg, #9B59B6, #6C3483)' },
  { text: "Their credentialing team got us enrolled with 12 new payers in under 60 days. Not a single application was rejected.", name: 'Amanda Rodriguez, MBA', role: 'Desert Dermatology · Phoenix, AZ', init: 'AR', bg: 'linear-gradient(135deg, #2980B9, #1A5276)' },
  { text: "Before RenoxMed, we had $340K sitting in unpaid claims over 90 days. Within 4 months, they recovered 87% of it.", name: 'Dr. David Park, MD', role: 'Pacific Neurology · San Diego, CA', init: 'DP', bg: 'linear-gradient(135deg, #00C9A7, #162257)' },
];

/* ── Specialty data with unique descriptions ── */
const specialties = [
  { emoji: '🫀', name: 'Cardiology', tag: 'EP · Interventional · Nuclear', desc: 'Expert billing for complex cardiac procedures including catheterizations, stress tests, echocardiograms, EP studies, and pacemaker/ICD implants. We maximize reimbursement on high-value cardiovascular codes.' },
  { emoji: '🧠', name: 'Neurology', tag: 'Brain · Spine · Pain Management', desc: 'Specialized coding for EEGs, EMGs, nerve conduction studies, Botox injections, and neurosurgical procedures. Our coders understand the unique documentation requirements for neurological services.' },
  { emoji: '🦴', name: 'Orthopedics', tag: 'Sports Medicine · Joint Replacement', desc: 'From arthroscopy to total joint replacement, we navigate complex surgical coding, implant tracking, and bundling rules that directly impact your orthopedic practice revenue.' },
  { emoji: '🩺', name: 'Family Practice', tag: 'Primary · Preventive Care', desc: 'Comprehensive billing for office visits, wellness exams, chronic care management, and preventive services. We ensure proper E/M leveling and capture every billable service.' },
  { emoji: '👶', name: 'Pediatrics', tag: 'Primary · Neonatology', desc: 'Pediatric-specific billing expertise covering well-child visits, immunization administration, developmental screenings, and complex neonatal ICU coding.' },
  { emoji: '🔬', name: 'Internal Medicine', tag: 'Chronic Disease Management', desc: 'Optimized billing for chronic condition management, transitional care, and complex medical decision-making. We capture CCM, TCM, and AWV codes often missed by generic billers.' },
  { emoji: '🧠', name: 'Behavioral Specialty', tag: 'Psychiatry · Therapy Billing', desc: 'Expert billing for mental health services, including complex psychotherapy coding and telehealth reimbursement. We handle payer-specific requirements for behavioral health.' },
  { emoji: '🏥', name: 'Urgent Care', tag: 'Multi-Site · Walk-In Billing', desc: 'High-volume, multi-site billing with rapid turnaround. We handle E/M coding, X-rays, lab work, procedures, and occupational medicine billing across all your locations.' },
];

export default function HomePage() {
  const [testiPage, setTestiPage] = useState(0);
  const totalPages = Math.ceil(testimonials.length / 3);

  const nextPage = useCallback(() => {
    setTestiPage(prev => (prev + 1) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    const interval = setInterval(nextPage, 5000);
    return () => clearInterval(interval);
  }, [nextPage]);

  const visibleTestimonials = testimonials.slice(testiPage * 3, testiPage * 3 + 3);

  return (
    <>
      {/* ═══ 1. HERO ═══ */}
      <HomeHero />

      {/* ═══ 2. STATS ROW ═══ */}
      <div className="container">
        <div className="stats-row" style={{ marginTop: -40, position: 'relative', zIndex: 3 }}>
          <div className="stat-item"><div className="stat-num"><em>150k</em>+</div><div className="stat-label">Claims Processed</div></div>
          <div className="stat-item"><div className="stat-num"><em>98</em>%</div><div className="stat-label">Clean Claim Rate</div></div>
          <div className="stat-item"><div className="stat-num"><em>75</em>+</div><div className="stat-label">Provider Clients</div></div>
          <div className="stat-item"><div className="stat-num"><em>15</em>+</div><div className="stat-label">Specialties Served</div></div>
        </div>
      </div>

      {/* ═══ 3. RCM SERVICES ═══ */}
      <section className="section" style={{ background: 'var(--off)' }}>
        <div className="container">
          <div className="grid-2 grid-align" style={{ marginBottom: 0 }}>
            <div>
              <div className="sec-label">Our RCM Services</div>
              <h2 className="sec-title">End-to-End Revenue Cycle Management</h2>
            </div>
            <div>
              <p className="sec-sub">From patient registration through final payment — every step handled by certified billing specialists who know your specialty.</p>
              <div style={{ marginTop: 20 }}><Link href="/services" className="btn-modern btn-modern-primary">View All Services </Link></div>
            </div>
          </div>
          <div className="svc-overview-grid">
            <Link href="/services/audit" className="svc-ov-card"><div className="svc-ov-ico">🔎</div><h3>Medical Billing Audit</h3><p>Comprehensive review of your billing to uncover lost revenue, compliance risks and coding errors.</p><div className="svc-link">Learn More →</div></Link>
            <Link href="/services/billing" className="svc-ov-card"><div className="svc-ov-ico">🏷️</div><h3>Medical Billing</h3><p>Clean claim preparation and electronic submission to multiple payers within 48 hours of service.</p><div className="svc-link">Learn More →</div></Link>
            <Link href="/services/eligibility" className="svc-ov-card"><div className="svc-ov-ico">✅</div><h3>Eligibility Verification</h3><p>Real-time insurance benefit verification before every visit — eliminating avoidable denials at the source.</p><div className="svc-link">Learn More →</div></Link>
            <Link href="/services/denial" className="svc-ov-card"><div className="svc-ov-ico">🚫</div><h3>Denial Management</h3><p>Rapid appeal and resubmission of denied claims with root-cause analysis to prevent future denials.</p><div className="svc-link">Learn More →</div></Link>
            <Link href="/services/ar" className="svc-ov-card"><div className="svc-ov-ico">💰</div><h3>Account Receivable</h3><p>Aggressive follow-up on aged claims to maximize collections and reduce your overall AR days.</p><div className="svc-link">Learn More →</div></Link>
            <Link href="/services/credentialing" className="svc-ov-card"><div className="svc-ov-ico">📋</div><h3>Credentialing & Enrollment</h3><p>Complete payer enrollment, re-credentialing and CAQH management so you never miss a billing opportunity.</p><div className="svc-link">Learn More →</div></Link>
            <Link href="/services/coding" className="svc-ov-card"><div className="svc-ov-ico">🔬</div><h3>Medical Coding</h3><p>CPC-certified coders assign precise CPT, ICD-10, and HCPCS codes with specialty-specific accuracy.</p><div className="svc-link">Learn More →</div></Link>
            <Link href="/services/payment-posting" className="svc-ov-card"><div className="svc-ov-ico">💳</div><h3>Payment Posting</h3><p>Accurate ERA/EOB posting, payment reconciliation, and contractual adjustment tracking in real time.</p><div className="svc-link">Learn More →</div></Link>
            <Link href="/services/patient-billing" className="svc-ov-card"><div className="svc-ov-ico">📨</div><h3>Patient Billing & Statements</h3><p>Professional patient statement generation, balance follow-up, and payment plan management.</p><div className="svc-link">Learn More →</div></Link>
          </div>
        </div>
      </section>

      {/* ═══ 4. WHY RENOXMED ═══ */}
      <section className="section">
        <div className="container">
          <div className="why-grid">
            <div>
              <div className="sec-label">Why RenoxMed</div>
              <h2 className="sec-title">What Makes Us Different From Every Other Billing Company</h2>
              <p className="sec-sub" style={{ marginBottom: 32 }}>We replaced the old-school billing company model with a technology-first, specialty-aware approach that consistently outperforms industry benchmarks.</p>
              <div className="stats-row" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 0, borderRadius: 'var(--r-lg)' }}>
                <div className="stat-item"><div className="stat-num"><em>25%</em></div><div className="stat-label">Avg Revenue Increase</div></div>
                <div className="stat-item"><div className="stat-num"><em>Sub-20</em> days</div><div className="stat-label">Average AR Days</div></div>
                <div className="stat-item"><div className="stat-num"><em>48hr</em></div><div className="stat-label">Claim Submission</div></div>
                <div className="stat-item"><div className="stat-num"><em>40+</em></div><div className="stat-label">EHR Integrations</div></div>
              </div>
              <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn-modern btn-modern-primary">Start With a Free Audit</Link>
                <Link href="/services" className="btn-modern btn-modern-outline">View All Services</Link>
              </div>
            </div>
            <div className="why-visual">
              <div className="why-visual-glow"></div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 18, position: 'relative', zIndex: 2 }}>Why RenoxMed Works</div>
              <div className="why-points">
                <div className="why-point"><div className="wp-ico">01</div><div><div className="wp-title">Specialty-First Approach</div><div className="wp-sub">Dedicated billers trained specifically in your medical specialty — not generic coders.</div></div></div>
                <div className="why-point"><div className="wp-ico">02</div><div><div className="wp-title">48-Hour Claim Submission</div><div className="wp-sub">From clinical documentation to electronic submission in 2 business days, not 2 weeks.</div></div></div>
                <div className="why-point"><div className="wp-ico">03</div><div><div className="wp-title">AI-Powered Claim Scrubbing</div><div className="wp-sub">Every claim passes through 3 layers of verification: AI scrub, human review, payer-specific rules.</div></div></div>
                <div className="why-point"><div className="wp-ico">04</div><div><div className="wp-title">Real-Time Dashboard</div><div className="wp-sub">Live access to every claim, denial, and payment — see your revenue cycle in real time.</div></div></div>
                <div className="why-point"><div className="wp-ico">05</div><div><div className="wp-title">Dedicated Account Manager</div><div className="wp-sub">One point of contact who knows your practice. Not a call center — a real person.</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. HEALTHCARE PROVIDER ═══ */}
      <section className="provider-section">
        <div className="provider-grid">
          <div className="provider-img-wrap">
            <Image src="/images/doctor-consultation.png" alt="Doctor consulting with patient" width={600} height={450} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div className="provider-content">
            <div className="sec-label">About RenoxMed</div>
            <h2>Trusted by <em>75+</em> Healthcare Providers Nationwide</h2>
            <p>With over a decade of experience, RenoxMed delivers end-to-end revenue cycle management that maximizes reimbursements and minimizes claim denials. Our specialty-certified billing experts understand the nuances of your practice and work tirelessly to ensure every dollar you earn reaches your bottom line.</p>
            <div className="provider-actions">
              <Link href="/contact" className="btn-modern btn-modern-primary">Make an Appointment</Link>
              <Link href="/about" className="btn-modern btn-modern-outline">About Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. SPECIALTIES ═══ */}
      <section style={{ background: 'var(--navy)', padding: '90px 5%' }}>
        <div className="container">
          <div className="center" style={{ marginBottom: 44 }}>
            <div className="sec-label" style={{ justifyContent: 'center', display: 'flex', color: 'var(--teal)' }}>Specialties</div>
            <h2 className="sec-title" style={{ color: 'white' }}>Billing Expertise Across Many Medical Specialties</h2>
            <p className="sec-sub" style={{ margin: '0 auto', color: 'rgba(255,255,255,.5)' }}>Our certified billers speak your specialty&apos;s coding language — from complex cardiology to behavioral health.</p>
          </div>
          <div className="spec-grid">
            {specialties.map(s => (
              <Link key={s.name} href="/specialties" className="spec-card" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                  <span className="spec-ico">{s.emoji}</span>
                  <div>
                    <div className="spec-name" style={{ color: 'white' }}>{s.name}</div>
                    <div className="spec-tag" style={{ color: 'rgba(255,255,255,.4)' }}>{s.tag}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.35)', lineHeight: 1.55, marginTop: 4 }}>{s.desc}</p>
              </Link>
            ))}
          </div>
          <div className="center" style={{ marginTop: 36 }}>
            <Link href="/specialties" className="btn-modern btn-modern-secondary" style={{ background: 'white', color: 'var(--navy)' }}>View All Specialties →</Link>
          </div>
        </div>
      </section>

      {/* ═══ 7. TESTIMONIALS CAROUSEL ═══ */}
      <section className="section" style={{ background: 'var(--gray1)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="sec-label">Client Reviews</div>
              <h2 className="sec-title">What Our Clients Say About Us</h2>
            </div>
            <Link href="/reviews" className="btn-modern btn-modern-primary" style={{ flexShrink: 0 }}>Leave a Review →</Link>
          </div>
          <div className="testi-grid" style={{ transition: 'opacity .4s ease' }}>
            {visibleTestimonials.map((t, i) => (
              <div key={testiPage * 3 + i} className="testi-card">
                <div className="testi-stars">★★★★★</div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-av" style={{ background: t.bg }}>{t.init}</div>
                  <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setTestiPage(i)} style={{ width: i === testiPage ? 28 : 10, height: 10, borderRadius: 100, background: i === testiPage ? 'var(--teal)' : 'var(--gray3)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. WHY WORK WITH US + CONSULTATION FORM ═══ */}
      <section className="why-work-section">
        <div className="why-work-grid">
          <div className="why-work-left">
            <h2>Why Work With Us?</h2>
            <div className="teal-bar"></div>
            <p>RenoxMed is a leading medical billing company providing comprehensive RCM solution at cost-effective rates.</p>
            <ul className="why-work-checklist">
              <li><span className="check-circle"><CheckSVG /></span>Minimal Rejections</li>
              <li><span className="check-circle"><CheckSVG /></span>High Claim Acceptance Rate</li>
              <li><span className="check-circle"><CheckSVG /></span>100% HIPAA Compliant Process</li>
              <li><span className="check-circle"><CheckSVG /></span>Robust Practice Medical Billing Audits</li>
              <li><span className="check-circle"><CheckSVG /></span>Enhance Cash Flow And Reduce Billing Errors</li>
            </ul>
          </div>
          <div className="why-work-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--white)', padding: '48px 32px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ color: 'var(--navy)', marginBottom: '12px', fontSize: '24px' }}>Ready for a Free Consultation?</h3>
            <p style={{ color: 'var(--gray4)', marginBottom: '32px', lineHeight: '1.6' }}>
              Let our billing specialists analyze your revenue cycle and identify areas for immediate cash flow improvement. No obligation.
            </p>
            <Link href="/contact" className="btn-modern btn-modern-primary" style={{ padding: '16px 32px', fontSize: '16px', width: '100%', maxWidth: '300px' }}>
              Go to Contact Us Form →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 9. CTA BANNER ═══ */}
      <div className="cta-banner">
        <h2>Ready to Recover Your Lost Revenue?</h2>
        <p>Get a free, no-obligation billing audit — we&apos;ll show you exactly what you&apos;re leaving on the table.</p>
        <div className="btn-group" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn-modern btn-modern-secondary" style={{ background: 'white', color: 'var(--navy)' }}>Schedule Free Audit</Link>
          <a href="tel:8662007200" className="btn-modern btn-modern-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>📞 Call (866) 200-7200</a>
        </div>
      </div>

      {/* ═══ 10. QUICK CONTACT CTA ═══ */}
      <section className="section">
        <div className="container">
          <div className="center" style={{ maxWidth: 760, margin: '0 auto' }}>
            <div className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>Quick Contact</div>
            <h2 className="sec-title">Prefer a Dedicated Contact Page?</h2>
            <p className="sec-sub" style={{ margin: '0 auto 24px' }}>
              Use our full contact page for detailed requests and we will respond within 2 business hours.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn-modern btn-modern-primary">Go to Contact Form</Link>
              <a href="tel:8662007200" className="btn-modern btn-modern-outline">Call (866) 200-7200</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
