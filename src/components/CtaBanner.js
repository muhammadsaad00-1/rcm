import Link from 'next/link';

export default function CtaBanner({ title, description, primaryText, primaryHref, secondaryText, secondaryHref }) {
    return (
        <div className="cta-banner">
            <h2>{title || 'Ready to Recover Your Lost Revenue?'}</h2>
            <p>{description || "Get a free, no-obligation billing audit — we'll show you exactly what you're leaving on the table."}</p>
            <div className="btn-group" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                {primaryText && <Link href={primaryHref || '/contact'} className="btn-white">{primaryText}</Link>}
                {secondaryText && (
                    secondaryHref?.startsWith('tel:')
                        ? <a href={secondaryHref} className="btn-ghost-white">{secondaryText}</a>
                        : <Link href={secondaryHref || '/contact'} className="btn-ghost-white">{secondaryText}</Link>
                )}
            </div>
        </div>
    );
}
