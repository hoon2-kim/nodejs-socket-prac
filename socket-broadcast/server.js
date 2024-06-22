const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // 메시지를 보내는 주체를 제외하고 클라이언트들에게 보낸다.
    socket.broadcast.emit('message', 'Heyyy Guys');
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
