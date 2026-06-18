# ⚡ Quick Start (5 Minutes)

## 1️⃣ Install Node.js
Download: https://nodejs.org/ (LTS version)

Verify:
```bash
node -v
npm -v
```

## 2️⃣ Install Dependencies
In your project folder:
```bash
npm install
```

## 3️⃣ Create .env File
Copy `.env.example` to `.env`

```bash
# Windows (Command Prompt):
copy .env.example .env

# Mac/Linux (Terminal):
cp .env.example .env
```

## 4️⃣ Start Bot
```bash
npm start
```

## 5️⃣ Scan QR Code
- See QR code in terminal
- Open WhatsApp on phone
- Settings → Linked Devices → Link a Device
- Scan the QR code
- Wait for ✅ Ready message

## 6️⃣ Test It
Send "hello" to the WhatsApp account - bot should reply!

---

## 🎨 Customize Responses

Edit `chatbot.js` to change what bot says.

Example - Add support keyword:
```javascript
support: {
  patterns: ['help', 'issue', 'problem'],
  responses: [
    'I can help! What\'s wrong?',
    'Tell me more about your issue.'
  ]
}
```

---

## ❌ Common Issues

**"Cannot find module"**
```bash
npm install
```

**"QR code not showing"**
- Restart: `npm start`
- Make terminal window bigger

**"Bot not replying"**
- Check terminal shows ✅ Ready
- Try sending "hello"
- Look for errors in terminal

---

## 📖 Full Guide
See `README.md` for complete documentation.

---

**You're ready! 🚀**
