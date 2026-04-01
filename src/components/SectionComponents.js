'use client';

/**
 * Reusable Section Components for Landing Pages
 * 
 * Includes:
 * - ImageCardGrid: Grid of cards with images, icons, or colored backgrounds
 * - FeatureSection: 2-column layout with image on one side, content on other
 * - StatsSection: Large numbers with labels
 * - TabsSection: Tabbed content (Why Choose Us, etc.)
 */

// Image card grid component
export function ImageCardGrid({ title, description, cards, columns = 3 }) {
  return (
    <section style={{ padding: '80px 5%', background: 'var(--light-gray)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {(title || description) && (
          <div style={{ marginBottom: '60px', textAlign: 'center' }}>
            {title && (
              <h2 style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                color: 'var(--navy)',
                marginBottom: '16px',
                fontWeight: '800'
              }}>
                {title}
              </h2>
            )}
            {description && (
              <p style={{
                fontSize: '16px',
                color: 'var(--slate)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.7'
              }}>
                {description}
              </p>
            )}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${100 / columns}%, 1fr))`,
          gap: '24px'
        }}>
          {cards.map((card, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image or colored background */}
              <div style={{
                height: '200px',
                background: card.imageUrl
                  ? `url(${card.imageUrl}) center/cover`
                  : card.bgColor || 'var(--teal-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {card.icon && !card.imageUrl && card.icon}
              </div>

              {/* Content */}
              <div style={{ padding: '24px' }}>
                <h3 style={{
                  fontSize: '18px',
                  color: 'var(--navy)',
                  marginBottom: '10px',
                  fontWeight: '700'
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--slate)',
                  lineHeight: '1.6'
                }}>
                  {card.description}
                </p>
                {card.link && (
                  <a
                    href={card.link}
                    style={{
                      display: 'inline-block',
                      marginTop: '12px',
                      color: 'var(--teal)',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Learn more →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Feature section with image + content
export function FeatureSection({
  title,
  description,
  imageUrl,
  features,
  reversed = false,
  bgColor = 'white'
}) {
  return (
    <section style={{ padding: '80px 5%', background: bgColor }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center'
        }}
      >
        {/* Content side */}
        <div style={{ order: reversed ? 2 : 1 }}>
          {title && (
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              color: 'var(--navy)',
              marginBottom: '20px',
              fontWeight: '800',
              lineHeight: '1.15'
            }}>
              {title}
            </h2>
          )}
          {description && (
            <p style={{
              fontSize: '16px',
              color: 'var(--slate)',
              marginBottom: '32px',
              lineHeight: '1.7'
            }}>
              {description}
            </p>
          )}

          {features && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    fontSize: '20px',
                    minWidth: '28px',
                    fontWeight: 'bold'
                  }}>
                    {feature.icon || '✓'}
                  </div>
                  <div>
                    <h4 style={{
                      color: 'var(--navy)',
                      margin: '0 0 4px 0',
                      fontWeight: '600'
                    }}>
                      {feature.title}
                    </h4>
                    <p style={{
                      color: 'var(--slate)',
                      margin: 0,
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image side */}
        <div style={{ order: reversed ? 1 : 2 }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Feature"
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '400px',
              background: 'var(--light-gray)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slate)',
              fontSize: '14px'
            }}>
              📸 Image placeholder
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Stats section
export function StatsSection({ stats, bgColor = 'var(--navy)' }) {
  return (
    <section style={{
      padding: '60px 5%',
      background: bgColor
    }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
          gap: '40px',
          textAlign: 'center'
        }}
      >
        {stats.map((stat, idx) => (
          <div key={idx}>
            <div
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: '800',
                color: 'white',
                marginBottom: '8px',
                fontFamily: "'Playfair Display', serif"
              }}
            >
              {stat.value}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '500'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default { ImageCardGrid, FeatureSection, StatsSection };
