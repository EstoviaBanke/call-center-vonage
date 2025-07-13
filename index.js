const express = require('express');
const { RestClient } = require('@signalwire/node');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// SignalWire credentials (already set up)
const client = new RestClient(
  'PT27da71bf80b4994acefbf2789bf77db7b2099075f1dc2d77',
  { signalwireSpaceUrl: 'gail-realty-group.signalwire.com' }
);

app.post('/ivr', (req, res) => {
  const musicUrl = 'https://www.dropbox.com/scl/fi/59fvmdh0kvo9majz7eua6/On-My-Way-Home-Sting-The-126ers.mp3?rlkey=kxn89hbl0yau76oc9kg1vvvrk&raw=1';

  const greeting = `
    Welcome to Estovia Bank. This call may be recorded for quality assurance and training purposes.
    Our online banking system is available 24 hours a day for balance inquiries, transfers, and support requests.
    Please note that our live banking support operates from 7:00 AM to 5:00 PM Russia Standard Time, Monday through Saturday.
    Due to high call volume, your wait time may be longer than expected. Please remain on the line while we attempt to connect you to an available representative.
  `.trim();

  const holdMessage = `
    We are still trying to connect you to a representative. Please stay on the line.
  `.trim();

  const fallbackMessage = `
    We are unable to connect you at this time. A representative will return your call shortly.
    Thank you for your patience and for choosing Estovia Bank.
  `.trim();

  res.type('text/xml');
  res.send(`
    <Response>
      <Say voice="woman" language="en-US">${greeting}</Say>

      ${Array.from({ length: 4 }).map(() => `
        <Play>${musicUrl}</Play>
        <Say voice="woman" language="en-US">${holdMessage}</Say>
      `).join('')}

      <Say voice="woman" language="en-US">${fallbackMessage}</Say>
    </Response>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`📡 SignalWire IVR live at http://localhost:${port}`);
});
