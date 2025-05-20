import { NextResponse } from 'next/server';
import EmailTemplate from '@/components/shared/post-call-webhook-email';
import { render } from '@react-email/render';
import * as React from 'react';

export async function GET() {
  return NextResponse.json({ status: "Email API ready" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    patientName = '',
    phoneNumber = '',
    email = '',
    dateOfBirth = '',
    insuranceProvider = '',
    reasonForVisit = '',
    transcript = '',
  } = body;

  const html = render(
    React.createElement(EmailTemplate, {
      patientName: patientName || '',
      phoneNumber: phoneNumber || '',
      email: email || '',
      dateOfBirth: dateOfBirth || '',
      insuranceProvider: insuranceProvider || '',
      reasonForVisit: reasonForVisit || '',
      transcript: transcript || '',
    })
  );

  // Send the email with HTML (Nodemailer removed)
  // TODO: Switch to Resend SDK as in elevenlabs-webhook route

  return NextResponse.json({ ok: true });
}
