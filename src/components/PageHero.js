export default function PageHero({ tag, title, titleAccent, description }) {
    return (
        <div className="page-hero">
            <div className="page-hero-dots"></div>
            <div className="page-hero-inner">
                {tag && <div className="page-hero-tag">{tag}</div>}
                <h1>{title} {titleAccent && <em>{titleAccent}</em>}</h1>
                {description && <p>{description}</p>}
            </div>
        </div>
    );
}
