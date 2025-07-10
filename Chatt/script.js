function main() {
    var socket = io();
    var chatDiv = document.getElementById('Chat');
    var input = document.getElementById('Nachricht');
    var button = document.getElementById('Senden');
    function handleSubmit(evt) {
        var val = input.value;
        if (val != "") {
            socket.emit("Nachricht senden", val);
        }
    }
    button.onclick = handleSubmit;
    function handleMessage(msg) {
        var p = document.createElement('p');
        p.innerText = msg;
        chatDiv.appendChild(p);
        input.value = "";
    }
    socket.on('Nachricht anzeigen', handleMessage);
} 

window.onload = main;