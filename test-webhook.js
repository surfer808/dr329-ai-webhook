// Test script to send data to the webhook endpoint
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testWebhook() {
  const webhookUrl = 'https://my-conversational-agent-rho.vercel.app/api/elevenlabs-webhook';
  
  // Sample test data
  const testData = {
    patient_name: 'John Doe',
    phone_number: '808-555-1234',
    email: 'test@example.com',
    date_of_birth: '01/01/1980',
    insurance_provider: 'Hawaii Medical Service Association',
    reason_for_visit: 'Annual eye exam',
    transcript: 'This is a test transcript from the conversation with the patient.'
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    console.log('Response:', data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testWebhook(); 