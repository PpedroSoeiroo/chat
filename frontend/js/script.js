const login = document.querySelector (".login")
const loginInform = login.querySelector (".login__form")
const loginInput = login.querySelector (".login__input")



const chat = document.querySelector (".chat")
const chatform = chat.querySelector (".chat__form")
const chatInput = chat.querySelector (".chat__input")
const chatMessages = chat.querySelector (".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornFlowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]


const user = {id:"", name: "", color: ""}

let websocket

const createMessageselfElement = (content) => {
    const div = document.createElement ("div")

    div.classList.add ("message--self")
    div.innerHTML = content;

    return div
}

const createMessageOtherElement =  (content, sender, senderColor) => {
    const div = document.createElement ('div')
    const span = document.createElement ("span")

    div.classList.add ("message--other")

    span.classList.add ("message--sender")
    span.style.color = senderColor

    div.appendChild (span)

    span.innerHTML = sender
    div.innerHTML = content

    return div

}

const getRandomColor = () => {
    const randomIndex = Math.floor (Math.random() * colors.length)
    return colors [randomIndex]
}


const scrollScreen = () => {
    window.scroll ( {
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}


const processMessage = ({data}) => {
    const {userid, userName, userColor, content} = JSON.parse (data)

    const message = userid == user.id
    ? createMessageselfElement(content)
    : createMessageOtherElement(content, userName, userColor);


    chatMessages.appenChild (message);

    scrollScreen ()

}


const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor ()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket ("wss://chat-mjcs.onrender.com")
    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userid: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send (JSON.stringify (message))

    chatInput.value = ""
}

loginInform.addEventListener("submit", handleLogin);
chatform.addEventListener("submit", sendMessage);
