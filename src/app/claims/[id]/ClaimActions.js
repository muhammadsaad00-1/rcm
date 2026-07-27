'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = ['draft', 'submitted', 'pending', 'paid', 'denied', 'appealed', 'void'];

export default function ClaimActions({ claim, role, userId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [status, setStatus] = useState(claim.status);
  const [notes, setNotes] = useState(claim.notes || '');
  const [error, setError] = useState('');

  const canEdit = role === 'admin' || (role === 'billing' && claim.submitted_by === userId && !['paid', 'void'].includes(claim.status));
  const canDelete = role === 'admin';

  async function saveStatus() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/claims/${claim.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowEdit(false);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteClaim() {
    if (!confirm(`Delete claim ${claim.claim_number}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/claims/${claim.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/claims');
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {canEdit && (
          <button onClick={() => setShowEdit(true)}
            className="btn-modern btn-modern-outline" style={{ background: 'var(--white)', fontSize: '14px' }}>
            Edit Claim
          </button>
        )}
        {canDelete && (
          <button onClick={deleteClaim} disabled={loading}
            style={{ padding: '10px 18px', background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
            Delete
          </button>
        )}
      </div>

      {showEdit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,20,55,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card-modern" style={{ width: '480px', maxWidth: '90vw' }}>
            <h3 className="text-navy font-bold" style={{ fontSize: '20px', marginBottom: '20px' }}>Edit Claim {claim.claim_number}</h3>

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid var(--red)', color: 'var(--red)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label className="font-semibold text-navy" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="font-semibold text-navy" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowEdit(false); setError(''); }}
                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                Cancel
              </button>
              <button onClick={saveStatus} disabled={loading}
                style={{ padding: '10px 20px', background: 'var(--navy)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
