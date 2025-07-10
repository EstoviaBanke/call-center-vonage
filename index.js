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
      text: 'Welcome to Estovia Bank. This call may be recorded. Our online banking platform is full updated and ready to give you a convinient self service. Our wait time might be longer than usual due to high call volume. Please hold while we connect you to a representative, Thank you.'
    },
    {
      action: 'stream',
      streamUrl: ['https://cdn.vonage.com/music/voice_api_audio_1.mp3']
    },
    {
      action: 'connect',
      timeout: 20,
      from: req.query.to,
      endpoint: [{
        type: 'phone',
        number: '+17712185587' // ✅ Your agent's number
      }]
    },
    {
      action: 'talk',
      text: 'There is no agent available at this time, as they are currently attending to other customers. Kindly leave a voicemail with your phone number, full name, and reason for your call. A customer care representative will give you a call back. For fast service, you can use the support ticket system on the official banking website and a representative will get back to you shortly. At the tone leave your message, when you are done you can hang-up.'
    },
    {
      action: 'record',
      endOnSilence: 3,
      timeout: 60,
      beepStart: true,
      eventUrl: ['https://call-center-vonage.onrender.com/webhooks/voicemail']
    },
    {
      action: 'talk',
      text: 'Thank you. Goodbye.'
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
