const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Answer Webhook – Handles incoming calls
app.get('/webhooks/answer', (req, res) => {
  const musicUrl = 'https://www.dropbox.com/scl/fi/59fvmdh0kvo9majz7eua6/On-My-Way-Home-Sting-The-126ers.mp3?rlkey=kxn89hbl0yau76oc9kg1vvvrk&raw=1';

  const messages = [
    'We are still trying to connect you to an available representative. Please continue to hold.',
    'A representative will be with you shortly. Thank you for your patience.',
    'Did you know? You can chat with a representative live on our website using the Live Chat system.',
    'If you are unable to wait, you can schedule a callback from one of our agents by visiting our official website.',
    'For your safety, Estovia Bank will never contact you to request your PIN, password, or secure login information. Please report any suspicious activity immediately.',
    'If you forgot your online banking password, you can securely reset it on our website at any time.',
    'Check your account balance, view recent transactions, and submit support tickets quickly through the Estovia online banking dashboard.',
    'Avoid waiting—most banking tasks can be completed instantly through our secure 24/7 self-service portal on the official website.'
  ];

  const ncco = [];

  // Professional welcome message
  ncco.push({
    action: 'talk',
    voiceName: 'Amy',
    text: 'Welcome to Estovia Bank. This call may be recorded for quality assurance and training purposes. '
        + 'Our online banking platform is available 24 hours a day for balance inquiries, transfers, password resets, and support. '
        + 'Live banking support is available from 7 AM to 5 PM Russia Standard Time, Monday through Saturday. '
        + 'Due to high call volume, your wait time may be longer than usual. Please remain on the line while we try to connect you to a representative.'
  });

  // Add 6 loops of music with rotating informative messages (~12 minutes total)
  for (let i = 0; i < 6; i++) {
    ncco.push({ action: 'stream', streamUrl: [musicUrl] });

    const messageIndex = i % messages.length;
    ncco.push({
      action: 'talk',
      voiceName: 'Amy',
      text: messages[messageIndex]
    });
  }

  // Final fallback message
  ncco.push({
    action: 'talk',
    voiceName: 'Amy',
    text: 'Unfortunately, we are still unable to connect you to a representative at this time. '
        + 'To receive support, please visit the official Estovia Bank website to start a live chat or schedule a callback at your convenience. '
        + 'Thank you for calling Estovia Bank. We look forward to assisting you.'
  });

  res.json(ncco);
});

// Logs call events
app.post('/webhooks/event', (req, res) => {
  console.log('📞 Call event:', req.body);
  res.sendStatus(200);
});

// Start Server
app.listen(port, () => {
  console.log(`📡 Estovia IVR server running at http://localhost:${port}`);
});
