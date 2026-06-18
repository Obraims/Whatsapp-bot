/**
 * Chatbot Logic
 * Customize these responses for your use case
 */

const responses = {
  // Greeting patterns
  greetings: {
    patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
    responses: [
      'Hey there! 👋 How can I help you today?',
      'Hello! Welcome! What do you need assistance with?',
      'Hi! 😊 How are you doing?'
    ]
  },

  // Help/Support
  help: {
    patterns: ['help', 'support', 'assist', 'what can you do', 'options', 'menu'],
    responses: [
      'I can help you with:\n\n📌 Common questions\n📌 General information\n📌 Quick responses\n\nWhat do you need?',
      'Here\'s what I can do:\n\n• Answer frequently asked questions\n• Provide quick support\n• Share information\n\nWhat\'s your question?'
    ]
  },

  // Thanks/Appreciation
  thanks: {
    patterns: ['thanks', 'thank you', 'thx', 'appreciate', 'thanks!'],
    responses: [
      'You\'re welcome! 😊',
      'Happy to help! 🙌',
      'Anytime! Feel free to ask if you need anything else.'
    ]
  },

  // Hours/Availability
  hours: {
    patterns: ['hours', 'open', 'closed', 'available', 'timing', 'when are you'],
    responses: [
      'I\'m available 24/7 for quick support! 🕐\n\nFor urgent matters, contact support directly.',
      'I\'m here to help anytime! For business hours, visit our website.'
    ]
  },

  // Name/Identity
  name: {
    patterns: ['who are you', 'your name', 'what is your name', 'identify'],
    responses: [
      'I\'m a WhatsApp Bot here to assist you! 🤖\n\nHow can I help?',
      'I\'m an automated assistant. What can I do for you?'
    ]
  },

  // Website/Contact
  website: {
    patterns: ['website', 'contact', 'email', 'phone', 'reach', 'how to contact'],
    responses: [
      'You can reach us:\n📧 Email: support@example.com\n🌐 Website: www.example.com\n📞 Phone: +1234567890',
      'Visit our website at www.example.com or email us at support@example.com'
    ]
  },

  // Default response for unmatched queries
  default: {
    responses: [
      'I\'m not sure I understood that. Could you rephrase? 🤔',
      'I didn\'t quite catch that. Can you try again?',
      'That\'s an interesting question! For more detailed help, please contact support.',
      'I\'m still learning! Could you provide more details?'
    ]
  }
};

/**
 * Get a random response from array
 */
function getRandomResponse(responseArray) {
  return responseArray[Math.floor(Math.random() * responseArray.length)];
}

/**
 * Check if message matches any pattern
 */
function matchesPattern(message, patterns) {
  const lowerMessage = message.toLowerCase();
  return patterns.some(pattern => lowerMessage.includes(pattern));
}

/**
 * Main function to get bot response
 * @param {string} userMessage - The message from the user
 * @param {array} conversationHistory - Previous messages in conversation (optional)
 * @returns {string} Bot response
 */
async function getResponse(userMessage, conversationHistory = []) {
  const message = userMessage.trim();

  // Check greeting
  if (matchesPattern(message, responses.greetings.patterns)) {
    return getRandomResponse(responses.greetings.responses);
  }

  // Check help request
  if (matchesPattern(message, responses.help.patterns)) {
    return getRandomResponse(responses.help.responses);
  }

  // Check thanks
  if (matchesPattern(message, responses.thanks.patterns)) {
    return getRandomResponse(responses.thanks.responses);
  }

  // Check hours/availability
  if (matchesPattern(message, responses.hours.patterns)) {
    return getRandomResponse(responses.hours.responses);
  }

  // Check identity/name
  if (matchesPattern(message, responses.name.patterns)) {
    return getRandomResponse(responses.name.responses);
  }

  // Check contact/website
  if (matchesPattern(message, responses.website.patterns)) {
    return getRandomResponse(responses.website.responses);
  }

  // Check for numbers (basic FAQ ID system)
  const numberMatch = message.match(/\d+/);
  if (numberMatch) {
    return 'I can help with that! Please describe what you need in more detail.';
  }

  // Default response
  return getRandomResponse(responses.default.responses);
}

/**
 * Add custom response patterns
 * Call this to extend the bot's functionality
 */
function addCustomResponse(category, patterns, responses) {
  responses[category] = {
    patterns: patterns,
    responses: responses
  };
}

module.exports = {
  getResponse,
  addCustomResponse
};
