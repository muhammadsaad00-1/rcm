'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PendingRequestActions({ requestId, email, fullName }) {
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [password, setPassword] = useState('');
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleApprove = async () => {
        if (!password || password.length < 8) {
            setError('Please set a temporary password (min 8 characters).');
            return;
        }
        setApproving(true);
        setError('');
        try {
            const res = await fetch(`/api/admin/portal-requests/${requestId}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ temporaryPassword: password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Approval failed. Please try again.');
                setApproving(false);
                return;
            }
            setShowApproveModal(false);
            router.refresh();
        } catch {
            setError('Network error. Please try again.');
            setApproving(false);
        }
    };

    const handleReject = async () => {
        setRejecting(true);
        setError('');
        try {
            const res = await fetch(`/api/admin/portal-requests/${requestId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: rejectReason }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Rejection failed. Please try again.');
                setRejecting(false);
                return;
            }
            setShowRejectModal(false);
            router.refresh();
        } catch {
            setError('Network error. Please try again.');
            setRejecting(false);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                <button
                    onClick={() => { setShowApproveModal(true); setError(''); setPassword(''); }}
                    style={{ background: '#16A34A', color: 'white', border: 'none', padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                    ✅ Approve
                </button>
                <button
                    onClick={() => { setShowRejectModal(true); setError(''); setRejectReason(''); }}
                    style={{ background: 'white', color: '#DC2626', border: '1.5px solid #FECACA', padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                    ❌ Reject
                </button>
            </div>

            {/* Approve Modal */}
            {showApproveModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '36px', maxWidth: '460px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
                            <h2 style={{ fontWeight: '800', color: '#0B1E3D', marginBottom: '6px' }}>Approve Portal Access</h2>
                            <p style={{ color: '#6B7280', fontSize: '14px' }}>
                                You are approving <strong>{fullName}</strong><br />
                                <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{email}</span>
                            </p>
                        </div>

                        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#92400E', lineHeight: '1.6' }}>
                            ⚠️ Set a <strong>temporary password</strong> for the patient. They will use this to log in at <strong>/portal/login</strong>. Please share it with them directly (phone/in-person) — no email is sent in test mode.
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                                Temporary Password <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                            />
                            <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>
                                Share this with the patient so they can log in. They can update it later.
                            </p>
                        </div>

                        {error && (
                            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowApproveModal(false)}
                                style={{ flex: 1, background: 'white', border: '1.5px solid #E5E7EB', color: '#374151', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={approving}
                                style={{ flex: 2, background: approving ? '#9CA3AF' : '#16A34A', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: approving ? 'not-allowed' : 'pointer' }}
                            >
                                {approving ? 'Approving...' : 'Confirm Approval →'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '36px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>❌</div>
                            <h2 style={{ fontWeight: '800', color: '#0B1E3D', marginBottom: '6px' }}>Reject Request</h2>
                            <p style={{ color: '#6B7280', fontSize: '14px' }}>
                                Reject portal access for <strong>{fullName}</strong> ({email})
                            </p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                                Reason for Rejection (optional)
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                placeholder="E.g. Cannot verify patient identity. No matching record found."
                                rows={3}
                                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            />
                        </div>

                        {error && (
                            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                style={{ flex: 1, background: 'white', border: '1.5px solid #E5E7EB', color: '#374151', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={rejecting}
                                style={{ flex: 2, background: rejecting ? '#9CA3AF' : '#DC2626', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: rejecting ? 'not-allowed' : 'pointer' }}
                            >
                                {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
