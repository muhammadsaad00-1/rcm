'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DenialsActions({ denial, role }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAppeal, setShowAppeal] = useState(false);
  const [appealNotes, setAppealNotes] = useState('');
  const [error, setError] = useState('');

  async function fileAppeal() {
    if (!appealNotes.trim()) {
      setError('Appeal notes are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/denials/${denial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_appealed: true,
          appeal_date: new Date().toISOString().slice(0, 10),
          appeal_notes: appealNotes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to file appeal');
      setShowAppeal(false);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete this denial record for claim ${denial.claims?.claim_number}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/denials/${denial.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => setShowAppeal(true)}
          disabled={loading}
          style={{
            padding: '6px 12px',
            background: 'var(--gold)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          File Appeal
        </button>
        {role === 'admin' && (
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: '6px 10px',
              background: 'transparent',
              color: 'var(--red)',
              border: '1px solid var(--red)',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        )}
      </div>

      {showAppeal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(11,20,55,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="card-modern" style={{ width: '480px', maxWidth: '90vw' }}>
            <h3 className="text-navy font-bold" style={{ fontSize: '20px', marginBottom: '8px' }}>File Appeal</h3>
            <p className="text-gray text-sm" style={{ marginBottom: '20px' }}>
              Claim: <strong>{denial.claims?.claim_number}</strong> — ${parseFloat(denial.amount_denied).toFixed(2)} denied
            </p>

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid var(--red)', color: 'var(--red)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <label className="font-semibold text-navy" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>
              Appeal Notes <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <textarea
              value={appealNotes}
              onChange={(e) => setAppealNotes(e.target.value)}
              placeholder="Describe the grounds for appeal, supporting documentation, corrective steps taken..."
              rows={5}
              style={{
                width: '100%', padding: '12px', border: '1px solid var(--border)',
                borderRadius: '8px', fontSize: '14px', resize: 'vertical', outline: 'none',
                fontFamily: 'inherit',
              }}
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAppeal(false); setError(''); }}
                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                Cancel
              </button>
              <button onClick={fileAppeal} disabled={loading}
                style={{ padding: '10px 20px', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                {loading ? 'Filing...' : 'Submit Appeal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
