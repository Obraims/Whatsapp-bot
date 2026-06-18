const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import chatbot responses
const { getResponse } = require('./chatbot');

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "bot-session"
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Store for conversation history (optional - for learning context)
const conversationHistory = {};

// QR Code for initial login
client.on('qr', (qr) => {
  console.log('\n========================================');
  console.log('📱 Scan this QR code with WhatsApp:');
  console.log('========================================\n');
  qrcode.generate(qr, { small: true });
  console.log('\nAfter scanning, the bot will start automatically\n');
});

// Ready event
client.on('ready', () => {
  console.log('\n✅ Bot is ready and listening for messages!');
  console.log('📨 Send a message to this WhatsApp account to test\n');
});

// Authentication failure
client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
  console.log('Please delete the ".wwebjs_auth" folder and restart the bot');
});

// Main message handler
client.on('message_create', async (msg) => {
  try {
    // Ignore messages from the bot itself and group messages (optional)
    if (msg.fromMe) return;
    if (msg.isGroupMsg) return; // Remove this line if you want bot to work in groups

    const chatId = msg.chatId;
    const senderId = msg.from;
    const messageText = msg.body.trim();

    console.log(`\n📩 Message received from ${msg.from}:`);
    console.log(`   "${messageText}"`);

    // Initialize conversation history for this chat
    if (!conversationHistory[chatId]) {
      conversationHistory[chatId] = [];
    }

    // Store incoming message
    conversationHistory[chatId].push({
      sender: 'user',
      text: messageText,
      timestamp: new Date()
    });

    // Get bot response from chatbot logic
    const botResponse = await getResponse(messageText, conversationHistory[chatId]);

    // Send response
    await client.sendMessage(chatId, botResponse);

    // Store bot response in history
    conversationHistory[chatId].push({
      sender: 'bot',
      text: botResponse,
      timestamp: new Date()
    });

    console.log(`✉️  Response sent: "${botResponse}"\n`);

    // Optional: Log to file for debugging
    logMessage(senderId, messageText, botResponse);

  } catch (error) {
    console.error('❌ Error handling message:', error);
  }
});

// Handle disconnection
client.on('disconnected', (reason) => {
  console.log('\n⚠️  Client was logged out:', reason);
  console.log('Attempting to restart...\n');
});

// Log messages to a file
function logMessage(sender, userMsg, botResponse) {
  const logDir = './logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logFile = path.join(logDir, 'bot_logs.txt');
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] FROM: ${sender}\nUSER: ${userMsg}\nBOT: ${botResponse}\n${'='.repeat(50)}\n`;

  fs.appendFileSync(logFile, logEntry);
}

// Initialize the client
console.log('🚀 Starting WhatsApp Bot...\n');
client.initialize();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down bot gracefully...');
  await client.destroy();
  process.exit(0);
});
