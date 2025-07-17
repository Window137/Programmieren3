const express = require('express');
const fs = require("fs");

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const gameState = [];

app.use(express.static("./client"));

app.get('/', function (req, res) {
    res.redirect('index.html');
});

io.on('connection', function (socket) {
    console.log("connected")
    socket.on("send message", function (data) {
        console.log("recieving message")
        gameState.push(data);
        fs.writeFileSync("gameState.json", JSON.stringify(gameState));
    });
});

server.listen(3000);