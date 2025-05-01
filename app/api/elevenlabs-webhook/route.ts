import { NextResponse } from 'next/server';
import { EmailTemplate } from '@/components/email/post-call-webhook-email';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    // Parse the request body for agentId and recipient
    const body = await req.json();
    const { agentId, to } = body;

    // Use the JSX directly
    const emailHtml = `<html>${EmailTemplate({ agentId })}</html>`;
    console.log('Email HTML generated with length:', emailHtml.length);

    // Set up Nodemailer SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.resend.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'resend',
        pass: process.env.SMTP_PASS || process.env.RESEND_API_KEY,
      },
    });

    // Send the email with HTML
    const info = await transporter.sendMail({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: to || 'info@aisolutionshawaii.com',
      subject: 'Your Conversational AI Agent is Ready!',
      html: emailHtml,
    });

    console.log('Email sent successfully:', info);
    return NextResponse.json({ success: true, info });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
} 