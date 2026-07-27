'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const STATUS_COLORS = {
  draft: '#718096', submitted: '#4299e1', pending: '#ed8936',
  paid: '#48bb78', denied: '#f56565', appealed: '#9f7aea', void: '#a0aec0'
};

export default function ClaimsClient({ claims, role }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  function applyFilters(s, st) {
    const p = new URLSearchParams();
    if (s) p.set('search', s);
    if (st) p.set('status', st);
    startTransition(() => router.push(`/claims?${p.toString()}`));
  }

  function exportCSV() {
    const headers = ['Claim #', 'Patient', 'Service Date', 'Amount', 'Status', 'Submitted By', 'Created'];
    const rows = claims.map(c => [
      c.claim_number,
      `"${c.patients?.first_name || ''} ${c.patients?.last_name || ''}"`,
      c.service_date ? new Date(c.service_date).toLocaleDateString() : '',
      parseFloat(c.total_charge || 0).toFixed(2),
      c.status,
      `"${c.users?.full_name || ''}"`,
      new Date(c.created_at).toLocaleDateString(),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claims_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); applyFilters(search, e.target.value); }}
          style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
          <option value="">All Statuses</option>
          {['draft','submitted','pending','paid','denied','appealed','void'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <input type="text" value={search}
          onChange={e => { setSearch(e.target.value); applyFilters(e.target.value, statusFilter); }}
          placeholder="Search by claim # or patient..."
          style={{ flex: 1, minWidth: '220px', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
        <button onClick={exportCSV}
          style={{ padding: '12px 18px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#4a5568', cursor: 'pointer' }}>
          ⬇ Export CSV
        </button>
        {isPending && <span style={{ fontSize: '13px', color: '#718096' }}>Filtering...</span>}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '14px', color: '#718096', marginBottom: '16px' }}>{claims.length} claim{claims.length !== 1 ? 's' : ''}</p>
        {claims.length > 0 ? (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  {['Claim #','Patient','Service Date','Amount','Status','Submitted By','Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 8px', fontWeight: '600', color: '#2d3748' }}>{claim.claim_number}</td>
                    <td style={{ padding: '12px 8px', color: '#2d3748' }}>{claim.patients?.first_name} {claim.patients?.last_name}</td>
                    <td style={{ padding: '12px 8px', color: '#718096' }}>{claim.service_date ? new Date(claim.service_date).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '12px 8px', color: '#2d3748', fontWeight: '600' }}>
                      ${parseFloat(claim.total_charge || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: STATUS_COLORS[claim.status], color: 'white' }}>
                        {claim.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', color: '#718096', fontSize: '13px' }}>{claim.users?.full_name || '—'}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <Link href={`/claims/${claim.id}`} style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>
                        View / Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', color: '#718096' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No claims found</p>
          </div>
        )}
      </div>
    </div>
  );
}
