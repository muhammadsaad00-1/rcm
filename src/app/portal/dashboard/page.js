import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import FooterSimple from '@/components/FooterSimple';
import KpiCard from '@/components/Dashboard/KpiCard';
import ClaimsTable from '@/components/Dashboard/ClaimsTable';
import InsuranceList from '@/components/Dashboard/InsuranceList';

export default async function PatientDashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/portal/login');
    }

    // Verify this is a portal user (patient), not a staff member
    const { data: portalUser } = await supabase
        .from('patient_portal_users')
        .select('*, patients(first_name, last_name, date_of_birth, phone, email, address, city, state, zip)')
        .eq('id', user.id)
        .single();

    if (!portalUser) {
        // Not a patient portal user — redirect to appropriate login
        redirect('/portal/login');
    }

    // Fetch claims via linked patient record
    let claims = [];
    let payments = [];
    let insurance = [];

    if (portalUser.patient_id) {
        const { data: claimsData } = await supabase
            .from('claims')
            .select('id, claim_number, status, total_charge, service_date, created_at')
            .eq('patient_id', portalUser.patient_id)
            .order('service_date', { ascending: false });

        const { data: paymentsData } = await supabase
            .from('payments')
            .select('id, payment_number, payment_type, amount_paid, payment_date, payer_name')
            .in('claim_id', (claimsData || []).map(c => c.id))
            .order('payment_date', { ascending: false });

        const { data: insuranceData } = await supabase
            .from('patient_insurance')
            .select('*, insurance_companies(company_name, phone)')
            .eq('patient_id', portalUser.patient_id);

        claims = claimsData || [];
        payments = paymentsData || [];
        insurance = insuranceData || [];
    }

    const totalBilled = claims.reduce((sum, c) => sum + parseFloat(c.total_charge || 0), 0);
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);
    const balance = Math.max(0, totalBilled - totalPaid);
    const pendingClaims = claims.filter(c => !['paid', 'denied'].includes(c.status)).length;

    const patientName = portalUser.patients
        ? `${portalUser.patients.first_name} ${portalUser.patients.last_name}`
        : portalUser.full_name;

    return (
        <>
            {/* Top Nav */}
            <nav className="dashboard-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="dn-logo">ClearClaim</span>
                    <span className="dn-badge">PATIENT PORTAL</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>👤 {patientName}</span>
                    <form action="/api/portal/logout" method="POST">
                        <button type="submit" className="btn-dash-logout">
                            Sign Out
                        </button>
                    </form>
                </div>
            </nav>

            <div className="dashboard-layout">
                {/* Welcome Banner */}
                <div className="dash-welcome-banner glass-panel">
                    <h1>
                        Welcome back, {patientName.split(' ')[0]}! 👋
                    </h1>
                    <p>
                        Here&apos;s a summary of your billing account as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                    </p>
                    {!portalUser.patient_id && (
                        <div className="dash-warning">
                            ⚠️ Your portal account has not yet been linked to a patient record. Please contact our billing office so we can connect your account.
                        </div>
                    )}
                </div>

                {/* KPI Cards */}
                <div className="kpi-grid">
                    <KpiCard label="Total Billed" value={`$${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon="📋" color="var(--navy)" />
                    <KpiCard label="Total Paid" value={`$${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon="✅" color="var(--green)" />
                    <KpiCard label="Current Balance" value={`$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon="💳" color={balance > 0 ? 'var(--red)' : 'var(--green)'} highlight={balance > 0} />
                    <KpiCard label="Pending Claims" value={pendingClaims} icon="⏳" color="var(--gold)" />
                </div>

                <div className="dash-main-grid">
                    {/* Claims Table Component */}
                    <div className="dash-anim-up delays-1"><ClaimsTable claims={claims} /></div>

                    {/* Right column */}
                    <div className="dash-side-col dash-anim-up delays-2">
                        {/* Insurance List Component */}
                        <InsuranceList insurance={insurance} />

                        {/* Recent Payments */}
                        <div className="dash-card">
                            <h2 className="dash-card-title">💰 Recent Payments</h2>
                            {payments.length === 0 ? (
                                <p className="dash-card-empty">No payments recorded yet.</p>
                            ) : (
                                payments.slice(0, 5).map(pmt => (
                                    <div key={pmt.id} className="payment-row">
                                        <div>
                                            <p className="payment-name">{pmt.payer_name || pmt.payment_type}</p>
                                            <p className="payment-date">{pmt.payment_date ? new Date(pmt.payment_date).toLocaleDateString('en-US') : '—'}</p>
                                        </div>
                                        <span className="payment-amount">
                                            +${parseFloat(pmt.amount_paid).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Help */}
                        <div className="dash-help-block">
                            <h3>💬 Need Help?</h3>
                            <p>
                                Questions about your bill? Our billing team is ready to help.
                            </p>
                            <Link href="/contact" className="btn-help">
                                Contact Billing Office →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <FooterSimple />
        </>
    );
}
