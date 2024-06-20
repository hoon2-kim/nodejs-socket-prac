const express = require('express');
const http = require('http'); // 기본적인 http서버와 클라이언트를 구현하기 위한 기능 제공
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app); // express를 기반으로 하는 http 서버 생성
const io = new Server(httpServer); // socket.io 서버를 http 서버에 연결
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 소켓이 연결될 때 마다
io.on('connection', (socket) => {
    // console.log(`a new user connected with id ${socket.id}`);
    // 클라이언트로 부터 message 이벤트를 받는다면
    socket.on('message', (msg) => {
        // 두번째 인자인 콜백함수를 이벤트 리스너라고 함
        console.log(msg);

        // 클라이언트로 보내는 이벤트(위의 이벤트이름과 같지만 다름)
        socket.emit('message', 'Hey client');
    });
});

httpServer.listen(port, () => {
    console.log(`listening on port ${port}`);
});
