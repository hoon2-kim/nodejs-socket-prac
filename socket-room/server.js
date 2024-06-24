const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('join programming', () => {
        socket.join('programming');
        console.log('programming room:👇');
        console.log(io.sockets.adapter.rooms.get('programming'));
    });
    socket.on('join data structures', () => {
        socket.join('data structures');
        console.log('data structures room:👇');
        console.log(io.sockets.adapter.rooms.get('data structures'));
    });
    socket.on('join networks', () => {
        socket.join('networks');
        console.log('networks room:👇');
        console.log(io.sockets.adapter.rooms.get('networks'));
    });
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});

// room이란?
// socket.io에서 room은 여러 소켓들이 참여(join)하고 떠날 수 있는(leave) 채널을 말한다.
// room은 모든 클라이언트가 아니라, 일부 클라이언트에게 이벤트를 전송할 때 사용된다.
// room은 서버에서만 사용될 수 있는 개념이다.
