import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email/post-call-webhook-email';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const body = await req.json();

  // Adjust these field names to match ElevenLabs payload
  const agentId    = body.agentId ?? 'unknown-agent';
  // The current template only accepts agentId, so we pass that

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,          // e.g. "info@aisolutionshawaii.com"
    to:   ['info@aisolutionshawaii.com'],
    subject: 'New patient intake received',
    react: <EmailTemplate agentId={agentId} />, 
  });

  return NextResponse.json({ ok: true });
}
