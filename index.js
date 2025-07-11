const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Main IVR Entry Point – Answer Webhook
app.get('/webhooks/answer', (req, res) => {
  const musicUrl = 'https://www.dropbox.com/scl/fi/59fvmdh0kvo9majz7eua6/On-My-Way-Home-Sting-The-126ers.mp3?rlkey=kxn89hbl0yau76oc9kg1vvvrk&raw=1';

  const ncco = [];

  // 📞 Professional welcome
  ncco.push({
    action: 'talk',
    voiceName: 'Amy',
    text: 'Welcome to Estovia Bank. This call may be recorded for quality assurance and training purposes. '
        + 'Our online banking system is available 24 hours a day for balance inquiries, transfers, and support requests. '
        + 'Due to high call volume, your wait time may be longer than expected. Please remain on the line while we attempt to connect you to an available representative.'
  });

  // 🔁 Music + status message (8 min loop total)
  for (let i = 0; i < 4; i++) {
    ncco.push({
      action: 'stream',
      streamUrl: [musicUrl]
    });
    ncco.push({
      action: 'talk',
      voiceName: 'Amy',
      text: 'We are still trying to connect you to a representative. Please stay on the line.'
    });
  }

  // 📞 Final fallback
  ncco.push({
    action: 'talk',
    voiceName: 'Amy',
    text: 'We are unable to connect you at this time. A representative will return your call shortly. Thank you for your patience and for choosing Estovia Bank.'
  });

  res.json(ncco);
});

// Log call events
app.post('/webhooks/event', (req, res) => {
  console.log('📞 Call event:', req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`📡 Estovia Call Center IVR server running on http://localhost:${port}`);
});
