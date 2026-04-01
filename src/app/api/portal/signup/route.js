import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { fullName, email, dateOfBirth, phone, address, requestMessage } = body;

        // Validate required fields
        if (!fullName?.trim() || !email?.trim() || !dateOfBirth) {
            return NextResponse.json(
                { error: 'Full name, email, and date of birth are required.' },
                { status: 400 }
            );
        }

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
        }

        const supabase = await createClient();

        // Check for an existing pending or approved request with this email
        const { data: existing } = await supabase
            .from('patient_portal_requests')
            .select('id, status')
            .eq('email', email.toLowerCase().trim())
            .in('status', ['pending', 'approved'])
            .maybeSingle();

        if (existing) {
            if (existing.status === 'approved') {
                return NextResponse.json(
                    { error: 'A portal account for this email is already approved. Please log in at /portal/login.' },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: 'A pending request for this email already exists. Please wait for admin review.' },
                { status: 409 }
            );
        }

        // Insert the portal request
        const { error: insertError } = await supabase
            .from('patient_portal_requests')
            .insert({
                full_name: fullName.trim(),
                email: email.toLowerCase().trim(),
                date_of_birth: dateOfBirth,
                phone: phone?.trim() || null,
                address: address?.trim() || null,
                request_message: requestMessage?.trim() || null,
                status: 'pending',
            });

        if (insertError) {
            console.error('Portal signup insert error:', insertError);
            return NextResponse.json(
                { error: 'Failed to submit your request. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Your request has been submitted and is pending admin review.' });

    } catch (err) {
        console.error('Portal signup error:', err);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
