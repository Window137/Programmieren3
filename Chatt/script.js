function main() {
    const socket = io();
    const chatDiv = document.getElementById('Chat');
    const input = document.getElementById('Nachricht');
    const button = document.getElementById('Senden');
    function handleSubmit(evt) {
        console.log("sending message")
        const val = input.value;
        if (val != "") {
            socket.emit("send message", val);
        }
    }
    button.onclick = handleSubmit;
    function handleMessage(msg) {
        console.log("handling message")
        const p = document.createElement('p');
        p.innerText = msg;
        chatDiv.appendChild(p);
        input.value = "";
    }
    socket.on('display message', handleMessage);
} 

window.onload = main;