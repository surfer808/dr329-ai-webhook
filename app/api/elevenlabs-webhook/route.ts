import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import EmailTemplate from '@/components/email/post-call-webhook-email';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const body = await req.json();
  const {
    patient_name,
    phone_number,
    email,
    date_of_birth,
    insurance_provider,
    reason_for_visit,
    transcript,
  } = body;

  const html = render(
    React.createElement(EmailTemplate, {
      agentId: process.env.ELEVENLABS_AGENT_ID || '',
      patientName: patient_name || '',
      phoneNumber: phone_number || '',
      email: email || '',
      dateOfBirth: date_of_birth || '',
      insuranceProvider: insurance_provider || '',
      reasonForVisit: reason_for_visit || '',
      transcript: transcript || '',
    })
  );
  console.log('DEBUG-email-html:', typeof html === 'string' ? html.slice(0, 200) : html);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: ['info@aisolutionshawaii.com'],
    subject: `New Patient Intake – ${patient_name}`,
    html: typeof html === 'string' ? html : '',
    text: typeof html === 'string' ? html.replace(/<[^>]+>/g, '') : '',
  });

  return NextResponse.json({ ok: true });
}
