const express = require('express');
const app = express();
app.use(express.json());

app.get('/webhooks/answer', (req, res) => {
  const ncco = [
    {
      action: 'talk',
      text: 'Thank you for calling Estovia Bank. This call will be recorded for compliance purpose. Please hold while we connect you to a representative.'
    },
    {
      action: 'stream',
      streamUrl: ['https://cdn.vonage.com/music/voice_api_audio_1.mp3']
    },
    {
      action: 'connect',
      from: req.query.to,
      endpoint: [{
        type: 'phone',
        number: '+17712185587' // ← Replace with your real agent number
      }]
    }
  ];
  res.json(ncco);
});

app.post('/webhooks/event', (req, res) => {
  console.log('Event:', req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
