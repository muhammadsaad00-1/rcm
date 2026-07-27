'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const TYPE_COLORS = { insurance: '#4299e1', patient: '#48bb78', adjustment: '#ed8936', refund: '#f56565' };

export default function PaymentsClient({ payments }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [fromDate, setFromDate] = useState(searchParams.get('from') || '');
  const [toDate, setToDate] = useState(searchParams.get('to') || '');

  function applyFilters(t, f, to) {
    const p = new URLSearchParams();
    if (t) p.set('type', t);
    if (f) p.set('from', f);
    if (to) p.set('to', to);
    startTransition(() => router.push(`/payments?${p.toString()}`));
  }

  function exportCSV() {
    const headers = ['Payment #', 'Claim #', 'Patient', 'Type', 'Amount', 'Date', 'Posted By'];
    const rows = payments.map(p => [
      p.payment_number,
      p.claims?.claim_number || '',
      `"${p.claims?.patients?.first_name || ''} ${p.claims?.patients?.last_name || ''}"`,
      p.payment_type,
      parseFloat(p.amount_paid || 0).toFixed(2),
      new Date(p.payment_date).toLocaleDateString(),
      `"${p.users?.full_name || ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); applyFilters(e.target.value, fromDate, toDate); }}
          style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
          <option value="">All Types</option>
          <option value="insurance">Insurance</option>
          <option value="patient">Patient</option>
          <option value="adjustment">Adjustment</option>
          <option value="refund">Refund</option>
        </select>
        <input type="date" value={fromDate}
          onChange={e => { setFromDate(e.target.value); applyFilters(typeFilter, e.target.value, toDate); }}
          style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
        <span style={{ color: '#718096', fontSize: '13px' }}>to</span>
        <input type="date" value={toDate}
          onChange={e => { setToDate(e.target.value); applyFilters(typeFilter, fromDate, e.target.value); }}
          style={{ padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
        <button onClick={exportCSV}
          style={{ padding: '12px 18px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#4a5568', cursor: 'pointer' }}>
          ⬇ Export CSV
        </button>
        {isPending && <span style={{ fontSize: '13px', color: '#718096' }}>Filtering...</span>}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '14px', color: '#718096', marginBottom: '16px' }}>{payments.length} payment{payments.length !== 1 ? 's' : ''}</p>
        {payments.length > 0 ? (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  {['Payment #','Claim #','Patient','Type','Amount','Date','Posted By'].map(h => (
                    <th key={h} style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 8px', fontWeight: '600', color: '#2d3748' }}>{payment.payment_number}</td>
                    <td style={{ padding: '12px 8px', color: '#667eea', fontWeight: '600' }}>{payment.claims?.claim_number || '—'}</td>
                    <td style={{ padding: '12px 8px', color: '#2d3748' }}>{payment.claims?.patients?.first_name} {payment.claims?.patients?.last_name}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: TYPE_COLORS[payment.payment_type] || '#718096', color: 'white' }}>
                        {payment.payment_type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', color: '#48bb78', fontWeight: '700', fontSize: '15px' }}>
                      ${parseFloat(payment.amount_paid).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 8px', color: '#718096' }}>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 8px', color: '#718096', fontSize: '13px' }}>{payment.users?.full_name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', color: '#718096' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No payments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
