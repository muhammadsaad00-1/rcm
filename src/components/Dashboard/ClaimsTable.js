const thStyle = {
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
};

const tdStyle = {
    padding: '12px 16px',
    fontSize: '14px',
    color: 'var(--text2)',
};

const statusColor = {
    draft: '#6B7280',
    submitted: '#2563EB',
    pending: '#D97706',
    approved: '#059669',
    denied: '#DC2626',
    paid: '#16A34A',
    partial: '#D97706',
    appealed: '#7C3AED',
};

export default function ClaimsTable({ claims }) {
    return (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--navy)', margin: 0 }}>📄 Your Claims</h2>
                <span style={{ fontSize: '13px', color: 'var(--text3)' }}>{claims.length} total</span>
            </div>
            {claims.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray4)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                    <p>No claims on file yet. If you recently had a visit, your claim may still be processing.</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--gray1)' }}>
                                <th style={thStyle}>Claim #</th>
                                <th style={thStyle}>Service Date</th>
                                <th style={thStyle}>Amount</th>
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map(claim => (
                                <tr key={claim.id} style={{ borderTop: '1px solid var(--gray2)', transition: 'background-color 0.15s ease' }} className="table-row-hover">
                                    <td style={tdStyle}>
                                        <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text)' }}>{claim.claim_number}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        {claim.service_date ? new Date(claim.service_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{ fontWeight: '600', color: 'var(--navy)' }}>
                                            ${parseFloat(claim.total_charge).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            background: `${statusColor[claim.status] || '#6B7280'}18`,
                                            color: statusColor[claim.status] || '#6B7280',
                                            padding: '3px 10px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            textTransform: 'capitalize',
                                        }}>
                                            {claim.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
