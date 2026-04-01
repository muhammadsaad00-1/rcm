export default function KpiCard({ label, value, icon, color, highlight }) {
    return (
        <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--r-md)',
            padding: '20px 24px',
            boxShadow: highlight ? `0 0 0 2px ${color}40, var(--shadow-md)` : 'var(--shadow-sm)',
            borderLeft: `4px solid ${color}`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'default',
        }}
        className="kpi-card-hover"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: 'var(--text3)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{label}</p>
                    <p style={{ fontSize: '26px', fontWeight: '800', color, margin: 0, lineHeight: '1' }}>{value}</p>
                </div>
                <span style={{ fontSize: '28px' }}>{icon}</span>
            </div>
        </div>
    );
}
