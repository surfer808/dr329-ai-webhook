import { NextResponse } from 'next/server';
import { EmailTemplate } from '@/components/email/post-call-webhook-email';

export async function GET() {
  return NextResponse.json({ status: "Email API ready" });
}

export async function POST(req: Request) {
  try {
    // Parse the request body for agentId and recipient
    const body = await req.json();
    const { agentId, to } = body;

    // Use the JSX directly
    const emailHtml = `<html>${EmailTemplate({ agentId })}</html>`;
    console.log('Email HTML generated with length:', emailHtml.length);

    // Send the email with HTML (Nodemailer removed)
    // TODO: Switch to Resend SDK as in elevenlabs-webhook route

    return NextResponse.json({ success: true, info: 'Nodemailer removed, switch to Resend SDK' });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
  }
}
