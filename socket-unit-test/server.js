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

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', (socket) => {});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});

// namespace란?
// express의 라우팅처럼 url에 지정된 위치에 따라 신호의 처리를 다르게 하는 기술
// 기본 네임스페이스는 '/'이다. 모든 클라이언트는 기본적으로 이 네임스페이스에 연결된다.
// 커스텀 네임스페이스를 생성할 수 있다.
