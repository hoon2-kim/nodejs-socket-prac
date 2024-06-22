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
    socket.on('ping', (count) => {
        console.log(count);
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// volatile events(휘발성 이벤트)은 네트워크 장애나 기타 이유로 인해 이벤트가 전달되지 않으면 이를
// 다시 시도하지 않는 이벤트 유형이다. 즉, 연결이 준비되지 않은 경우 전송되지 않는 이벤트이며 클라이언트가
// 아직 서버에 연결되지 않았거나 연결이 끊어진 경우 휘발성 이벤트는 전달되지 않는다.

// 유용한 경우
// 실시간 데이터 전송 : 현재 시장 가격, 게임 캐릭터 위치, 채팅 메시지 같이 실시간으로 데이터를 전송하는 경우 연결이 끊어진
// 클라이언트에게 이전 데이터를 다시 전송할 필요가 없으므로 유용하다.
// 그러니가 빈번한 업데이트가 필요한 경우, 데이터 유실이 큰 문제가 되지 않는 경우 유용하다.

// 주의 사항
// 휘발성 이벤트는 보장된 전달을 제공하지 않는다. 연결이 끊어진 후 다시 연결된 클라이언트는 놓친 이벤트를 받을 수 없다. 그러므로 중요한 데이터 전송에는 사용하지 않는다.
