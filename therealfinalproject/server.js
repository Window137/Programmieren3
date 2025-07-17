const express = require('express');
const fs = require("fs");

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const messages = JSON.parse(fs.readFileSync("messages.json"));

app.use(express.static("./client"));

app.get('/', function (req, res) {
    res.redirect('index.html');
});

io.on('connection', function (socket) {
    console.log("connected")
    for (const i in messages) {
        io.sockets.emit("display message", messages[i]);
    }
    socket.on("send message", function (data) {
        console.log("recieving message")
        messages.push(data);
        fs.writeFileSync("messages.json", JSON.stringify(messages));
        io.sockets.emit("display message", data);
    });
});

server.listen(3000);