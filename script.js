const API_KEY = "AIzaSyAJo3jzjiahgN7uVkiprpWm0bwP1J4iWf4"; // Replace with your actual API key
const chatBox = document.getElementById("chat-box");

// Load previous chat from local storage when page loads
document.addEventListener("DOMContentLoaded", loadChatHistory);

async function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    if (!userInput.trim()) return;

    appendMessage("user", userInput);
    saveMessage("user", userInput);
    document.getElementById("user-input").value = "";

    let botMessage = appendMessage("bot", "Typing...");

    try {
        let response = await getBotResponse(userInput);
        botMessage.innerText = response;
        saveMessage("bot", response);
    } catch (error) {
        console.error("Error:", error);
        botMessage.innerText = "Sorry, something went wrong!";
        saveMessage("bot", "Sorry, something went wrong!");
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to get response from Gemini AI
async function getBotResponse(query) {
    let url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    let requestData = { contents: [{ role: "user", parts: [{ text: query }] }] };

    let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
    });

    let data = await response.json();

    if (data.error) {
        return `Error: ${data.error.message}`;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
}

// Function to append messages to chat box
function appendMessage(sender, text) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv;
}

// Save chat history in Local Storage
function saveMessage(sender, text) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ sender, text });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Load chat history from Local Storage
function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(({ sender, text }) => appendMessage(sender, text));
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle Enter key to send message
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
