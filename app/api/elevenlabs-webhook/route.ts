import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import EmailTemplate from '@/components/email/post-call-webhook-email';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
