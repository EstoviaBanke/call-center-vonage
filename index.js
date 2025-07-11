const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Custom music from Dropbox (streamable)
const customMusic = 'https://dl.dropboxusercontent.com/scl/fi/59fvmdh0kvo9majz7eua6/On-My-Way-Home-Sting-The-126ers.mp3?rlkey=kxn89hbl0yau76oc9kg1vvvrk&st=ntk6h2o7';

const agentNumbers = [
  '+12057093036',
  '+17712185587',
  '+15103358636'
];

app.get('/webhooks/answer', (req, res) => {
  const ncco = [
    {
      action: 'talk',
      text: 'Welcome to Estovia Bank. This call may be recorded for quality assurance and training purposes. Our online banking platform is fully updated and offers a convenient self-service experience, accessible 24 hours a day. Due to an unusually high call volume, your wait time may be longer than expected. Please remain on the line while we attempt to connect you to an available representative. Thank you for your patience.'
    },
    {
      action: 'stream',
      streamUrl: [customMusic]
    },
    // Sequential connect attempts with 25s timeout each
    ...agentNumbers.map(number => ({
      action: 'connect',
      timeout: 25,
      from: req.query.to,
      endpoint: [{
        type: 'phone',
        number: number
      }]
    })),
    // Extended music hold loop (approx 8 minutes)
    ...Array(6).fill({
      action: 'stream',
      streamUrl: [customMusic]
    }),
    {
      action: 'talk',
      text: 'At this time, all our representatives are currently attending to other customers. We apologize for the inconvenience. For faster support, please visit our official banking website to submit a ticket. Thank you for calling Estovia Bank. Goodbye.'
    }
  ];
  res.json(ncco);
});

app.post('/webhooks/event', (req, res) => {
  console.log('📞 Call event:', req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`📡 Vonage Call Center server listening at http://localhost:${port}`);
});
