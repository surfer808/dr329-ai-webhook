import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

// Define a proper interface for the component props
interface EmailTemplateProps {
  agentId?: string;
  name?: string;
  phone?: string;
  email?: string;
  dob?: string;
  insurance?: string;
  reason?: string;
  transcript?: any;
}

const EmailTemplate = ({
  agentId, name, phone, email, dob, insurance, reason, transcript,
}: EmailTemplateProps) => {
  // The agentId might be used for tracking or customization in the future
  // Currently not used but required by API route
  return (
    <Html>
      <Head />
      <Preview>New patient intake received</Preview>
      <Tailwind>
        <Body className="bg-[#f4f4f5] font-sans py-[40px]">
          <Container className="mx-auto bg-white rounded-[8px] p-[20px] max-w-[600px]">
            <Heading>New Patient Intake</Heading>
            <Text><b>Agent ID:</b> {agentId}</Text>
            <Text><b>Name:</b> {name}</Text>
            <Text><b>Phone:</b> {phone}</Text>
            <Text><b>Email:</b> {email}</Text>
            <Text><b>Date of Birth:</b> {dob}</Text>
            <Text><b>Insurance:</b> {insurance}</Text>
            <Text><b>Reason:</b> {reason}</Text>
            <Text><b>Transcript:</b> {typeof transcript === 'object' ? JSON.stringify(transcript, null, 2) : transcript}</Text>

            {/* Main Content Area */}
            <Section className="bg-[#003366] rounded-[8px] p-[24px] mt-[24px]">
              {/* Circle Checkmark Icon */}
              <div className="mx-auto text-center mb-[16px]">
                <div 
                  className="inline-block rounded-full w-[64px] h-[64px] bg-gradient-to-b from-[#66B2FF] to-[#003366] flex items-center justify-center"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div 
                    className="text-white text-[32px] font-bold"
                    style={{
                      lineHeight: '1',
                    }}
                  >
                    ✓
                  </div>
                </div>
              </div>

              {/* Descriptive Text */}
              <Text className="text-white text-center text-[16px] mb-[16px]">
                Mahalo for signing up with Eye Doctor&apos;s Hawaii. I&apos;m Aunty Ai. I will help you complete your form by voice.
              </Text>
              
              {/* Bold separate instruction */}
              <Text className="text-white text-center text-[16px] font-bold mb-[24px]">
                Click below to begin your application.
              </Text>

              {/* CTA Button */}
              <div className="text-center">
                <Button
                  href={`https://aisolutionshawaii.com/aloha-intake${agentId ? `?agentId=${agentId}` : ''}`}
                  className="bg-[#0099FF] text-white px-[24px] py-[12px] rounded-[4px] font-medium no-underline text-[16px] box-border"
                >
                  Start Your Application
                </Button>
              </div>
            </Section>

            {/* Footer */}
            <Section className="mt-[32px] text-center text-[#666666] text-[12px]">
              <Text className="m-0">
                © {new Date().getFullYear()} Eye Doctor&apos;s Hawaii. All rights reserved.
              </Text>
              <Text className="m-0">
                123 Eye Care Boulevard, Honolulu, HI 96815
              </Text>
              <Text className="m-0">
                <a href="https://eyedoctorshawaii.com/unsubscribe" className="text-[#666666]">
                  Unsubscribe
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export { EmailTemplate };
export default EmailTemplate; 