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
        timeout: 25,
        from: req.query.to || 'VonageNumber',
        endpoint: [
          { type: 'phone', number: '+12057093036' },
          { type: 'phone', number: '+17712185587' },
          { type: 'phone', number: '+15393027513' }
        ]
      },
      {
        action: 'stream',
        streamUrl: ['https://cdn.vonage.com/music/voice_api_audio_1.mp3']
      },
      {
        action: 'stream',
        streamUrl: ['https://cdn.vonage.com/music/voice_api_audio_1.mp3']
      },
      {
        action: 'stream',
        streamUrl: ['https://cdn.vonage.com/music/voice_api_audio_1.mp3']
      },
      {
        action: 'stream',
        streamUrl: ['https://cdn.vonage.com/music/voice_api_audio_1.mp3']
      },
      {
        action: 'stream',
        streamUrl: ['https://cdn.vonage.com/music/voice_api_audio_1.mp3']
      },
      {
        action: 'talk',
        text: 'We are sorry, all our agents are currently busy assisting other customers. Please leave a voicemail with your full name, phone number, and the reason for your call after the tone. A representative will return your call shortly.'
      },
      {
        action: 'record',
        endOnSilence: 3,
        timeout: 120,
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
  