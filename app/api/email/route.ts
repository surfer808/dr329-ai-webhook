import { NextResponse } from 'next/server';
import EmailTemplate from '@/components/email/post-call-webhook-email';
import { render } from '@react-email/render';
import * as React from 'react';

export async function GET() {
  return NextResponse.json({ status: "Email API ready" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    agentId = '',
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
      agentId,
      patientName,
      phoneNumber,
      email,
      dateOfBirth,
      insuranceProvider,
      reasonForVisit,
      transcript,
    })
  );

  // Send the email with HTML (Nodemailer removed)
  // TODO: Switch to Resend SDK as in elevenlabs-webhook route

  return NextResponse.json({ ok: true });
}
