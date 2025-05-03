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

// Helper function to extract data from potentially nested structures
function extractPatientData(data: any) {
  console.log('Trying to extract patient data from:', JSON.stringify(data));
  
  // Case 1: Direct fields in the payload
  if (data.patient_name || data.phone_number) {
    return {
      patient_name: data.patient_name,
      phone_number: data.phone_number,
      email: data.email,
      date_of_birth: data.date_of_birth,
      insurance_provider: data.insurance_provider,
      reason_for_visit: data.reason_for_visit,
      transcript: data.transcript,
    };
  }
  
  // Case 2: Fields in a 'data' property
  if (data.data && typeof data.data === 'object') {
    return extractPatientData(data.data);
  }
  
  // Case 3: Fields in a 'collected_data' property
  if (data.collected_data && typeof data.collected_data === 'object') {
    return extractPatientData(data.collected_data);
  }
  
  // Case 4: Fields in a 'fields' property
  if (data.fields && typeof data.fields === 'object') {
    return extractPatientData(data.fields);
  }
  
  // Case 5: Looking for specific properties that match our expected format
  const possibleProps = Object.keys(data).filter(key => 
    typeof data[key] === 'object' && data[key] !== null
  );
  
  for (const prop of possibleProps) {
    if (data[prop].patient_name || data[prop].phone_number) {
      return extractPatientData(data[prop]);
    }
  }
  
  // Return empty object if nothing found
  return {};
}

export async function POST(req: Request) {
  try {
    // Get the raw request body for HMAC verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-elevenlabs-signature');
    
    // Log the headers and raw payload for debugging
    console.log('Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    console.log('Raw payload:', rawBody.slice(0, 200) + (rawBody.length > 200 ? '...' : ''));
    
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
    
    // Extract patient data from potentially nested structures
    const extractedData = extractPatientData(body);
    console.log('Extracted data:', JSON.stringify(extractedData));
    
    const {
      patient_name,
      phone_number,
      email,
      date_of_birth,
      insurance_provider,
      reason_for_visit,
      transcript,
    } = extractedData;

    // Log the extracted data
    console.log('Final patient data:', {
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
