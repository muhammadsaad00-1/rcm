'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const SLIDES = [
  {
    id: 'reimbursement',
    eyebrow: 'Revenue cycle, accelerated',
    title: 'Get paid faster,\nwith fewer write-offs.',
    body: 'Independent practices using RenoxMed significantly cut average AR days in the first 90 days — without hiring more billers.',
    stat: { value: 'Significant', label: 'Avg. AR days reduction' },
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1400&q=80&auto=format&fit=crop',
    accent: 'turquoise',
  },
  {
    id: 'denials',
    eyebrow: 'Denial management',
    title: 'High percentage clean-claims\non first submission.',
    body: "Our scrubbing engine flags coding gaps before claims leave your office. When denials happen, we work them — you don't.",
    stat: { value: 'High Rate', label: 'First-pass acceptance' },
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=80&auto=format&fit=crop',
    accent: 'sage',
  },
  {
    id: 'compliance',
    eyebrow: 'HIPAA & security',
    title: 'Compliance handled,\nso you can stop worrying.',
    body: 'SOC 2 Type II, HIPAA, and HITECH compliant. End-to-end encryption, granular audit logs, and a BAA on day one.',
    stat: { value: 'SOC 2', label: 'Type II certified' },
    image: '/images/hipaa-security.png',
    accent: 'navy',
  },
  {
    id: 'credentialing',
    eyebrow: 'Credentialing & enrollment',
    title: 'From CAQH to first\npayment rapidly.',
    body: 'We handle payer enrollment, re-credentialing, and CAQH attestations end-to-end. You stop chasing paperwork — and start seeing patients.',
    stat: { value: 'Rapid', label: 'Days to first payment' },
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1400&q=80&auto=format&fit=crop',
    accent: 'turquoise',
  },
  {
    id: 'patient-portal',
    eyebrow: 'Patient billing',
    title: 'A patient billing experience\nthat actually gets paid.',
    body: 'Branded statements, text-to-pay, and flexible plans. Patients settle balances faster than industry average.',
    stat: { value: 'Faster', label: 'Patient payments' },
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1400&q=80&auto=format&fit=crop',
    accent: 'sage',
  },
  {
    id: 'for-practices',
    eyebrow: 'Built for independent practices',
    title: 'Boutique service.\nEnterprise-grade results.',
    body: 'A dedicated billing lead, no long-term contracts, and pricing that scales with you — not against you.',
    stat: { value: '1:1', label: 'Dedicated billing lead' },
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1400&q=80&auto=format&fit=crop',
    accent: 'navy',
  },
];

const ACCENTS = {
  turquoise: { bg: 'var(--rmh-turquoise)', ink: '#06322F' },
  sage: { bg: 'var(--rmh-sage-deep)', ink: '#1F3A2A' },
  navy: { bg: 'var(--rmh-navy)', ink: '#E6F2F4' },
};

const HEADLINE = 'Billing built for the\nway you actually practice.';
const AUTOPLAY_MS = 4000;

function SplitHeadline({ text }) {
  const lines = text.split('\n');
  return (
    <span className="rmh-split">
      {lines.map((line, li) => {
        const words = line.split(' ');
        return (
          <span className="rmh-split__line" key={li}>
            {words.map((w, wi) => (
              <span
                className="rmh-split__word"
                key={wi}
                style={{ animationDelay: `${(li * 6 + wi) * 40}ms` }}
              >
                {w}
                {wi < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}

function HeroCopy({ slide, idx, total, onSelect, slides }) {
  return (
    <div className="rmh-hero__copy">
      <div className="rmh-hero__eyebrow">
        <span className="rmh-hero__eyebrow-dot" />
        <span className="rmh-hero__eyebrow-text">{slide.eyebrow}</span>
        <span className="rmh-hero__eyebrow-count">
          {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <h1 className="rmh-hero__title" key={slide.id}>
        <SplitHeadline text={idx === 0 ? HEADLINE : slide.title} />
      </h1>

      <p className="rmh-hero__body" key={slide.id + '-body'}>{slide.body}</p>

      <div className="rmh-hero__ctas">
        <a className="rmh-btn rmh-btn--primary" href="/contact">
          Get a free billing audit
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a className="rmh-btn rmh-btn--secondary" href="/specialties">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Explore Specialties
        </a>
      </div>

      <ol className="rmh-hero__tabs" role="tablist" aria-label="Carousel slides">
        {slides.map((s, i) => (
          <li key={s.id}>
            <button
              role="tab"
              aria-selected={i === idx}
              className={'rmh-hero__tab' + (i === idx ? ' is-active' : '')}
              onClick={() => onSelect(i)}
            >
              <span className="rmh-hero__tab-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="rmh-hero__tab-label">{s.eyebrow}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HeroMedia({ slide, accent, progress }) {
  return (
    <div className="rmh-hero__media" key={slide.id}>
      <div className="rmh-hero__image-wrap">
        <img className="rmh-hero__image" src={slide.image} alt="" />
        <div className="rmh-hero__image-tint" />
      </div>

      <div
        className="rmh-hero__band"
        style={{ background: accent.bg, color: accent.ink }}
      >
        <div className="rmh-hero__stat">
          <div className="rmh-hero__stat-value">{slide.stat.value}</div>
          <div className="rmh-hero__stat-label">{slide.stat.label}</div>
        </div>
        <div className="rmh-hero__band-meta">
          <div className="rmh-hero__band-rows">
            <span><em>SOC 2 Type II</em></span>
            <span className="rmh-hero__dot" />
            <span><em>HIPAA</em></span>
            <span className="rmh-hero__dot" />
            <span><em>HITRUST-aligned</em></span>
          </div>
          <a className="rmh-hero__band-link" href="#case">
            Read the case study
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <div className="rmh-hero__progress" aria-hidden="true">
        <div className="rmh-hero__progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
}

export default function HomeHero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const pausedAccumRef = useRef(0);
  const pauseStartRef = useRef(0);

  const goTo = useCallback((next) => {
    setIdx(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setProgress(0);
    startRef.current = (typeof performance !== 'undefined' ? performance.now() : 0);
    pausedAccumRef.current = 0;
  }, []);

  useEffect(() => {
    startRef.current = performance.now();
    pausedAccumRef.current = 0;
    let cancelled = false;
    const tick = (t) => {
      if (cancelled) return;
      if (paused) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = t - startRef.current - pausedAccumRef.current;
      const p = Math.min(1, elapsed / AUTOPLAY_MS);
      setProgress(p);
      if (p >= 1) {
        goTo(idx + 1);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(rafRef.current); };
  }, [idx, paused, goTo]);

  useEffect(() => {
    if (paused) {
      pauseStartRef.current = performance.now();
    } else if (pauseStartRef.current) {
      pausedAccumRef.current += performance.now() - pauseStartRef.current;
      pauseStartRef.current = 0;
    }
  }, [paused]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(idx + 1);
      else if (e.key === 'ArrowLeft') goTo(idx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, goTo]);

  const slide = SLIDES[idx];
  const accent = ACCENTS[slide.accent] || ACCENTS.turquoise;

  return (
    <section
      className="rmh-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="rmh-hero__grid">
        <HeroCopy
          slide={slide}
          idx={idx}
          total={SLIDES.length}
          onSelect={goTo}
          slides={SLIDES}
        />
        <HeroMedia slide={slide} accent={accent} progress={progress} />
      </div>
    </section>
  );
}
