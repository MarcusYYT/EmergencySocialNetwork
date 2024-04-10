import Mailgun from 'mailgun-js';

// Mailgun configuration
// move to github secret later
const mailgunApiKey = '8f6db5dd8cd6980f6e993af986a9019d-4b670513-7293ebc5';
const mailgunDomain = 'mg.depasinre.xyz';
const mailgun = new Mailgun({ apiKey: mailgunApiKey, domain: mailgunDomain });

// Function to send an email
export function sendPublicPostUpdateEmail(email, sender, content) {
    const emailData = {
      from: 'ESN <ESN@mg.depasinre.xyz>',
      to: email,
      subject: `ESN: Public Post Update`,
      text: `User \"${sender}\" sends a message on public message wall: \n ${content}`,
    };
  
    mailgun.messages().send(emailData, (error, body) => {
      if (error) {
        console.error('Mailgun error:', error);
      } else {
        console.log('Email sent:', body);
      }
    });
  }