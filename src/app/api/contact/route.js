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

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "853dfd10-7eda-431a-86e3-78d0051d53da";

    const web3formsPayload = {
      access_key: accessKey,
      subject: `New Practice Audit Request - ${payload.practiceName}`,
      from_name: `${payload.firstName} ${payload.lastName}`,
      name: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      phone: payload.phone,
      practice_name: payload.practiceName,
      specialty: payload.specialty || 'N/A',
      providers: payload.providers || 'N/A',
      ehr: payload.ehr || 'N/A',
      challenge: payload.challenge || 'N/A'
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(web3formsPayload)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.message || 'Email submission failed.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: data.message });

  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { success: false, error: 'Unexpected error while sending request.' },
      { status: 500 }
    );
  }
}
