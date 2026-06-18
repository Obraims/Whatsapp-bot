# 🔧 Advanced Customization Guide

## 1. Add Custom Response Categories

In `chatbot.js`, add new response patterns:

```javascript
const responses = {
  // ... existing patterns ...
  
  // New: Product inquiry
  products: {
    patterns: ['product', 'what do you sell', 'catalog', 'menu'],
    responses: [
      'We offer:\n📦 Product A - $10\n📦 Product B - $20\n\nWhich interests you?',
      'Check our catalog at www.example.com/products'
    ]
  },

  // New: Scheduling
  appointments: {
    patterns: ['appointment', 'book', 'schedule', 'meeting', 'demo'],
    responses: [
      'I can help you schedule! Available slots:\n• Monday 10am\n• Wednesday 2pm\n• Friday 4pm\n\nWhich works?',
      'To book an appointment, reply with your preferred date and time.'
    ]
  }
};
```

---

## 2. Integrate with External APIs

### Get Weather Data
```javascript
// Add to top of chatbot.js
const axios = require('axios');

async function getResponse(userMessage, conversationHistory) {
  // ... existing code ...
  
  if (userMessage.toLowerCase().includes('weather')) {
    try {
      const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
        params: {
          key: 'your-api-key',
          q: 'Nairobi'
        }
      });
      const temp = response.data.current.temp_c;
      return `It's currently ${temp}°C in Nairobi. ${response.data.current.condition.text}`;
    } catch (error) {
      return 'Could not fetch weather data. Try again later.';
    }
  }
}
```

### Fetch Data from Your Website
```javascript
if (userMessage.toLowerCase().includes('news')) {
  try {
    const response = await axios.get('https://your-site.com/api/latest-news');
    const news = response.data[0];
    return `📰 Latest: ${news.title}\n${news.summary}`;
  } catch (error) {
    return 'Unable to fetch latest news.';
  }
}
```

---

## 3. Send Files (Images, Documents)

In `bot.js`, modify message handler:

```javascript
const { MessageMedia } = require('whatsapp-web.js');

// To send an image
if (messageText.includes('send image')) {
  const media = await MessageMedia.fromUrl('https://example.com/image.jpg');
  await client.sendMessage(chatId, media);
  return; // Don't send text response
}

// To send a PDF
if (messageText.includes('send invoice')) {
  const pdf = await MessageMedia.fromUrl('https://example.com/invoice.pdf');
  await client.sendMessage(chatId, pdf);
}
```

---

## 4. Database Integration (SQLite Example)

### Install SQLite
```bash
npm install sqlite3
```

### Create Database
```javascript
// database.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./bot.db');

db.run(`
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY,
    phone TEXT,
    message TEXT,
    response TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function logToDB(phone, userMsg, botMsg) {
  db.run(
    'INSERT INTO conversations (phone, message, response) VALUES (?, ?, ?)',
    [phone, userMsg, botMsg],
    (err) => {
      if (err) console.error(err);
    }
  );
}

module.exports = { logToDB };
```

### Use in bot.js
```javascript
const { logToDB } = require('./database');

// In message handler:
logToDB(msg.from, messageText, botResponse);
```

---

## 5. Schedule Messages

### Install Node Schedule
```bash
npm install node-schedule
```

### Send Scheduled Messages
```javascript
// schedule.js
const schedule = require('node-schedule');
const client = require('./bot'); // Your client

// Send daily message at 9 AM
schedule.scheduleJob('0 9 * * *', () => {
  client.sendMessage('1234567890@c.us', '☀️ Good morning! How can I help you today?');
});

// Send weekly report
schedule.scheduleJob('0 0 * * 0', () => {
  client.sendMessage('1234567890@c.us', '📊 Weekly summary here...');
});
```

---

## 6. Learn from User Feedback

Track what users say to improve responses:

```javascript
// feedback.js
const fs = require('fs');

const feedback = {
  liked: [],
  disliked: []
};

function recordFeedback(message, liked) {
  if (liked) {
    feedback.liked.push(message);
  } else {
    feedback.disliked.push(message);
  }
  
  fs.writeFileSync('feedback.json', JSON.stringify(feedback, null, 2));
}

// In bot.js - check for thumbs up/down reactions
if (messageText === '👍') {
  recordFeedback('last_response', true);
}

module.exports = { recordFeedback };
```

---

## 7. Context-Aware Responses

Remember conversation context:

```javascript
function getContextualResponse(userMessage, conversationHistory) {
  // Get last 3 messages for context
  const context = conversationHistory.slice(-3);
  
  // Check if this is a follow-up
  if (userMessage.includes('that') || userMessage.includes('it')) {
    const lastUserMsg = context.find(m => m.sender === 'user')?.text;
    return `Are you referring to: "${lastUserMsg}"?`;
  }
  
  return getResponse(userMessage, conversationHistory);
}
```

---

## 8. Rate Limiting (Prevent Spam)

```javascript
// rate-limiter.js
const limits = {};

function canSendMessage(chatId) {
  const now = Date.now();
  
  if (!limits[chatId]) {
    limits[chatId] = { last: now, count: 0 };
    return true;
  }
  
  // Max 20 messages per minute
  if (now - limits[chatId].last > 60000) {
    limits[chatId] = { last: now, count: 0 };
  }
  
  if (limits[chatId].count >= 20) {
    return false;
  }
  
  limits[chatId].count++;
  return true;
}

module.exports = { canSendMessage };
```

Use in bot.js:
```javascript
const { canSendMessage } = require('./rate-limiter');

client.on('message_create', async (msg) => {
  if (!canSendMessage(msg.chatId)) {
    console.log('Rate limit exceeded for:', msg.chatId);
    return;
  }
  // ... rest of handler
});
```

---

## 9. Keywords with Actions

Create advanced keyword handling:

```javascript
const commands = {
  '/help': () => showHelp(),
  '/status': () => getSystemStatus(),
  '/feedback': () => requestFeedback(),
  '/track': (args) => trackOrder(args[0])
};

async function handleCommand(message) {
  const parts = message.split(' ');
  const cmd = parts[0];
  
  if (commands[cmd]) {
    return await commands[cmd](parts.slice(1));
  }
  
  return null;
}
```

---

## 10. Error Tracking

Track and log errors:

```javascript
// error-logger.js
const fs = require('fs');

function logError(error, context) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    context: context
  };
  
  fs.appendFileSync('./errors.log', JSON.stringify(errorLog) + '\n');
  console.error('Error logged:', error.message);
}

module.exports = { logError };
```

---

## 11. Multi-Language Support

```javascript
const languages = {
  en: {
    hello: 'Hello!',
    goodbye: 'Goodbye!',
    help: 'How can I help?'
  },
  es: {
    hello: '¡Hola!',
    goodbye: '¡Adiós!',
    help: '¿Cómo puedo ayudarte?'
  },
  fr: {
    hello: 'Bonjour!',
    goodbye: 'Au revoir!',
    help: 'Comment puis-je vous aider?'
  }
};

function getGreeting(language = 'en') {
  return languages[language]?.hello || languages['en'].hello;
}
```

---

## 12. Testing Your Bot

### Unit Tests
```javascript
// test.js
const { getResponse } = require('./chatbot');

async function runTests() {
  console.log('Testing greetings...');
  let result = await getResponse('hello');
  console.assert(result.includes('How'), 'Greeting test failed');
  
  console.log('Testing help...');
  result = await getResponse('help');
  console.assert(result.length > 0, 'Help test failed');
  
  console.log('✅ All tests passed!');
}

runTests();
```

Run tests:
```bash
node test.js
```

---

## 🎯 Common Extensions

- **CRM Integration**: Save user info to Salesforce/HubSpot
- **Payment Processing**: Accept payments via Stripe/PayPal
- **Ticketing System**: Create support tickets automatically
- **Analytics**: Track user behavior and bot performance
- **Multi-language**: Support multiple languages
- **AI Integration**: Use OpenAI API for smarter responses

---

**Ready to extend? Pick one feature above and give it a try!** 🚀
