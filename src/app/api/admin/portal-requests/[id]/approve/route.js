import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
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
            .select('role, full_name')
            .eq('id', user.id)
            .single();

        if (adminData?.role !== 'admin') {
            return NextResponse.json({ error: 'Only admins can approve portal requests.' }, { status: 403 });
        }

        const { id: requestId } = await params;
        const body = await request.json();
        const { temporaryPassword } = body;

        if (!temporaryPassword || temporaryPassword.length < 8) {
            return NextResponse.json({ error: 'A temporary password of at least 8 characters is required.' }, { status: 400 });
        }

        // Fetch the pending request
        const { data: portalRequest, error: reqError } = await supabase
            .from('patient_portal_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (reqError || !portalRequest) {
            return NextResponse.json({ error: 'Portal request not found.' }, { status: 404 });
        }

        if (portalRequest.status !== 'pending') {
            return NextResponse.json({ error: `This request has already been ${portalRequest.status}.` }, { status: 409 });
        }

        // Use service role key if available (required for creating auth users from server)
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey) {
            return NextResponse.json(
                { error: 'SUPABASE_SERVICE_ROLE_KEY is not configured. Please add it to .env.local to enable portal approvals. See patient-portal-schema.sql for instructions.' },
                { status: 500 }
            );
        }

        const adminClient = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            serviceRoleKey
        );

        // Create the Supabase auth user for the patient
        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
            email: portalRequest.email,
            password: temporaryPassword,
            email_confirm: true,    // No email confirmation required
            user_metadata: {
                full_name: portalRequest.full_name,
                portal_user: true,
            },
        });

        if (authError) {
            // If user already exists in auth, handle gracefully
            if (authError.message.includes('already') || authError.message.includes('exists')) {
                return NextResponse.json(
                    { error: 'A login account for this email already exists. The patient may need to reset their password.' },
                    { status: 409 }
                );
            }
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        const newAuthUserId = authData.user.id;

        // Try to find a matching patient record by email
        const { data: matchedPatient } = await supabase
            .from('patients')
            .select('id')
            .eq('email', portalRequest.email)
            .maybeSingle();

        // Create the patient_portal_users record
        const { error: portalUserError } = await adminClient
            .from('patient_portal_users')
            .insert({
                id: newAuthUserId,
                email: portalRequest.email,
                full_name: portalRequest.full_name,
                date_of_birth: portalRequest.date_of_birth,
                phone: portalRequest.phone,
                patient_id: matchedPatient?.id || null,
                request_id: requestId,
                is_active: true,
            });

        if (portalUserError) {
            // Roll back: delete the auth user we just created
            await adminClient.auth.admin.deleteUser(newAuthUserId);
            console.error('Portal user insert error:', portalUserError);
            return NextResponse.json({ error: 'Failed to create portal user profile.' }, { status: 500 });
        }

        // Mark the request as approved
        const { error: updateError } = await supabase
            .from('patient_portal_requests')
            .update({
                status: 'approved',
                portal_user_id: newAuthUserId,
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id,
            })
            .eq('id', requestId);

        if (updateError) {
            console.error('Request status update error:', updateError);
            // Non-fatal — user is already created
        }

        return NextResponse.json({
            success: true,
            message: `Portal access approved for ${portalRequest.full_name}. Share the temporary password with them directly.`,
            patientLinked: !!matchedPatient,
        });

    } catch (err) {
        console.error('Approve portal request error:', err);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
