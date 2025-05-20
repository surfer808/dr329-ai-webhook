import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import EmailTemplate from '../../../components/shared/post-call-webhook-email';
import * as React from 'react';
import crypto from 'crypto';

/* ------------------------------------------------------------------ */
/*  CONFIG                                                            */
/* ------------------------------------------------------------------ */
const resend = new Resend(process.env.RESEND_API_KEY!);
const WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET || '';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */
// ‑‑ Verify ElevenLabs HMAC
function verifyHmac(signature: string | null, payload: string): boolean {
  if (!signature || !WEBHOOK_SECRET) return false;
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  return digest === signature;
}

// helper – turn anything into a printable string
function toString(x: unknown): string {
  if (x === null || x === undefined) return '';
  if (typeof x === 'object') {
    // ElevenLabs "data_collection" objects all have { value: ... }
    const maybeVal = (x as Record<string, any>).value;
    if (typeof maybeVal === 'string' || typeof maybeVal === 'number') {
      return String(maybeVal);
    }
  }
  return String(x);
}

// ‑‑ Walk an arbitrary object and pull out the fields we care about
function extractPatientData(obj: any): {
  patient_name?: string;
  phone_number?: string;
  email?: string;
  date_of_birth?: string;
  insurance_provider?: string;
  reason_for_visit?: string;
  transcript?: string;
} {
  if (!obj || typeof obj !== 'object') return {};

  // 1 – direct keys
  if (obj.patient_name || obj.phone_number) {
    return {
      patient_name: obj.patient_name,
      phone_number: obj.phone_number,
      email: obj.email,
      date_of_birth: obj.date_of_birth,
      insurance_provider: obj.insurance_provider,
      reason_for_visit: obj.reason_for_visit,
      transcript: obj.transcript,
    };
  }

  // 2 – ElevenLabs "results[0].items[0].collected_data"
  if (Array.isArray(obj.results) && obj.results[0]?.items?.[0]?.collected_data) {
    return extractPatientData(obj.results[0].items[0].collected_data);
  }

  // 3 – nested helpers
  for (const key of [
    'data',
    'fields',
    'collected_data',
    ...Object.keys(obj).filter(k => typeof obj[k] === 'object'),
  ]) {
    if (obj[key]) {
      const found = extractPatientData(obj[key]);
      if (Object.keys(found).length) return found;
    }
  }

  return {};
}

/* ------------------------------------------------------------------ */
/*  ROUTE                                                             */
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
    const safeProps = {
      patientName      : toString(patient.patient_name),
      phoneNumber      : toString(patient.phone_number),
      email            : toString(patient.email),
      dateOfBirth      : toString(patient.date_of_birth),
      insuranceProvider: toString(patient.insurance_provider),
      reasonForVisit   : toString(patient.reason_for_visit),
      transcript       : toString(patient.transcript),
    };

    const emailElement = React.createElement(EmailTemplate, safeProps);
    const htmlContent = await render(emailElement);

    /* -------- send via Resend ------------------ */
    const res = await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL!,
      to:      ['marketing@dr329.com'],
      subject: `New Patient Intake – ${patient.patient_name || 'Unknown'}`,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]+>/g, ''),
    });

    console.log('✅  Email sent:', res.data?.id);
    return NextResponse.json({ status: "success" });

  } catch (err) {
    console.error('🛑  Webhook error:', err);
    return NextResponse.json({ status: "error", message: 'Internal server error' }, { status: 500 });
  }
}
