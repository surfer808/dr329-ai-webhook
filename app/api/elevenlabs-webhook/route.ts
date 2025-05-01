import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import EmailTemplate from '@/components/email/post-call-webhook-email';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const body = await req.json();

  // Extract all relevant fields
  const {
    agentId = 'unknown-agent',
    name = '',
    phone = '',
    email = '',
    dob = '',
    insurance = '',
    reason = '',
    transcript = '',
  } = body;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: ['info@aisolutionshawaii.com'],
    subject: 'New patient intake received',
    react: (
      <EmailTemplate
        agentId={agentId}
        name={name}
        phone={phone}
        email={email}
        dob={dob}
        insurance={insurance}
        reason={reason}
        transcript={transcript}
      />
    ),
  });

  return NextResponse.json({ ok: true });
}
