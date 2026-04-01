import Link from 'next/link';

export default function CtaSection({ title, description, primaryText, primaryHref, secondaryText, secondaryHref }) {
    return (
        <section className="cta-section">
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="cta-btns">
                {primaryText && (
                    <Link href={primaryHref || '/contact'} className="btn-white">{primaryText}</Link>
                )}
                {secondaryText && (
                    secondaryHref?.startsWith('tel:') ? (
                        <a href={secondaryHref} className="btn-white-outline">{secondaryText}</a>
                    ) : (
                        <Link href={secondaryHref || '/contact'} className="btn-white-outline">{secondaryText}</Link>
                    )
                )}
            </div>
        </section>
    );
}
