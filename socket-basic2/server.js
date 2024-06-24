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

const cb = () => {
    console.log('My event');
};

io.on('connection', (socket) => {
    // 한번만 수신
    // socket.once('one time event', () => {
    //     console.log('Once');
    // });

    // --

    socket.on('my event', cb);
    socket.onAny((event, ...args) => {
        // 들어오는 모든 이벤트 감지
        console.log(`An event happend with the name ${event} and args ${args}`);
    });
    socket.on('stop my event', () => {
        // 이벤트 자체를  해제하는게 아닌 해당 이벤트의 특정 핸들러 해제
        // 채팅시 차단, 알림 차단 같은 경우에 유용
        socket.off('my event', cb);

        // 특정 이벤트에 대한 모든 핸들러 제거
        // 이벤트를 안넣으면 전부 제거
        // socket.removeAllListeners('my event')
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
