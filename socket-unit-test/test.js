// Mocha

// const { createServer } = require('http');
// const { Server } = require('socket.io'); // socket.io 서버
// const Client = require('socket.io-client'); // socket.io 클라이언트
// const assert = require('chai').assert;

// describe('testing our project', () => {
//     let io, serverSocket, clientSocket;

//     before((done) => {
//         const httpServer = createServer(); // http 서버 생성
//         io = new Server(httpServer); // socket.io 서버 생성(http 서버 기반)
//         httpServer.listen(() => {
//             const port = httpServer.address().port; // port 자동 할당
//             clientSocket = new Client(`http://localhost:${port}`);
//             io.on('connection', (socket) => {
//                 serverSocket = socket;
//             });
//             clientSocket.on('connect', done);
//         });
//     });

//     it('should work', (done) => {
//         clientSocket.on('hello', (arg) => {
//             // test
//             assert.equal(arg, 'world');
//             done(); // 완료 콜백 함수
//         });
//         serverSocket.emit('hello', 'world');
//     });

//     it('should work [with ack]', (done) => {
//         serverSocket.on('hi', (cb) => {
//             cb('hola');
//         });
//         clientSocket.emit('hi', (ack) => {
//             assert.equal(ack, 'hola');
//             done();
//         });
//     });

//     after(() => {
//         io.close();
//         clientSocket.close();
//     });
// });

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

// jest

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

describe('my awesome project', () => {
    let io, serverSocket, clientSocket;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            io.on('connection', (socket) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test('should work', (done) => {
        clientSocket.on('hello', (arg) => {
            expect(arg).toBe('world');
            done();
        });
        serverSocket.emit('hello', 'world');
    });

    test('should work (with ack)', (done) => {
        serverSocket.on('hi', (cb) => {
            cb('hola');
        });
        clientSocket.emit('hi', (arg) => {
            expect(arg).toBe('hola');
            done();
        });
    });
});
