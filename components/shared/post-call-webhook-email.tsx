// Patient intake email template
import * as React from "react";
import { Html, Head, Body, Container, Text, Section, Hr } from '@react-email/components';

interface EmailTemplateProps {
  patientName?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  transcript?: string;
  // All data collection fields from ElevenLabs
  patientType?: string;
  returningPatient?: string;
  medicalCondition?: string;
  medicalDocumentationSupplied?: string;
  medicalDocumentsSent?: string;
  painAssessmentNeeded?: string;
  cannabisHelping?: string;
  sideEffects?: string;
  questionsForDoctor?: string;
  medicalConditionRenewal?: string;
  currentMedications?: string;
  conditionStartDate?: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  patientName,
  phoneNumber,
  email,
  dateOfBirth,
  transcript,
  patientType,
  returningPatient,
  medicalCondition,
  medicalDocumentationSupplied,
  medicalDocumentsSent,
  painAssessmentNeeded,
  cannabisHelping,
  sideEffects,
  questionsForDoctor,
  medicalConditionRenewal,
  currentMedications,
  conditionStartDate,
}) => {
  // Helper function to format email addresses
  const formatEmail = (emailStr?: string) => {
    if (!emailStr) return 'N/A';
    // Replace common transcription errors
    return emailStr
      .replace(/ at /gi, '@')
      .replace(/ dot /gi, '.')
      .replace(/\s/g, '')
      .toLowerCase();
  };

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#ffffff', margin: 'auto', padding: '20px' }}>
        <Container style={{ border: '1px solid #eaeaea', borderRadius: '5px', margin: '40px auto', padding: '20px', maxWidth: '600px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'normal', textAlign: 'center', margin: '30px 0' }}>
            {patientType === 'renewal' ? 'Patient Renewal Intake' : 'New Patient Intake'}
          </Text>

          {/* Core Patient Information */}
          <Section>
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Patient Type:</strong> {patientType || 'N/A'} {returningPatient && `(Returning: ${returningPatient})`}
            </Text>
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Name:</strong> {patientName || 'N/A'}
            </Text>
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Phone:</strong> {phoneNumber || 'N/A'}
            </Text>
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Email:</strong> {formatEmail(email)}
            </Text>
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Date of Birth:</strong> {dateOfBirth || 'N/A'}
            </Text>
          </Section>

          <Hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '26px 0' }} />

          {/* Medical Information */}
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            Medical Information
          </Text>
          <Section>
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Medical Condition:</strong> {medicalCondition || medicalConditionRenewal || 'N/A'}
            </Text>
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
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Medical Documentation Supplied:</strong> {medicalDocumentationSupplied || 'N/A'}
            </Text>
            <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333' }}>
              <strong>Medical Documents Sent to Us:</strong> {medicalDocumentsSent || 'N/A'}
            </Text>
            {painAssessmentNeeded && (
              <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333', backgroundColor: painAssessmentNeeded === 'yes' ? '#fff3cd' : 'transparent', padding: painAssessmentNeeded === 'yes' ? '5px' : '0', borderRadius: '4px' }}>
                <strong>Pain Assessment Form Needed:</strong> {painAssessmentNeeded}
              </Text>
            )}
          </Section>

          {/* Renewal-specific Information */}
          {(cannabisHelping || sideEffects) && (
            <>
              <Hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '26px 0' }} />
              <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                Renewal Information
              </Text>
              <Section>
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
              </Section>
            </>
          )}

          {/* Questions for Doctor */}
          {questionsForDoctor && (
            <>
              <Hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '26px 0' }} />
              <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                Questions for Doctor
              </Text>
              <Text style={{ fontSize: '14px', lineHeight: '24px', color: '#333', backgroundColor: '#e8f4f8', padding: '10px', borderRadius: '4px' }}>
                {questionsForDoctor}
              </Text>
            </>
          )}

          <Hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '26px 0' }} />

          {/* Call Transcript */}
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            Full Conversation Transcript
          </Text>
          <Text style={{ fontSize: '14px', lineHeight: '20px', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
            {transcript || 'No transcript available.'}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailTemplate;