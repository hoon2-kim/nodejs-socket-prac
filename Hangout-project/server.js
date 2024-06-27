const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3000;

app.use(express.static('client'));

let connectedUsers = {};

io.on('connection', (socket) => {
    socket.on('new user', (nickName) => {
        socket.nickName = nickName;

        connectedUsers[socket.id] = socket.nickName;

        console.log(`${nickName} has connected, his id is: ${socket.id}`);
        console.log('Connected Users', connectedUsers);

        socket.broadcast.emit('new user', nickName);
        io.emit('usersList', connectedUsers);
    });

    socket.on('group message', (nickName, msg) => {
        // 메시지를 보낸 사용자가 서버에 연결된 사용자와 동일한지 자동으로 감지
        socket.broadcast.emit('group message', nickName, msg);
    });

    socket.on('sendPrivateMsg', (senderId, recId, senderName, msg) => {
        socket.to(recId).emit('recPrivateMsg', senderId, senderName, msg);
    });

    socket.on('userIsTyping', (nickName) => {
        socket.broadcast.emit('userIsTyping', nickName);
    });

    socket.on('userIsNotTyping', () => {
        socket.broadcast.emit('userIsNotTyping');
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user left', socket.nickName);
        console.log(
            `${socket.nickName} has disconnected, his id is: ${socket.id}`
        );

        delete connectedUsers[socket.id];
        io.emit('usersList', connectedUsers);
        console.log('Connected Users', connectedUsers);
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// 개인 메시지 구현 플로우
