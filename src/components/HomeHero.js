'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Pipeline phases:
 *  0 - Step 1 active (just started)
 *  1 - Step 1 done, Step 2 active
 *  2 - Step 1 & 2 done, Step 3 active  ← default starting point
 *  3 - All done, show approved notification
 *  then loop back to 0
 */
const PIPELINE_STEPS = [
    { id: 0, name: 'Patient Eligibility Checked', sub: { done: 'Completed automatically', active: 'Checking insurance...' } },
    { id: 1, name: 'CPT / ICD-10 Coding',         sub: { done: 'Verified by AI & Specialist', active: 'Running AI scrub...' } },
    { id: 2, name: 'Claim Submission',             sub: { done: 'Sent to payer successfully', active: 'Routing to Payer...' } },
];

function StepIcon({ state }) {
    if (state === 'done') {
        return (
            <svg className="hm-check-svg" viewBox="0 0 24 24" fill="none"
                stroke="var(--teal)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline className="hm-check-path" points="20 6 9 17 4 12" />
            </svg>
        );
    }
    if (state === 'active') {
        return (
            <div className="hm-spinner-ring">
                <div className="hm-spinner-arc" />
            </div>
        );
    }
    // pending
    return (
        <div className="hm-step-pending-dot" />
    );
}

export default function HomeHero() {
    const [mounted, setMounted]   = useState(false);
    const [phase, setPhase]       = useState(2);   // start at phase 2 so viewers see the animation
    const [showNotif, setShowNotif] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!mounted) return;

        // Phase 3 = all done → show notification, then restart
        if (phase === 3) {
            setShowNotif(true);
            const timer = setTimeout(() => {
                setShowNotif(false);
                setTimeout(() => setPhase(0), 600); // fade out then reset
            }, 3200);
            return () => clearTimeout(timer);
        }

        // Each active phase lasts 2.8 s then advances
        const durations = [2400, 2600, 2800];
        const timer = setTimeout(() => {
            setPhase(p => p + 1);
        }, durations[phase] ?? 2800);

        return () => clearTimeout(timer);
    }, [mounted, phase]);

    const getStepState = (stepIndex) => {
        if (stepIndex < phase) return 'done';
        if (stepIndex === phase && phase < 3) return 'active';
        return 'pending';
    };

    return (
        <section className="hero-modern">
            <div className="hero-modern-bg">
                <div className="hm-gradient-1" />
                <div className="hm-gradient-2" />
                <div className="hm-grid" />

                {/* Floating glowing tile particles */}
                <div className="hm-tile" style={{ top: '12%',  left: '8%',  '--size': '52px', '--tx': '18px',  '--ty': '-22px', '--dur': '13s', '--delay': '0s',    '--opacity': '0.14', '--bg-opacity': '0.04' }} />
                <div className="hm-tile" style={{ top: '68%',  left: '14%', '--size': '30px', '--tx': '-12px', '--ty': '-18px', '--dur': '9s',  '--delay': '1.4s',  '--opacity': '0.09', '--bg-opacity': '0.02' }} />
                <div className="hm-tile" style={{ top: '35%',  left: '3%',  '--size': '20px', '--tx': '10px',  '--ty': '14px',  '--dur': '11s', '--delay': '2.8s',  '--opacity': '0.12', '--bg-opacity': '0.03' }} />
                <div className="hm-tile" style={{ top: '80%',  left: '40%', '--size': '44px', '--tx': '-20px', '--ty': '-10px', '--dur': '16s', '--delay': '0.5s',  '--opacity': '0.08', '--bg-opacity': '0.02' }} />
                <div className="hm-tile" style={{ top: '22%',  left: '55%', '--size': '26px', '--tx': '14px',  '--ty': '20px',  '--dur': '10s', '--delay': '3.5s',  '--opacity': '0.11', '--bg-opacity': '0.03' }} />
                <div className="hm-tile" style={{ top: '55%',  left: '72%', '--size': '38px', '--tx': '-16px', '--ty': '-12px', '--dur': '14s', '--delay': '1s',    '--opacity': '0.10', '--bg-opacity': '0.025' }} />
                <div className="hm-tile" style={{ top: '8%',   left: '78%', '--size': '22px', '--tx': '8px',   '--ty': '18px',  '--dur': '8s',  '--delay': '4.2s',  '--opacity': '0.13', '--bg-opacity': '0.03' }} />
                <div className="hm-tile" style={{ top: '45%',  left: '90%', '--size': '56px', '--tx': '-22px', '--ty': '-8px',  '--dur': '18s', '--delay': '2s',    '--opacity': '0.07', '--bg-opacity': '0.02' }} />
            </div>

            <div className="container hm-container">
                {/* ── Left content ── */}
                <div className={`hm-content ${mounted ? 'animate-in' : ''}`}>
                    <div className="hm-badge">
                        <span className="hm-badge-dot" />
                        HIPAA Compliant · US-Based · Trusted by 1,200+ Providers
                    </div>

                    <h1 className="hm-title">
                        Medical Billing That <br className="hidden-mobile" />
                        <span className="hm-highlight">Maximizes Your Revenue</span>
                    </h1>

                    <p className="hm-desc">
                        Stop losing 15–25% of your earned revenue to billing inefficiencies.
                        ClearClaim delivers end-to-end revenue cycle management with a 98.3%
                        clean claim rate — starting at just 2.95% of collections.
                    </p>

                    <div className="hm-actions" style={{ display: 'flex', gap: '16px' }}>
                        <Link href="/contact" className="btn-modern btn-modern-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
                            Get Free Practice Audit
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"
                                style={{ marginLeft: 8 }}>
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                        <a href="tel:8662007200" className="btn-modern btn-modern-outline" style={{ background: 'var(--white)', padding: '14px 28px', fontSize: '16px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"
                                style={{ marginRight: 8 }}>
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
                                    19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1
                                    4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0
                                    1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1
                                    2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            (866) 200-7200
                        </a>
                    </div>

                    <div className="hm-trust-metrics">
                        <div className="hm-trust-item">
                            <div className="hm-trust-val">98.3%</div>
                            <div className="hm-trust-lbl">Clean Claim Rate</div>
                        </div>
                        <div className="hm-trust-divider" />
                        <div className="hm-trust-item">
                            <div className="hm-trust-val">18 Days</div>
                            <div className="hm-trust-lbl">Avg. AR Turnaround</div>
                        </div>
                        <div className="hm-trust-divider" />
                        <div className="hm-trust-item">
                            <div className="hm-trust-val">Zero</div>
                            <div className="hm-trust-lbl">Long-Term Contracts</div>
                        </div>
                    </div>
                </div>

                {/* ── Right visual card ── */}
                <div className={`hm-visual ${mounted ? 'animate-in-delay' : ''}`}>
                    <div className="hm-card glass-panel-premium">
                        <div className="hm-card-glow" />

                        <div className="hm-card-header">
                            <div className="hm-card-title">Live Revenue Pipeline</div>
                            <div className="hm-live-indicator">
                                <span className="hm-live-dot" /> LIVE
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="hm-progress-bar-wrap">
                            <div
                                className="hm-progress-bar-fill"
                                style={{ width: `${Math.min(phase / 3 * 100, 100)}%` }}
                            />
                        </div>

                        <div className="hm-pipeline">
                            {PIPELINE_STEPS.map((step, i) => {
                                const state = getStepState(i);
                                return (
                                    <div
                                        key={step.id}
                                        className={`hm-step hm-step-${state}`}
                                        style={{ '--step-delay': `${i * 0.12}s` }}
                                    >
                                        <div className={`hm-step-icon-wrap ${state === 'active' ? 'hm-icon-active' : ''}`}>
                                            <StepIcon state={state} />
                                        </div>

                                        <div className="hm-step-info">
                                            <div className="hm-step-name">{step.name}</div>
                                            <div className={`hm-step-status ${state === 'active' ? 'processing' : ''}`}>
                                                {state === 'active' && <span className="hm-typing-dot" />}
                                                {state === 'done'   ? step.sub.done   : ''}
                                                {state === 'active' ? step.sub.active  : ''}
                                                {state === 'pending' ? 'Waiting...'    : ''}
                                            </div>
                                        </div>

                                        {state === 'done'   && <div className="hm-step-tag">Done</div>}
                                        {state === 'active' && <div className="hm-step-tag hm-step-tag-active">Live</div>}
                                        {state === 'pending'&& <div className="hm-step-tag hm-step-tag-pending">Queued</div>}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Floating approval notification */}
                        <div className={`hm-notification ${showNotif ? 'hm-notif-show' : 'hm-notif-hide'}`}>
                            <div className="hm-notif-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <div className="hm-notif-content">
                                <strong>Claim #CF-9847 Approved</strong>
                                <span>Aetna · $1,240 · Just now</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
