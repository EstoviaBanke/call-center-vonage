const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Main call answer webhook with hold music and callback prompt
app.get('/webhooks/answer', (req, res) => {
  const streamUrl = 'https://www.dropbox.com/scl/fi/59fvmdh0kvo9majz7eua6/On-My-Way-Home-Sting-The-126ers.mp3?raw=1';

  const holdLoop = [];

  for (let i = 0; i < 8; i++) {
    holdLoop.push(
      {
        action: 'stream',
        streamUrl: [streamUrl]
      },
      {
        action: 'talk',
        voiceName: 'Amy',
        text: 'We are still trying to connect you to a representative. Please stay on the line.'
      }
    );
  }

  const ncco = [
    {
      action: 'talk',
      voiceName: 'Amy',
      text: 'Welcome to Estovia Bank. This call may be recorded for quality assurance and training purposes. Due to high call volume, your wait time may be longer than expected.'
    },
    ...holdLoop,
    {
      action: 'talk',
      voiceName: 'Amy',
      text: 'We are currently unable to connect you to a representative. If you would like a callback, press 1 now. Or visit our website to submit a support ticket.'
    },
    {
      action: 'input',
      maxDigits: 1,
      timeout: 7,
      eventUrl: ['https://call-center-vonage.onrender.com/webhooks/callback-request']
    }
  ];

  res.json(ncco);
});

// Callback request handler (logs caller number)
app.post('/webhooks/callback-request', (req, res) => {
  const digit = req.body.dtmf;
  const caller = req.body.from;

  if (digit === '1') {
    console.log(`📞 Callback requested from ${caller}`);
    return res.json([
      {
        action: 'talk',
        voiceName: 'Amy',
        text: 'Thank you. A representative will call you back shortly. Goodbye.'
      }
    ]);
  }

  res.json([
    {
      action: 'talk',
      voiceName: 'Amy',
      text: 'Thank you for calling Estovia Bank. Goodbye.'
    }
  ]);
});

// Call event logger (optional for analytics)
app.post('/webhooks/event', (req, res) => {
  console.log('📞 Call event:', req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`📡 Vonage Call Center server is running at http://localhost:${port}`);
});
