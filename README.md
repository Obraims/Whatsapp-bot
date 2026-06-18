# 🤖 WhatsApp Personal Bot - Free Automation

A free, open-source WhatsApp Personal automation bot with auto-replies and chatbot functionality.

## ✨ Features

✅ **Auto-replies** - Respond automatically to incoming messages  
✅ **Chatbot** - Intelligent response patterns for common questions  
✅ **24/7 Operation** - Runs continuously on your computer  
✅ **Customizable** - Easy to modify responses and add new patterns  
✅ **Conversation History** - Keeps track of chat history  
✅ **Message Logging** - All conversations saved to file  
✅ **Completely Free** - No subscriptions or API costs  

---

## 📋 Requirements

- **Node.js** (v14 or higher)
  - Download from https://nodejs.org/
  - Verify installation: `node -v`

- **npm** (usually comes with Node.js)
  - Verify: `npm -v`

- **WhatsApp Account** (Personal, not Business)

- **Computer/Server** to keep running 24/7 (or run when needed)

---

## 🚀 Installation & Setup

### Step 1: Download & Extract Files
Place all 4 files in a folder:
- `bot.js`
- `chatbot.js`
- `package.json`
- `.env.example`

### Step 2: Install Dependencies
Open terminal/command prompt in your project folder and run:

```bash
npm install
```

This will download all required packages (~200MB). Takes 2-5 minutes.

### Step 3: Rename Environment File
```bash
# On Windows (Command Prompt):
ren .env.example .env

# On Mac/Linux:
mv .env.example .env
```

### Step 4: Start the Bot
```bash
npm start
```

You'll see:
```
🚀 Starting WhatsApp Bot...

========================================
📱 Scan this QR code with WhatsApp:
========================================
```

### Step 5: Scan QR Code
1. Open WhatsApp on your phone
2. Go to **Settings → Linked Devices**
3. Tap **Link a device**
4. **Scan the QR code** shown in terminal

Once scanned, you'll see:
```
✅ Bot is ready and listening for messages!
📨 Send a message to this WhatsApp account to test
```

---

## 🧪 Testing

Send a message to the WhatsApp account running the bot:

- "hello" → Bot replies with greeting
- "help" → Bot shows available options
- "what's your name?" → Bot identifies itself
- "thanks" → Bot says you're welcome
- Random text → Bot asks for clarification

---

## 🎯 Customization

### Add Custom Responses

Edit `chatbot.js` to add new response patterns:

```javascript
// Example: Add FAQ responses
const responses = {
  faq: {
    patterns: ['price', 'cost', 'how much', 'pricing'],
    responses: [
      'Our pricing starts at $9.99/month. Visit our website for details.',
      'Check our pricing page: www.example.com/pricing'
    ]
  },
  // ... rest of responses
};
```

### Change Default Greetings

Find the `greetings` section in `chatbot.js`:

```javascript
greetings: {
  patterns: ['hi', 'hello', 'hey'],
  responses: [
    'Hey! Your custom message here!',
    'Another greeting variant!'
  ]
}
```

### Add Customer Service Keywords

```javascript
order_status: {
  patterns: ['order', 'tracking', 'status', 'where is my'],
  responses: [
    'To check your order, reply with your order number.',
    'You can also track at: www.example.com/track'
  ]
}
```

---

## ⚙️ Advanced Features

### Enable Group Messages
In `bot.js`, find this line:
```javascript
if (msg.isGroupMsg) return; // Remove or comment out
```

Remove it to allow bot to work in group chats.

### Webhook Integration
For sending data to external services:

1. Set `WEBHOOK_URL` in `.env`
2. Modify `bot.js` to call your webhook

Example:
```javascript
const axios = require('axios');

// In message handler:
await axios.post(process.env.WEBHOOK_URL, {
  from: msg.from,
  message: messageText,
  timestamp: new Date()
});
```

### Database Storage
To save conversations to a database instead of text file:

1. Install database (e.g., `npm install sqlite3`)
2. Modify the `logMessage()` function in `bot.js`
3. Save to database instead of file

---

## 📁 File Structure

```
project-folder/
├── bot.js              # Main bot file
├── chatbot.js          # Chatbot logic & responses
├── package.json        # Dependencies
├── .env                # Configuration (create from .env.example)
├── README.md           # This file
└── logs/               # Created automatically, stores chat logs
    └── bot_logs.txt
```

---

## ⚠️ Important Notes

### 1. **Keep Computer Running**
The bot only works while this script is running. If you close terminal/restart PC, bot stops.

**Solution:** Run on a cheap server/VPS (AWS, DigitalOcean, Heroku) for 24/7 operation.

### 2. **WhatsApp May Detect Automation**
WhatsApp might:
- Temporarily restrict your account
- Ask for unusual activity verification
- Throttle messages

**To minimize risk:**
- Don't spam messages
- Keep realistic delays between responses
- Use natural response patterns

### 3. **No Official API**
This uses WhatsApp Web (browser automation), not official API:
- ✅ Free & flexible
- ❌ Might break if WhatsApp changes UI
- ❌ Against WhatsApp ToS (personal use only)

### 4. **Security**
Your WhatsApp session is stored locally in `.wwebjs_auth` folder:
- ⚠️ Don't share this folder
- ⚠️ Don't commit to GitHub
- ✅ Add to `.gitignore`

---

## 🆘 Troubleshooting

### "Cannot find module 'whatsapp-web.js'"
```bash
npm install
```

### "QR code not appearing"
- Try restarting: `npm start`
- Make sure terminal window is large enough
- Try scanning again

### "Bot doesn't reply"
1. Check bot is still running (look for ✅ Ready message)
2. Send a simple message like "hello"
3. Check console for error messages

### "Account restricted/locked"
- Too many messages sent
- Solution: Wait 24-48 hours for WhatsApp to unlock
- Use more realistic response timing

### Delete Session & Start Fresh
```bash
rm -rf .wwebjs_auth/    # Mac/Linux
rmdir .wwebjs_auth /s   # Windows
npm start               # Start fresh
```

---

## 🔄 Keeping Bot Running 24/7

### Option 1: **Cheap Cloud Server** (Recommended)
- **DigitalOcean** - $4-6/month
- **AWS Free Tier** - 12 months free
- **Google Cloud** - $300 free credits
- **Heroku** - Free tier (limited)

Installation on server:
```bash
ssh user@your-server.com
git clone your-repo.git
cd your-repo
npm install
nohup npm start &
```

### Option 2: **Local Computer**
Keep laptop running 24/7 with:
- Disable sleep/hibernation
- Keep WiFi connected
- Use task scheduler to auto-restart on reboot

### Option 3: **Docker Container**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

---

## 📝 Example Use Cases

### **Customer Support Automation**
```javascript
support_keyword: {
  patterns: ['issue', 'problem', 'bug', 'error'],
  responses: [
    'Sorry to hear that! 😟\n\nPlease describe the issue and I\'ll help.',
    'I\'ll connect you with our support team shortly.'
  ]
}
```

### **FAQ Bot**
```javascript
faq: {
  patterns: ['return', 'refund', 'warranty'],
  responses: [
    'Our return policy: Within 30 days for full refund.\nSee: example.com/returns'
  ]
}
```

### **Appointment Reminder**
Modify bot to send reminders at specific times (combine with node-schedule package)

### **Lead Qualification**
Auto-collect info: "What's your budget?" → "How many users?"

---

## 📞 Support & Resources

- **WhatsApp-web.js Docs**: https://github.com/pedroslopez/whatsapp-web.js
- **Node.js Docs**: https://nodejs.org/docs/
- **Common Issues**: Check GitHub issues in whatsapp-web.js repo

---

## ⚖️ Legal Notice

- **Terms of Service**: This bot operates on WhatsApp Personal, which may violate WhatsApp's Terms of Service
- **Use Responsibly**: For personal/business use only, not for spam
- **No Liability**: Creator not responsible for account restrictions

---

## 📄 License

MIT - Feel free to modify and share

---

**Happy automating! 🚀**

Questions? Check the troubleshooting section or GitHub issues.
