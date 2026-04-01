import Link from 'next/link';

export default function Breadcrumb({ items }) {
    return (
        <div className="breadcrumb">
            <div className="breadcrumb-inner">
                {items.map((item, i) => (
                    <span key={i}>
                        {i > 0 && <span className="breadcrumb-sep" style={{ margin: '0 4px' }}>›</span>}
                        {i === items.length - 1 ? (
                            <span className="breadcrumb-cur">{item.label}</span>
                        ) : (
                            <Link href={item.href} style={{ cursor: 'pointer' }}>{item.label}</Link>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
}
