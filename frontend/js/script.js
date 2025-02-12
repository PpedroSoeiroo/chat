const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const emojiButton = document.querySelector(".emoji-button");
const emojiPicker = document.querySelector(".emoji-picker");

const colors = ["#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#6610f2"];
const user = { id: "", name: "", color: "" };
let websocket;

// Função para criar mensagens
const createMessageElement = (content, sender, isSelf) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", isSelf ? "message--self" : "message--other");

    const senderSpan = document.createElement("span");
    senderSpan.classList.add("message--sender");
    senderSpan.style.color = user.color;
    senderSpan.textContent = sender;

    const contentDiv = document.createElement("div");
    contentDiv.textContent = content;

    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(contentDiv);

    return messageDiv;
};

// Função para rolar a tela para a última mensagem
const scrollToBottom = () => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Função para processar mensagens recebidas
const processMessage = (data) => {
    const { userid, userName, content } = JSON.parse(data);
    const isSelf = userid === user.id;
    const messageElement = createMessageElement(content, userName, isSelf);
    chatMessages.appendChild(messageElement);
    scrollToBottom();
};

// Função para enviar mensagens
const sendMessage = (event) => {
    event.preventDefault();

    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
        alert("Conexão não estabelecida. Tente novamente.");
        return;
    }

    const content = chatInput.value.trim();
    if (!content) return;

    const message = {
        userid: user.id,
        userName: user.name,
        content: content,
    };

    websocket.send(JSON.stringify(message));
    chatInput.value = "";
};

// Função para abrir/fechar o seletor de emojis
emojiButton.addEventListener("click", (event) => {
    event.preventDefault();
    emojiPicker.style.display = emojiPicker.style.display === "none" ? "block" : "none";
});

// Função para adicionar emojis ao campo de entrada
emojiPicker.addEventListener("emoji-click", (event) => {
    chatInput.value += event.detail.unicode;
    emojiPicker.style.display = "none";
});

// Função para fechar o seletor de emojis ao clicar fora
document.addEventListener("click", (event) => {
    if (!emojiButton.contains(event.target) && !emojiPicker.contains(event.target)) {
        emojiPicker.style.display = "none";
    }
});

// Função para lidar com o login
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value.trim();
    user.color = colors[Math.floor(Math.random() * colors.length)];

    if (!user.name) {
        alert("Por favor, insira um nome.");
        return;
    }

    login.style.display = "none";
    chat.style.display = "flex";

    // Simulação de WebSocket (substitua por um servidor real)
    websocket = new WebSocket("wss://seuservidor.com");
    websocket.onmessage = (event) => processMessage(event.data);
});

// Função para enviar mensagens ao enviar o formulário
chatForm.addEventListener("submit", sendMessage);