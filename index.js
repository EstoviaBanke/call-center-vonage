const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Answer Webhook – Main Call Logic
app.get('/webhooks/answer', (req, res) => {
  const ncco = [
    {
      action: 'talk',
      text: 'Welcome to Estovia Bank. This call may be recorded for quality assurance and training purposes. Our online banking platform is fully updated and offers a convenient self-service experience, accessible 24 hours a day. Due to an unusually high call volume, your wait time may be longer than expected. Please remain on the line while we attempt to connect you to an available representative. Thank you for your patience.'
    },
    {
      action: 'stream',
      streamUrl: ['https://cdn.vonage.com/music/voice_api_audio_1.mp3']
    },
    {
      action: 'connect',
      timeout: 40,
      from: req.query.to,
      endpoint: [{
        type: 'phone',
        number: '+12057093036' // Agent 1
      }]
    },
    {
      action: 'connect',
      timeout: 40,
      from: req.query.to,
      endpoint: [{
        type: 'phone',
        number: '+17712185587' // Agent 2
      }]
    },
    {
      action: 'connect',
      timeout: 40,
      from: req.query.to,
      endpoint: [{
        type: 'phone',
        number: '+15393027513' // Agent 3
      }]
    },
    {
      action: 'talk',
      text: 'At this time, all our representatives are currently attending to other customers. We apologize for the inconvenience. Please leave a voicemail including your full name, phone number, and the reason for your call. A customer care representative will return your call as soon as possible. For faster support, you may also submit a ticket on our official banking website. After the tone, please leave your message. You may hang up when finished.'
    },
    {
      action: 'record',
      endOnSilence: 3,
      timeout: 120, // 2 minutes
      beepStart: true,
      eventUrl: ['https://call-center-vonage.onrender.com/webhooks/voicemail']
    },
    {
      action: 'talk',
      text: 'Thank you. Your message has been received. Goodbye.'
    }
  ];
  res.json(ncco);
});

// Event Webhook – Logs call events
app.post('/webhooks/event', (req, res) => {
  console.log('📞 Call event:', req.body);
  res.sendStatus(200);
});

// Voicemail Webhook – Logs voicemail info
app.post('/webhooks/voicemail', (req, res) => {
  const recordingUrl = req.body.recording_url;
  const caller = req.body.from;

  console.log(`📩 New voicemail from ${caller}`);
  console.log(`🔗 Listen: ${recordingUrl}`);

  res.sendStatus(200);
});

// Start Server
app.listen(port, () => {
  console.log(`📡 Vonage Call Center server listening at http://localhost:${port}`);
});
