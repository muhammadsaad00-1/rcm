import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
    try {
        const supabase = await createClient();

        // Verify requester is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: adminData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (adminData?.role !== 'admin') {
            return NextResponse.json({ error: 'Only admins can reject portal requests.' }, { status: 403 });
        }

        const { id: requestId } = await params;
        const body = await request.json();
        const { reason } = body;

        // Fetch the request
        const { data: portalRequest, error: reqError } = await supabase
            .from('patient_portal_requests')
            .select('id, status, full_name')
            .eq('id', requestId)
            .single();

        if (reqError || !portalRequest) {
            return NextResponse.json({ error: 'Portal request not found.' }, { status: 404 });
        }

        if (portalRequest.status !== 'pending') {
            return NextResponse.json({ error: `This request has already been ${portalRequest.status}.` }, { status: 409 });
        }

        // Update status to rejected
        const { error: updateError } = await supabase
            .from('patient_portal_requests')
            .update({
                status: 'rejected',
                rejection_reason: reason?.trim() || null,
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id,
            })
            .eq('id', requestId);

        if (updateError) {
            console.error('Rejection update error:', updateError);
            return NextResponse.json({ error: 'Failed to update request status.' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Portal request for ${portalRequest.full_name} has been rejected.`,
        });

    } catch (err) {
        console.error('Reject portal request error:', err);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
