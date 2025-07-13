const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Answer Webhook
app.get('/webhooks/answer', (req, res) => {
  const musicUrl = 'https://www.dropbox.com/scl/fi/59fvmdh0kvo9majz7eua6/On-My-Way-Home-Sting-The-126ers.mp3?rlkey=kxn89hbl0yau76oc9kg1vvvrk&raw=1';

  const ncco = [];

  // Intro Message
  ncco.push({
    action: 'talk',
    voiceName: 'Amy',
    text: 'Welcome to Estovia Bank. This call may be recorded for quality assurance. '
        + 'Our online banking system is available 24 hours a day. Live support operates from 7 AM to 5 PM Russia Standard Time, Monday to Saturday. '
        + 'Due to high call volume, please stay on the line while we connect you.'
  });

  // Hold Music with message loop (8 minutes total)
  for (let i = 0; i < 4; i++) {
    ncco.push({ action: 'stream', streamUrl: [musicUrl] });
    ncco.push({ action: 'talk', voiceName: 'Amy', text: 'We are still trying to connect you to a representative. Please stay on the line.' });
  }

  // Final fallback message
  ncco.push({
    action: 'talk',
    voiceName: 'Amy',
    text: 'We are unable to connect you at this time. A representative will return your call shortly. Thank you for choosing Estovia Bank.'
  });

  res.json(ncco);
});

// Call Event Logger
app.post('/webhooks/event', (req, res) => {
  console.log('📞 Call event:', req.body);
  res.sendStatus(200);
});

// Start Server
app.listen(port, () => {
  console.log(`📡 Estovia IVR running at http://localhost:${port}`);
});
