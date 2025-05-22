// Start of code for components/shared/post-call-webhook-email.tsx

// Patient intake email template
import * as React from "react";
// Import necessary components from @react-email/components for proper rendering
import { Html, Head, Body, Container, Text, Section, Hr } from '@react-email/components';

// This interface defines the structure of the props that the EmailTemplate component expects.
// These names MUST match the camelCase keys in the 'emailProps' object in route.ts.
interface EmailTemplateProps {
  patientName?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  transcript?: string;
  // All other fields from ElevenLabs Data Collection, mapped to camelCase
  medicalDocumentationSupplied?: string;
  cannabisHelping?: string;
  sideEffects?: string;
  questionsForDoctor?: string;
  medicalConditionRenewal?: string;
  currentMedications?: string;
  conditionStartDate?: string;
}

// The React Functional Component (FC) receives the props defined above.
const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  patientName,
  phoneNumber,
  email,
  dateOfBirth,
  transcript,
  // Destructure new props
  medicalDocumentationSupplied,
  cannabisHelping,
  sideEffects,
  questionsForDoctor,
  medicalConditionRenewal,
  currentMedications,
  conditionStartDate,
}) => (
  // Use Html, Head, Body, etc. from @react-email/components for best compatibility
  <Html>
    <Head />
    <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#ffffff', margin: 'auto', padding: '20px' }}>
      <Container style={{ border: '1px solid #eaeaea', borderRadius: '5px', margin: '40px auto', padding: '20px', maxWidth: '600px' }}>
        <Text style={{ fontSize: '24px', fontWeight: 'normal', textAlign: 'center', margin: '30px 0' }}>
          New Patient Intake
        </Text>

        {/* Core Patient Information */}
        <Section>
          <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
            <strong>Name:</strong> {patientName || 'N/A'}
          </Text>
          <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
            <strong>Phone:</strong> {phoneNumber || 'N/A'}
          </Text>
          <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
            <strong>Email:</strong> {email || 'N/A'}
          </Text>
          <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
            <strong>Date of Birth:</strong> {dateOfBirth || 'N/A'}
          </Text>
        </Section>

        <Hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '26px 0' }} />

        {/* Additional Details from ElevenLabs Data Collection */}
        <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          Medical & Intake Details
        </Text>
        <Section>
          {medicalConditionRenewal && (
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Medical Condition (Renewal):</strong> {medicalConditionRenewal}
            </Text>
          )}
          {conditionStartDate && (
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Condition Start Date:</strong> {conditionStartDate}
            </Text>
          )}
          {currentMedications && (
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Current Medications:</strong> {currentMedications}
            </Text>
          )}
          {medicalDocumentationSupplied && (
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Medical Documents Supplied:</strong> {medicalDocumentationSupplied}
            </Text>
          )}
          {cannabisHelping && (
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Is Medical Cannabis Helping:</strong> {cannabisHelping}
            </Text>
          )}
          {sideEffects && (
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Side Effects:</strong> {sideEffects}
            </Text>
          )}
          {questionsForDoctor && (
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Questions for Doctor:</strong> {questionsForDoctor}
            </Text>
          )}
        </Section>

        <Hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '26px 0' }} />

        {/* Call Transcript */}
        <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          Transcript
        </Text>
        <Text style={{ fontSize: '14px', lineHeight: '20px', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
          {transcript || 'No transcript available.'}
        </Text>
      </Container>
    </Body>
  </Html>
);

export default EmailTemplate;

// End of code for components/shared/post-call-webhook-email.tsx