import Mailgun from 'mailgun-js';

// Mailgun configuration
// move to github secret later
const mailgunApiKey = '8f6db5dd8cd6980f6e993af986a9019d-4b670513-7293ebc5';
const mailgunDomain = 'mg.depasinre.xyz';
const mailgun = new Mailgun({ apiKey: mailgunApiKey, domain: mailgunDomain });

export function sendPublicPostUpdateEmail(email, sender, content) {
    const emailData = {
      from: 'ESN <ESN@mg.depasinre.xyz>',
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
      from: 'ESN <ESN@mg.depasinre.xyz>',
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
        from: 'ESN <ESN@mg.depasinre.xyz>',
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
      from: 'ESN <ESN@mg.depasinre.xyz>',
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

