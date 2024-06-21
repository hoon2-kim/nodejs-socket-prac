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
    // socket.on('update items', (arg1, arg2, ack) => {
    //     console.log(arg1); // 클라이언트로 부터 받은 첫번째 인자
    //     console.log(arg2); // 클라이언트로 부터 받은 두번째 인자
    //     ack('msg received successfully in the server, and items updated'); // 클라이언트에게 전송
    // });

    socket.on('my-event', (ack) => {
        console.log('My event');
        // ack('Msg Received');
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
