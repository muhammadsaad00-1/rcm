'use client';

export default function ReportsExport({ claims, payments, denials, agingBuckets }) {
  function exportClaims() {
    const h = ['Claim #', 'Patient', 'Service Date', 'Amount', 'Status'];
    const rows = claims.map(c => [
      c.claim_number,
      `"${c.patients?.first_name || ''} ${c.patients?.last_name || ''}"`,
      c.service_date ? new Date(c.service_date).toLocaleDateString() : '',
      parseFloat(c.total_charge || 0).toFixed(2),
      c.status,
    ]);
    downloadCSV([h, ...rows], `claims_report_${today()}.csv`);
  }

  function exportPayments() {
    const h = ['Payment #', 'Claim #', 'Patient', 'Type', 'Amount', 'Date'];
    const rows = payments.map(p => [
      p.payment_number,
      p.claims?.claim_number || '',
      `"${p.claims?.patients?.first_name || ''} ${p.claims?.patients?.last_name || ''}"`,
      p.payment_type,
      parseFloat(p.amount_paid || 0).toFixed(2),
      new Date(p.payment_date).toLocaleDateString(),
    ]);
    downloadCSV([h, ...rows], `payments_report_${today()}.csv`);
  }

  function exportAging() {
    const h = ['Bucket', 'Claims', 'Amount Outstanding'];
    const rows = agingBuckets.map(b => [`"${b.label}"`, b.count, b.amount.toFixed(2)]);
    downloadCSV([h, ...rows], `ar_aging_${today()}.csv`);
  }

  function exportDenials() {
    const h = ['Claim #', 'Patient', 'Reason', 'Amount', 'Date', 'Appealed'];
    const rows = denials.map(d => [
      d.claims?.claim_number || '',
      `"${d.claims?.patients?.first_name || ''} ${d.claims?.patients?.last_name || ''}"`,
      `"${d.denial_reason || ''}"`,
      parseFloat(d.amount_denied || 0).toFixed(2),
      new Date(d.denial_date).toLocaleDateString(),
      d.is_appealed ? 'Yes' : 'No',
    ]);
    downloadCSV([h, ...rows], `denials_report_${today()}.csv`);
  }

  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <ExportBtn label="Export Claims" onClick={exportClaims} />
      <ExportBtn label="Export Payments" onClick={exportPayments} />
      <ExportBtn label="Export AR Aging" onClick={exportAging} />
      <ExportBtn label="Export Denials" onClick={exportDenials} />
    </div>
  );
}

function ExportBtn({ label, onClick }) {
  return (
    <button onClick={onClick}
      style={{ padding: '10px 16px', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--navy)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
      ⬇ {label}
    </button>
  );
}

function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
