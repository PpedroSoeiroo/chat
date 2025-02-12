const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
];

const user = { id: "", name: "", color: "" };

let websocket;

const createMessageSelfElement = (content) => {
    const div = document.createElement("div");
    div.classList.add("message--self");
    div.innerHTML = content;
    return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message--other");

    span.classList.add("message--sender");
    span.style.color = senderColor;

    span.innerHTML = sender;
    div.appendChild(span);
    div.innerHTML += content;

    return div;
};

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const scrollScreen = () => {
    window.scroll({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
};

const processMessage = ({ data }) => {
    const { userid, userName, userColor, content } = JSON.parse(data);

    const message = userid === user.id
        ? createMessageSelfElement(content)
        : createMessageOtherElement(content, userName, userColor);

    chatMessages.appendChild(message);
    scrollScreen();
};

const createWebSocket = () => {
    websocket = new WebSocket("wss://chat-mjcs.onrender.com");

    websocket.onopen = () => {
        console.log("Conexão WebSocket aberta");
    };

    websocket.onmessage = processMessage;

    websocket.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
    };

    websocket.onclose = (event) => {
        console.log("Conexão WebSocket fechada:", event);
        // Tentar reconectar após 1 segundo
        setTimeout(createWebSocket, 1000);
    };
};

const handleLogin = (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value.trim();

    if (!user.name) {
        alert("Por favor, insira um nome.");
        return;
    }

    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    createWebSocket();
};

const sendMessage = (event) => {
    event.preventDefault();

    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket não está aberto. Não é possível enviar a mensagem.");
        return;
    }

    const message = {
        userid: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    };

    websocket.send(JSON.stringify(message));
    chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
