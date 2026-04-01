import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import PendingRequestActions from './PendingRequestActions';

export default async function PendingPortalRequestsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (userData?.role !== 'admin') {
        redirect('/dashboard');
    }

    // Fetch all portal requests grouped by status
    const { data: pendingRequests } = await supabase
        .from('patient_portal_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    const { data: recentReviewed } = await supabase
        .from('patient_portal_requests')
        .select('*, users(full_name)')
        .in('status', ['approved', 'rejected'])
        .order('reviewed_at', { ascending: false })
        .limit(10);

    const pendingCount = pendingRequests?.length || 0;
    const approvedCount = recentReviewed?.filter(r => r.status === 'approved').length || 0;
    const rejectedCount = recentReviewed?.filter(r => r.status === 'rejected').length || 0;

    return (
        <DashboardLayout role="admin" userName={userData?.full_name}>
            <div style={{ padding: '32px 40px', maxWidth: '1200px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <Link href="/admin/dashboard" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>Admin</Link>
                            <span style={{ color: '#D1D5DB' }}>›</span>
                            <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>Patient Portal Requests</span>
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B1E3D', margin: 0 }}>Patient Portal Requests</h1>
                        <p style={{ color: '#6B7280', marginTop: '6px' }}>Review and approve patient portal sign-up requests below.</p>
                    </div>
                    <Link href="/portal/signup" target="_blank" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#374151', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                        👁 Preview Signup Form ↗
                    </Link>
                </div>

                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                    <StatCard label="Pending Review" value={pendingCount} color="#D97706" bg="#FFFBEB" border="#FDE68A" icon="⏳" />
                    <StatCard label="Approved (recent)" value={approvedCount} color="#16A34A" bg="#F0FDF4" border="#BBF7D0" icon="✅" />
                    <StatCard label="Rejected (recent)" value={rejectedCount} color="#DC2626" bg="#FEF2F2" border="#FECACA" icon="❌" />
                </div>

                {/* Pending requests table */}
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: '32px' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>⏳ Pending Requests</h2>
                            {pendingCount > 0 && (
                                <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '12px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px' }}>
                                    {pendingCount} awaiting review
                                </span>
                            )}
                        </div>
                    </div>

                    {pendingCount === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
                            <h3 style={{ color: '#6B7280', fontWeight: '600', marginBottom: '8px' }}>All caught up!</h3>
                            <p style={{ fontSize: '14px' }}>No pending patient portal requests. New requests will appear here when patients submit the signup form.</p>
                        </div>
                    ) : (
                        <div>
                            {pendingRequests.map((req, idx) => (
                                <div key={req.id} style={{
                                    padding: '20px 24px',
                                    borderTop: idx === 0 ? 'none' : '1px solid #F3F4F6',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr auto',
                                    gap: '20px',
                                    alignItems: 'start',
                                }}>
                                    {/* Patient info */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#4F46E5' }}>
                                                {req.full_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: '700', fontSize: '15px', color: '#111827', margin: 0 }}>{req.full_name}</p>
                                                <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>{req.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div>
                                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '2px' }}>
                                            🎂 DOB: <strong style={{ color: '#374151' }}>{req.date_of_birth ? new Date(req.date_of_birth).toLocaleDateString('en-US') : '—'}</strong>
                                        </p>
                                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '2px' }}>
                                            📞 {req.phone || 'No phone provided'}
                                        </p>
                                        <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                                            📅 Requested: {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        {req.request_message ? (
                                            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 12px' }}>
                                                <p style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', marginBottom: '4px' }}>PATIENT NOTE:</p>
                                                <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: '1.5' }}>{req.request_message}</p>
                                            </div>
                                        ) : (
                                            <p style={{ color: '#D1D5DB', fontSize: '13px', fontStyle: 'italic' }}>No message provided</p>
                                        )}
                                    </div>

                                    {/* Actions — client component */}
                                    <PendingRequestActions requestId={req.id} email={req.email} fullName={req.full_name} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recently reviewed */}
                {recentReviewed && recentReviewed.length > 0 && (
                    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>📋 Recently Reviewed</h2>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#F9FAFB' }}>
                                    <th style={thStyle}>Patient</th>
                                    <th style={thStyle}>Date of Birth</th>
                                    <th style={thStyle}>Requested</th>
                                    <th style={thStyle}>Reviewed</th>
                                    <th style={thStyle}>Reviewed By</th>
                                    <th style={thStyle}>Decision</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentReviewed.map(req => (
                                    <tr key={req.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                                        <td style={tdStyle}>
                                            <p style={{ fontWeight: '600', margin: 0, color: '#111827' }}>{req.full_name}</p>
                                            <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>{req.email}</p>
                                        </td>
                                        <td style={tdStyle}>{req.date_of_birth ? new Date(req.date_of_birth).toLocaleDateString('en-US') : '—'}</td>
                                        <td style={tdStyle}>{new Date(req.created_at).toLocaleDateString('en-US')}</td>
                                        <td style={tdStyle}>{req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString('en-US') : '—'}</td>
                                        <td style={tdStyle}>{req.users?.full_name || '—'}</td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                background: req.status === 'approved' ? '#F0FDF4' : '#FEF2F2',
                                                color: req.status === 'approved' ? '#16A34A' : '#DC2626',
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                textTransform: 'capitalize',
                                            }}>
                                                {req.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                            </span>
                                            {req.rejection_reason && (
                                                <p style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '4px' }}>Reason: {req.rejection_reason}</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

function StatCard({ label, value, color, bg, border, icon }) {
    return (
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px 24px', borderLeft: `4px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ color, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{label}</p>
                    <p style={{ fontSize: '36px', fontWeight: '800', color, margin: 0, lineHeight: '1' }}>{value}</p>
                </div>
                <span style={{ fontSize: '32px' }}>{icon}</span>
            </div>
        </div>
    );
}

const thStyle = { padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '12px 16px', fontSize: '14px', color: '#374151' };
