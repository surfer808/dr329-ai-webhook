// Patient intake email template
import * as React from "react";

interface EmailTemplateProps {
  patientName?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  insuranceProvider?: string;
  reasonForVisit?: string;
  transcript?: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  patientName,
  phoneNumber,
  email,
  dateOfBirth,
  insuranceProvider,
  reasonForVisit,
  transcript,
}) => (
  <html>
    <body>
      <h1>New Patient Intake</h1>
      <p><strong>Name:</strong> {patientName}</p>
      <p><strong>Phone:</strong> {phoneNumber}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Date of Birth:</strong> {dateOfBirth}</p>
      <p><strong>Insurance:</strong> {insuranceProvider}</p>
      <p><strong>Reason for Visit:</strong> {reasonForVisit}</p>
      <hr />
      <h2>Transcript</h2>
      <pre>{transcript}</pre>
    </body>
  </html>
);

export default EmailTemplate; 