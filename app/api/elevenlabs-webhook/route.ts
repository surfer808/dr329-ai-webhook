import { NextResponse } from 'next/server';
import * as ReactDOMServer from 'react-dom/server';
import { EmailTemplate } from '@/app/components/shared/post-call-webhook-email';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    // Parse the request body for transcript and recipient
    const body = await req.json();
    const { transcript, to } = body;

    // Render the React component to HTML string using ReactDOMServer
    const emailComponent = EmailTemplate({ transcript });
    const emailHtml = ReactDOMServer.renderToString(emailComponent);
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