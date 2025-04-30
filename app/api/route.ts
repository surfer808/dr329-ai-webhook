import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/shared/post-call-webhook-email';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Handler for GET requests
export async function GET() {
  return NextResponse.json({ ok: true });
}

// Handler for POST requests - centralized email sending
export async function POST(req: NextRequest) {
  try {
    // Send email to user
    console.log('Sending email to info@aisolutionshawaii.com');
    
    // Use the React component directly
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: 'info@aisolutionshawaii.com',
      subject: 'Your Conversational AI agent is ready to chat!',
      react: EmailTemplate({ agentId: '' }), // Pass empty agentId to satisfy the prop requirement
    });
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
  }
}
