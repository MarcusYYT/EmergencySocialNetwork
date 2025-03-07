import Mailgun from 'mailgun-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Mailgun configuration from environment variables
const mailgunApiKey = process.env.MAILGUN_API_KEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const mailgun = new Mailgun({ apiKey: mailgunApiKey, domain: mailgunDomain });

export function sendPublicPostUpdateEmail(email, sender, content) {
    const emailData = {
      from: `ESN <ESN@${mailgunDomain}>`,
      to: email,
      subject: `ESN: Public Post Update`,
      text: `User \"${sender}\" sends a message on public message wall: \n \n ${content}`,
    };
  
    mailgun.messages().send(emailData, (error, body) => {
      if (error) {
        console.error('Mailgun error:', error);
      } else {
        console.log('Email sent:', body);
      }
    });
  }

  export function sendAnnouncementUpdateEmail(email, sender, content) {
    const emailData = {
      from: `ESN <ESN@${mailgunDomain}>`,
      to: email,
      subject: `ESN: Announcement Update`,
      text: `User \"${sender}\" published a new announcement: \n \n ${content}`,
    };
  
    mailgun.messages().send(emailData, (error, body) => {
      if (error) {
        console.error('Mailgun error:', error);
      } else {
        console.log('Email sent:', body);
      }
    });
  }


export function sendPrivatePostUpdateEmail(email, sender, content) {
    const emailData = {
        from: `ESN <ESN@${mailgunDomain}>`,
        to: email,
        subject: `ESN: Private Post Update`,
        text: `User \"${sender}\" sends you a private message: \n \n ${content}`,
    };

    mailgun.messages().send(emailData, (error, body) => {
        if (error) {
        console.error('Mailgun error:', error);
        } else {
        console.log('Email sent:', body);
        }
    });
}

export function sendStatusUpdateEmail(email, sender, content) {
  const emailData = {
      from: `ESN <ESN@${mailgunDomain}>`,
      to: email,
      subject: `ESN: Status Update`,
      text: `User \"${sender}\" change his/her status to: \n \n ${content}`,
  };

  mailgun.messages().send(emailData, (error, body) => {
      if (error) {
      console.error('Mailgun error:', error);
      } else {
      console.log('Email sent:', body);
      }
  });
}

