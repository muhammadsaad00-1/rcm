'use client';

/**
 * WhyChooseUs Component
 * Professional feature cards highlighting RenoxMed's value propositions
 */

export default function WhyChooseUs() {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning-Fast Claims',
      description: 'Submit to 2,500+ payers within 48 hours. Real-time tracking, zero delays.',
      highlight: '99.2% clean claim rate'
    },
    {
      icon: '🎯',
      title: 'Denial Prevention',
      description: 'AI-powered coding catches errors before submission. Reduce denials by up to 95%.',
      highlight: '19-day faster AR'
    },
    {
      icon: '💰',
      title: 'Revenue Recovery',
      description: 'We find and recover revenue you didn\'t know you were losing.',
      highlight: '$2.4B in cumulative revenue managed'
    },
    {
      icon: '🔒',
      title: '100% HIPAA Protected',
      description: 'SOC 2 Type II certified. Your patient data is our top priority.',
      highlight: 'Zero data breaches since 2012'
    },
    {
      icon: '🧠',
      title: 'Specialty Expertise',
      description: 'Billers certified in 40+ medical specialties. We speak your language.',
      highlight: 'Cardiology, Orthopedics, Neurology, and more'
    },
    {
      icon: '👥',
      title: 'Dedicated Account Manager',
      description: 'A real person manages your account. Not an automated system.',
      highlight: 'Available Monday–Friday 8am–7pm EST'
    }
  ];

  return (
    <section style={{ padding: '100px 5%', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ marginBottom: '80px', textAlign: 'center' }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--teal)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '12px'
          }}>
            ✨ Why Choose RenoxMed
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            color: 'var(--navy)',
            fontWeight: '800',
            marginBottom: '20px',
            lineHeight: '1.15'
          }}>
            The Medical Billing Partner You Deserve
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'var(--slate)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            We've managed $2.4B in claims for 5,000+ practices. Here's why they choose us over traditional billing companies.
          </p>
        </div>

        {/* Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--teal)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {/* Decorator top border */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, var(--teal), var(--gold))',
                opacity: 0
              }}></div>

              {/* Icon */}
              <div style={{
                fontSize: '42px',
                marginBottom: '16px',
                display: 'inline-block'
              }}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--navy)',
                marginBottom: '12px',
                lineHeight: '1.3'
              }}>
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '14px',
                color: 'var(--slate)',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                {feature.description}
              </p>

              {/* Highlight badge */}
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--teal)',
                background: 'rgba(13, 140, 140, 0.08)',
                padding: '10px 12px',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(13, 140, 140, 0.15)',
                display: 'inline-block'
              }}>
                📊 {feature.highlight}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '80px',
          textAlign: 'center',
          padding: '48px',
          background: 'var(--light-gray)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            fontSize: '20px',
            color: 'var(--navy)',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            Ready to experience the difference?
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--slate)',
            marginBottom: '24px',
            maxWidth: '500px',
            margin: '0 auto 24px'
          }}>
            Get a free, personalized billing audit from our specialists. Zero commitment, zero sales pressure.
          </p>
          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--gold)',
              color: 'var(--navy)',
              padding: '14px 32px',
              borderRadius: 'var(--radius-full)',
              fontWeight: '700',
              fontSize: '15px',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 20px rgba(240, 180, 41, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e5a820';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 32px rgba(240, 180, 41, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--gold)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(240, 180, 41, 0.4)';
            }}
          >
            Get Free Audit →
          </a>
        </div>
      </div>
    </section>
  );
}
