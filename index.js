// call-center-vonage/index.js – Full Multi-language IVR with music and voicemail fallback

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const agentNumbers = [
  '+12057093036',
  '+17712185587',
  '+15103358636'
];

const voices = {
  '1': 'Amy',         // English
  '2': 'Conchita',    // Spanish
  '3': 'Tatyana'      // Russian
};

const prompts = {
  '1': {
    welcome: 'Welcome to Estovia Bank. For English, press 1. Para español, presione 2. Для обслуживания на русском языке нажмите 3.',
    accountType: 'Our menu has changed. Please listen carefully. Press 1 if you are a business account holder. Press 2 for personal account holder. Press 3 to open a new account.',
    newAccount: 'To open a new account, please fill out the application form on our website. Alternatively, leave your full name, email address, phone number, and physical address after the tone. An invitation will be sent to you.',
    thankYou: 'Thank you. Goodbye.',
    submenu: (isBusiness) => [
      'Press 1 for bank account issues, international or local transfers.',
      `Press 2 if your ${isBusiness ? 'business' : 'personal'} ATM card is lost or stolen.`,
      'Press 3 to report fraud.',
      ...(isBusiness ? ['Press 4 for investment inquiries.'] : []),
      'Press 9 to return to the main menu.',
      'Press 0 to speak to a representative.'
    ].join(' '),
    selections: {
      '1': (isBusiness) => `To better assist you, please have your ${isBusiness ? 'business' : 'personal'} account number, full name, and address handy while we connect you to a representative.`,
      '2': 'Please secure your account immediately. A representative will help you block your card and request a replacement.',
      '3': 'Please describe the suspicious activity after the tone or submit a report through our fraud portal online.',
      '4': 'Our investment team will speak with you shortly. Please have your account documents ready.',
      '9': 'Returning to the main menu.',
      '0': 'Connecting you to a representative now. Please hold.'
    },
    voicemail: 'All agents are currently unavailable. Please leave a message after the tone.'
  },
  '2': {
    welcome: 'Bienvenido a Estovia Bank. Para inglés, presione 1. Para español, presione 2. Для обслуживания на русском языке нажмите 3.',
    accountType: 'Nuestro menú ha cambiado. Escuche con atención. Presione 1 si tiene una cuenta de negocios. Presione 2 si tiene una cuenta personal. Presione 3 para abrir una nueva cuenta.',
    newAccount: 'Para abrir una nueva cuenta, complete la solicitud en nuestro sitio web. También puede dejar su nombre completo, correo electrónico, número de teléfono y dirección después del tono. Le enviaremos una invitación.',
    thankYou: 'Gracias. Adiós.',
    submenu: (isBusiness) => [
      'Presione 1 para problemas con su cuenta bancaria, transferencias internacionales o locales.',
      `Presione 2 si su tarjeta de débito ${isBusiness ? 'empresarial' : 'personal'} fue robada o perdida.`,
      'Presione 3 para reportar fraude.',
      ...(isBusiness ? ['Presione 4 para consultas de inversión.'] : []),
      'Presione 9 para volver al menú principal.',
      'Presione 0 para hablar con un representante.'
    ].join(' '),
    selections: {
      '1': (isBusiness) => `Para ayudarle mejor, tenga su número de cuenta ${isBusiness ? 'empresarial' : 'personal'}, nombre completo y dirección a la mano mientras lo conectamos con un representante.`,
      '2': 'Por favor, asegure su cuenta de inmediato. Un representante le ayudará a bloquear su tarjeta y solicitar un reemplazo.',
      '3': 'Describa la actividad sospechosa después del tono o envíe un informe a través de nuestro portal en línea.',
      '4': 'Nuestro equipo de inversiones hablará con usted en breve. Tenga sus documentos preparados.',
      '9': 'Regresando al menú principal.',
      '0': 'Conectándolo con un representante. Por favor, espere.'
    },
    voicemail: 'Todos los representantes están ocupados. Por favor, deje un mensaje después del tono.'
  },
  '3': {
    welcome: 'Добро пожаловать в банк Эстовия. Для английского нажмите 1. Для испанского нажмите 2. Для русского нажмите 3.',
    accountType: 'Наше меню изменилось. Пожалуйста, внимательно прослушайте. Нажмите 1, если у вас бизнес-счет. Нажмите 2, если у вас личный счет. Нажмите 3, чтобы открыть новый счет.',
    newAccount: 'Чтобы открыть новый счет, заполните форму на нашем сайте. Или оставьте свое имя, адрес электронной почты, номер телефона и адрес после сигнала. Мы отправим вам приглашение.',
    thankYou: 'Спасибо. До свидания.',
    submenu: (isBusiness) => [
      'Нажмите 1 для вопросов по банковскому счету и переводам.',
      `Нажмите 2, если ваша ${isBusiness ? 'корпоративная' : 'личная'} карта потеряна или украдена.`,
      'Нажмите 3, чтобы сообщить о мошенничестве.',
      ...(isBusiness ? ['Нажмите 4 для инвестиционных запросов.'] : []),
      'Нажмите 9, чтобы вернуться в главное меню.',
      'Нажмите 0, чтобы поговорить с представителем.'
    ].join(' '),
    selections: {
      '1': (isBusiness) => `Пожалуйста, подготовьте ваш ${isBusiness ? 'бизнес' : 'личный'} номер счета, полное имя и адрес. Мы скоро вас соединим с представителем.`,
      '2': 'Немедленно защитите свою учетную запись. Представитель поможет вам заблокировать карту и оформить замену.',
      '3': 'Опишите подозрительную активность после сигнала или сообщите о ней через наш веб-сайт.',
      '4': 'С вами свяжется наш инвестиционный отдел. Подготовьте документы.',
      '9': 'Возврат в главное меню.',
      '0': 'Соединяем с представителем. Пожалуйста, подождите.'
    },
    voicemail: 'Все представители заняты. Оставьте сообщение после сигнала.'
  }
};

app.get('/webhooks/answer', (req, res) => {
  res.json([
    { action: 'talk', voiceName: 'Amy', text: prompts['1'].welcome },
    { action: 'input', maxDigits: 1, eventUrl: ['https://call-center-vonage.onrender.com/webhooks/account-type'] }
  ]);
});

app.post('/webhooks/account-type', (req, res) => {
  const digit = req.body.dtmf;
  const lang = ['1', '2', '3'].includes(digit) ? digit : '1';
  const voice = voices[lang];

  res.json([
    { action: 'talk', voiceName: voice, text: prompts[lang].accountType },
    { action: 'input', maxDigits: 1, eventUrl: [`https://call-center-vonage.onrender.com/webhooks/submenu?lang=${lang}`] }
  ]);
});

app.post('/webhooks/submenu', (req, res) => {
  const type = req.body.dtmf;
  const lang = req.query.lang;
  const voice = voices[lang];

  if (type === '3') {
    return res.json([
      { action: 'talk', voiceName: voice, text: prompts[lang].newAccount },
      { action: 'record', endOnSilence: 3, timeout: 120, beepStart: true, eventUrl: ['https://call-center-vonage.onrender.com/webhooks/voicemail'] },
      { action: 'talk', voiceName: voice, text: prompts[lang].thankYou }
    ]);
  }

  const isBusiness = type === '1';

  res.json([
    { action: 'talk', voiceName: voice, text: prompts[lang].submenu(isBusiness) },
    { action: 'input', maxDigits: 1, eventUrl: [`https://call-center-vonage.onrender.com/webhooks/handle-selection?type=${type}&lang=${lang}`] }
  ]);
});

app.post('/webhooks/handle-selection', (req, res) => {
  const digit = req.body.dtmf;
  const type = req.query.type;
  const lang = req.query.lang;
  const voice = voices[lang];
  const isBusiness = type === '1';
  const message = typeof prompts[lang].selections[digit] === 'function'
    ? prompts[lang].selections[digit](isBusiness)
    : prompts[lang].selections[digit] || 'Invalid option.';

  const ncco = [{ action: 'talk', voiceName: voice, text: message }];

  if (digit === '0' || ['1', '2', '4'].includes(digit)) {
    ncco.push({
      action: 'stream',
      streamUrl: ['https://cdn.vonage.com/music/voice_api_audio_1.mp3']
    });

    agentNumbers.forEach(number => {
      ncco.push({
        action: 'connect',
        timeout: 25,
        from: 'VonageNumber',
        endpoint: [{ type: 'phone', number }]
      });
    });

    ncco.push({ action: 'talk', voiceName: voice, text: prompts[lang].voicemail });

    ncco.push({
      action: 'record',
      endOnSilence: 3,
      timeout: 120,
      beepStart: true,
      eventUrl: ['https://call-center-vonage.onrender.com/webhooks/voicemail']
    });
  } else if (digit === '9') {
    ncco.push({
      action: 'redirect',
      destination: { type: 'ncco', url: ['https://call-center-vonage.onrender.com/webhooks/answer'] }
    });
  }

  res.json(ncco);
});

app.post('/webhooks/voicemail', (req, res) => {
  const recordingUrl = req.body.recording_url;
  const caller = req.body.from;
  console.log(`📩 Voicemail received from ${caller}`);
  console.log(`🔗 Listen: ${recordingUrl}`);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`📡 Estovia IVR server live at http://localhost:${port}`);
});
