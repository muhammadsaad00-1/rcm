import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const payload = await request.json();

    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'practiceName'];
    const missingField = requiredFields.find((field) => !payload?.[field]);

    if (missingField) {
      return NextResponse.json(
        { success: false, error: `Missing required field: ${missingField}` },
        { status: 400 }
      );
    }

    const accessKey = process.env.SNAPITFORMS_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: missing SnapItForms key.' },
        { status: 500 }
      );
    }

    const submitUrl = process.env.SNAPITFORMS_SUBMIT_URL || 'https://api.snapitforms.com/submit';

    const snapitPayload = {
      access_key: accessKey,
      name: `${payload.firstName} ${payload.lastName}`.trim(),
      email: payload.email,
      message: `Practice Name: ${payload.practiceName}\nPhone: ${payload.phone}\nSpecialty: ${payload.specialty || 'N/A'}\nProviders: ${payload.providers || 'N/A'}\nEHR: ${payload.ehr || 'N/A'}\nChallenge: ${payload.challenge || 'N/A'}`,
      ...payload
    };

    const snapitResponse = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(snapitPayload)
    });

    const snapitData = await snapitResponse.json().catch(() => ({}));

    if (!snapitResponse.ok || !snapitData?.success) {
      return NextResponse.json(
        { success: false, error: snapitData?.error || 'Email submission failed.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, usage: snapitData.usage || null });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unexpected error while sending request.' },
      { status: 500 }
    );
  }
}
