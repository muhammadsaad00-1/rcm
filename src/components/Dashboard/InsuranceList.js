export default function InsuranceList({ insurance }) {
    return (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-sm)', padding: '20px 24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--navy)', marginBottom: '16px' }}>🏥 Insurance on File</h2>
            {insurance.length === 0 ? (
                <p style={{ color: 'var(--gray4)', fontSize: '13px' }}>No insurance records on file. Contact our office to update your insurance information.</p>
            ) : (
                insurance.map(ins => (
                    <div key={ins.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--gray2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--navy)' }}>{ins.insurance_companies?.company_name || 'Unknown'}</span>
                            <span style={{ background: ins.coverage_type === 'primary' ? 'var(--blue-soft, #DBEAFE)' : 'var(--purple-soft, #F3E8FF)', color: ins.coverage_type === 'primary' ? 'var(--blue-bold, #1D4ED8)' : 'var(--purple-bold, #7C3AED)', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase' }}>
                                {ins.coverage_type}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text3)', fontSize: '13px', margin: 0 }}>Policy: {ins.policy_number} {ins.group_number ? `· Group: ${ins.group_number}` : ''}</p>
                    </div>
                ))
            )}
        </div>
    );
}
