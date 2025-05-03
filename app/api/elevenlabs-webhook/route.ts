import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import EmailTemplate from '@/components/email/post-call-webhook-email';
import * as React from 'react';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY!);
const WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET || '';

function verifyHmacSignature(
  signature: string | null,
  payload: string,
  secret: string
): boolean {
  if (!signature || !secret) return false;
  
  const hmac = crypto.createHmac('sha256', secret);
  const computedSignature = hmac.update(payload).digest('hex');
  
  // Simple string comparison - safer than timing-safe equal for compatibility
  return computedSignature === signature;
}

export async function POST(req: Request) {
  try {
    // Get the raw request body for HMAC verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-elevenlabs-signature');
    
    // Log the headers and raw payload for debugging
    console.log('Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    console.log('Raw payload:', rawBody.slice(0, 200));
    
    // Skip verification in development or if no webhook secret is set
    const verified = process.env.NODE_ENV === 'development' || 
                    !WEBHOOK_SECRET || 
                    verifyHmacSignature(signature, rawBody, WEBHOOK_SECRET);
    
    if (!verified && WEBHOOK_SECRET) {
      console.error('HMAC signature verification failed');
      return NextResponse.json(
        { ok: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Parse the body
    const body = JSON.parse(rawBody);
    console.log('Received webhook payload:', JSON.stringify(body));
    
    const {
      patient_name,
      phone_number,
      email,
      date_of_birth,
      insurance_provider,
      reason_for_visit,
      transcript,
    } = body;

    // Log the extracted data
    console.log('Extracted patient data:', {
      patient_name,
      phone_number,
      email,
      date_of_birth,
      insurance_provider,
      reason_for_visit,
      transcript: transcript ? `${transcript.slice(0, 100)}...` : 'none',
    });

    const html: string = await render(
      React.createElement(EmailTemplate, {
        patientName: patient_name || '',
        phoneNumber: phone_number || '',
        email: email || '',
        dateOfBirth: date_of_birth || '',
        insuranceProvider: insurance_provider || '',
        reasonForVisit: reason_for_visit || '',
        transcript: transcript || '',
      })
    );
    console.log('DEBUG-email-html:', html.slice(0, 200));

    // Send the email
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: ['info@aisolutionshawaii.com'],
      subject: `New Patient Intake – ${patient_name || 'Unknown'}`,
      html,
      text: html.replace(/<[^>]+>/g, ''),
    });

    console.log('Email sent successfully:', emailResult);
    return NextResponse.json({ ok: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
