// Start of code for app/api/elevenlabs-webhook/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import EmailTemplate from '../../../components/shared/post-call-webhook-email'; // This path should be correct for app/api/elevenlabs-webhook/route.ts
import * as React from 'react';
import crypto from 'crypto';

/* ------------------------------------------------------------------ */
/* CONFIG                                                            */
/* ------------------------------------------------------------------ */
const resend = new Resend(process.env.RESEND_API_KEY!);
const WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET || '';

/* ------------------------------------------------------------------ */
/* HELPERS                                                           */
/* ------------------------------------------------------------------ */
// ‑‑ Verify ElevenLabs HMAC
function verifyHmac(signature: string | null, payload: string): boolean {
  if (!signature || !WEBHOOK_SECRET) return false;
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  return digest === signature;
}

// ‑‑ Walk an arbitrary object and pull out the fields we care about
// This function is updated to extract ALL fields from ElevenLabs data collection
function extractPatientData(obj: any): {
  patient_name?: string;
  phone_number?: string;
  email?: string;
  date_of_birth?: string;
  transcript?: string;
  medical_documentation_supplied?: string;
  cannabis_helping?: string;
  side_effects?: string;
  questions_for_doctor?: string;
  medical_condition_renewal?: string;
  current_medications?: string;
  condition_start_date?: string;
} {
  if (!obj || typeof obj !== 'object') return {};

  // Helper to safely get a string value, handling nested 'value' properties
  // and converting to string. Placed here for encapsulation.
  const toString = (x: unknown): string | undefined => {
    if (x === null || x === undefined) return undefined;
    if (typeof x === 'object' && (x as Record<string, any>).value !== undefined) {
      return String((x as Record<string, any>).value);
    }
    return String(x);
  };

  const extracted: ReturnType<typeof extractPatientData> = {};

  // Direct keys (or 'value' wrapped) from the current object
  extracted.patient_name = toString(obj.patient_name);
  extracted.phone_number = toString(obj.phone_number);
  extracted.email = toString(obj.email);
  extracted.date_of_birth = toString(obj.date_of_birth);
  extracted.transcript = toString(obj.transcript);

  // All other fields from ElevenLabs Data Collection (snake_case from webhook payload)
  extracted.medical_documentation_supplied = toString(obj.medical_documentation_supplied);
  extracted.cannabis_helping = toString(obj.cannabis_helping);
  extracted.side_effects = toString(obj.side_effects);
  extracted.questions_for_doctor = toString(obj.questions_for_doctor);
  extracted.medical_condition_renewal = toString(obj.medical_condition_renewal);
  extracted.current_medications = toString(obj.current_medications);
  extracted.condition_start_date = toString(obj.condition_start_date);


  // 2 – ElevenLabs "results[0].items[0].collected_data" (recursive call for nested data)
  if (Array.isArray(obj.results) && obj.results[0]?.items?.[0]?.collected_data) {
    const nestedData = extractPatientData(obj.results[0].items[0].collected_data);
    // Merge nested data, giving precedence to values from deeper nesting if they exist
    Object.assign(extracted, nestedData);
  }

  // 3 – nested helpers (recursive call for other nested objects)
  for (const key of [
    'data',
    'fields',
    'collected_data',
    ...Object.keys(obj).filter(k => typeof obj[k] === 'object' && k !== 'results'), // Exclude 'results' to prevent infinite recursion
  ]) {
    if (obj[key]) {
      const found = extractPatientData(obj[key]);
      if (Object.keys(found).length) {
        Object.assign(extracted, found); // Merge found data
      }
    }
  }

  // Filter out undefined values before returning to ensure clean object
  const finalExtracted: ReturnType<typeof extractPatientData> = {};
  for (const key in extracted) {
    if (extracted[key as keyof typeof extracted] !== undefined) {
      finalExtracted[key as keyof typeof finalExtracted] = extracted[key as keyof typeof extracted];
    }
  }

  return finalExtracted;
}

/* ------------------------------------------------------------------ */
/* ROUTE                                                             */
/* ------------------------------------------------------------------ */
export async function POST(req: Request) {
  try {
    /* -------- raw body for signature ---------- */
    const raw = await req.text();
    const sig = req.headers.get('x-elevenlabs-signature');

    // Log incoming payload for debugging
    console.log('📝 Incoming webhook payload:', raw);

    const dev = process.env.NODE_ENV === 'development';
    const verified = dev || !WEBHOOK_SECRET || verifyHmac(sig, raw);

    if (!verified) {
      console.error('❌  HMAC verification failed');
      return NextResponse.json({ status: "error", message: 'Invalid signature' }, { status: 401 });
    }

    /* -------- parse + extract data ------------ */
    const payload = JSON.parse(raw);
    const patient = extractPatientData(payload);

    if (Object.keys(patient).length === 0) {
      console.error('❌ No patient data found in payload');
      return NextResponse.json(
        { status: "error", message: 'No patient data found in payload' },
        { status: 400 },
      );
    }

    /* -------- render e‑mail ------------------- */
    // Map extracted snake_case data to camelCase props for the EmailTemplate
    const emailProps = {
      patientName: patient.patient_name,
      phoneNumber: patient.phone_number,
      email: patient.email,
      dateOfBirth: patient.date_of_birth,
      transcript: patient.transcript,
      // All other fields from ElevenLabs Data Collection, mapped to camelCase
      medicalDocumentationSupplied: patient.medical_documentation_supplied,
      cannabisHelping: patient.cannabis_helping,
      sideEffects: patient.side_effects,
      questionsForDoctor: patient.questions_for_doctor,
      medicalConditionRenewal: patient.medical_condition_renewal,
      currentMedications: patient.current_medications,
      conditionStartDate: patient.condition_start_date,
    };

    const emailElement = React.createElement(EmailTemplate, emailProps);
    const htmlContent = await render(emailElement);

    /* -------- send via Resend ------------------ */
    const res = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: ['marketing@dr329.com'],
      subject: `New Patient Intake – ${patient.patient_name || 'Unknown'}`,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]+>/g, ''), // Simple text fallback
    });

    console.log('✅  Email sent:', res.data?.id);
    return NextResponse.json({ status: "success" });

  } catch (err) {
    console.error('🛑  Webhook error:', err);
    return NextResponse.json({ status: "error", message: 'Internal server error' }, { status: 500 });
  }
}

// End of code for app/api/elevenlabs-webhook/route.ts