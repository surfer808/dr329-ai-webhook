import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import EmailTemplate from '@/components/email/post-call-webhook-email';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const body = await req.json();
  // Extract patient data – adjust keys if ElevenLabs uses different names
  const patient = {
    firstName: body.firstName ?? '',
    lastName: body.lastName ?? '',
    dob: body.dob ?? '',
    phone: body.phone ?? '',
    email: body.email ?? '',
    insurance: body.insurance ?? '',
    reason: body.reason ?? '',
    transcript: body.transcript ?? '',
  };

  // Render HTML using React.createElement to avoid JSX linter/type issues
  const html = await render(React.createElement(EmailTemplate, patient));
  console.log('DEBUG-email-html:', typeof html === 'string' ? html.slice(0, 200) : html);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: ['info@aisolutionshawaii.com'],
    subject: `New Patient Intake – ${patient.firstName} ${patient.lastName}`,
    html: typeof html === 'string' ? html : '',
    text: typeof html === 'string' ? html.replace(/<[^>]+>/g, '') : '', // optional plain-text fallback
  });

  return NextResponse.json({ ok: true });
}
