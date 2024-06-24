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
    socket.on('list items', async (callback) => {
        try {
            const items = await findItems();
            callback({
                status: 'OK',
                items,
            });
        } catch (e) {
            callback({
                status: 'NOT OK',
            });
        }
    });
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
