const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Main IVR Answer Webhook
app.get('/webhooks/answer', (req, res) => {
  const ncco = [
    {
      action: 'talk',
      text: 'Welcome to Estovia Bank. This call may be recorded for quality assurance and training purposes. Due to unusually high call volume, your wait time may be longer than expected. Please hold while we connect you to a representative.',
      voiceName: 'Amy'
    },
    {
      action: 'connect',
      timeout: 20,
      from: req.query.to,
      eventUrl: ['https://call-center-vonage.onrender.com/webhooks/connect-event'],
      ringbackTone: 'https://www.dropbox.com/scl/fi/59fvmdh0kvo9majz7eua6/On-My-Way-Home-Sting-The-126ers.mp3?rlkey=kxn89hbl0yau76oc9kg1vvvrk&raw=1',
      endpoint: [{
        type: 'phone',
        number: '+17712185587'
      }]
    }
  ];

  res.json(ncco);
});

// Connection Event Webhook
app.post('/webhooks/connect-event', (req, res) => {
  const status = req.body.status;

  if (status === 'failed' || status === 'busy' || status === 'unanswered' || status === 'timeout') {
    // Connection failed — return fallback NCCO
    res.json([
      {
        action: 'talk',
        text: 'We were unable to connect you to a representative at this time. Please try again later or use our online support system for faster assistance. Goodbye.',
        voiceName: 'Amy'
      }
    ]);
  } else {
    res.sendStatus(200); // Do nothing if successful
  }
});

// Optional Call Event Logger
app.post('/webhooks/event', (req, res) => {
  console.log('📞 Call event:', req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`📡 Vonage Call Center live at http://localhost:${port}`);
});
