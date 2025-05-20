import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

export interface IntakeEmailProps {
  patientName?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  insuranceProvider?: string;
  reasonForVisit?: string;
  transcript?: string;
}

const EmailTemplate = ({
  patientName = '',
  phoneNumber = '',
  email = '',
  dateOfBirth = '',
  insuranceProvider = '',
  reasonForVisit = '',
  transcript = '',
}: IntakeEmailProps) => (
  <Html>
    <Head />
    <Preview>New patient intake received</Preview>

    <Tailwind>
      <Body className="bg-[#f4f4f5] font-sans py-[40px]">
        <Container className="mx-auto bg-white rounded-[8px] p-[24px] max-w-[600px]">
          <Heading>New Patient Intake</Heading>
          <Text><b>Name:</b> {patientName}</Text>
          <Text><b>Phone:</b> {phoneNumber}</Text>
          <Text><b>Email:</b> {email}</Text>
          <Text><b>Date of Birth:</b> {dateOfBirth}</Text>
          <Text><b>Insurance:</b> {insuranceProvider}</Text>
          <Text><b>Reason:</b> {reasonForVisit}</Text>

          {transcript && (
            <>
              <Text className="mt-[24px] font-semibold">Transcript</Text>
              <pre className="whitespace-pre-wrap">{transcript}</pre>
            </>
          )}

          {/* Footer */}
          <Section className="mt-[32px] text-center text-[#666] text-[12px] leading-[16px]">
            <Text className="m-0">
              © {new Date().getFullYear()} <strong>Medical Marijuana Hawaii</strong>. All rights reserved.
            </Text>

            <Text className="m-0">123 Medical Cannabis Blvd, Honolulu, HI 96815</Text>
            <Text className="m-0">
              <a
                href="https://dr329.com/unsubscribe"
                className="text-[#666] underline"
              >
                Unsubscribe
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailTemplate;
