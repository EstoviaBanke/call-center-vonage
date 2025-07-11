// call-center-vonage/index.js – Custom hold music, looping message, single agent

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Answer Webhook – Main Call Logic
app.get('/webhooks/answer', (req, res) => {
  const musicUrl = 'https://www.dropbox.com/scl/fi/59fvmdh0kvo9majz7eua6/On-My-Way-Home-Sting-The-126ers.mp3?rlkey=kxn89hbl0yau76oc9kg1vvvrk&st=ntk6h2o7&dl=1';

  const ncco = [
    {
      action: 'talk',
      text: 'Welcome to Estovia Bank. This call may be recorded for quality assurance and training purposes. Our online banking platform is fully updated and offers a convenient self-service experience, accessible 24 hours a day. Due to an unusually high call volume, your wait time may be longer than expected. Please remain on the line while we attempt to connect you to an available representative. Thank you for your patience.'
    },
    ...Array(8).fill([  // 8-minute music loop with message every loop
      {
        action: 'stream',
        streamUrl: [musicUrl]
      },
      {
        action: 'talk',
        text: 'We are still attempting to connect you to a representative. Please remain on the line.'
      }
    ]).flat(),
    {
      action: 'connect',
      timeout: 20,
      from: req.query.to,
      endpoint: [
        {
          type: 'phone',
          number: '+17712185587'
        }
      ]
    },
    {
      action: 'talk',
      text: 'We are currently unable to connect you to a representative. Please try again later or visit our website for further assistance. Goodbye.'
    }
  ];

  res.json(ncco);
});

// Event Webhook – Logs call events
app.post('/webhooks/event', (req, res) => {
  console.log('📞 Call event:', req.body);
  res.sendStatus(200);
});

// Start Server
app.listen(port, () => {
  console.log(`📡 Vonage Call Center server listening at http://localhost:${port}`);
});
