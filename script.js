const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');

// Replace with your Gemini API endpoint and a secure method to handle the key
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAF4CnI8tGEqy3Blb9_2LDr10Rjy2Rqhug`;

function addMessage(content, sender = 'user') {
  const message = document.createElement('div');
  message.className = sender === 'user' ? 'user-message' : 'bot-message';
  message.textContent = content;
  messagesDiv.appendChild(message);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessageToGemini(promptText) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: { text: promptText }, // Corrected JSON structure
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return `Error: ${errorData.error.message}`;
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data.candidates[0]?.content || 'No response received.';
  } catch (error) {
    console.error('Request Error:', error);
    return 'An error occurred while processing your request.';
  }
}

// Handle sending messages
sendBtn.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (message) {
    addMessage(message, 'user');
    userInput.value = '';
    const reply = await sendMessageToGemini(message);
    addMessage(reply, 'bot');
  }
});

// Send message on Enter key press
userInput.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    sendBtn.click();
  }
});

// Toggle emoji picker visibility
emojiBtn.addEventListener('click', () => {
  emojiPicker.style.display =
    emojiPicker.style.display === 'block' ? 'none' : 'block';
});

// Add emoji to the input field
emojiPicker.addEventListener('click', (event) => {
  if (event.target.tagName === 'SPAN') {
    userInput.value += event.target.textContent;
  }
});
