const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');

// Replace with your Gemini API endpoint and a secure method to handle the key
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAF4CnI8tGEqy3Blb9_2LDr10Rjy2Rqhug`;

function addMessage(content, sender = 'user') {
  const message = document.createElement('div');
  
  // Style the message based on sender (user or bot)
  message.classList.add('message');
  message.classList.add(sender === 'user' ? 'user' : 'bot');
  
  const messageContent = document.createElement('span');
  messageContent.textContent = content;
  message.appendChild(messageContent);
  
  // Add the message to the messages container
  messagesDiv.appendChild(message);
  
  // Auto-scroll to the bottom
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
        contents: [{
          parts: [{ text: promptText }],
        }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return `Error: ${errorData.error.message}`;
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Extract the response text
    const botResponse = data.candidates[0]?.content?.parts[0]?.text || 'No response received.';
    return botResponse;
  } catch (error) {
    console.error('Request Error:', error);
    return 'An error occurred while processing your request.';
  }
}

// Handle sending messages when clicking the send button
sendBtn.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (message) {
    addMessage(message, 'user'); // Display user message
    userInput.value = ''; // Clear the input field

    const reply = await sendMessageToGemini(message); // Send to API and get reply
    addMessage(reply, 'bot'); // Display bot's reply
  }
});

// Send message when the Enter key is pressed
userInput.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    sendBtn.click(); // Trigger click on send button
  }
});
