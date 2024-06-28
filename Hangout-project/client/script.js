const socket = io();

const usersTalkingPrivately = {};

const messaging = (msgsArea, name, msg) => {
    const item = document.createElement('li'); // 새 li 요소를 생성
    item.textContent = `${name}: ${msg}`; // 새로운 li 요소의 텍스트 내용을 msg로 설정
    msgsArea.appendChild(item); // 새로운 메시지를 자식으로 추가
    window.scrollTo(0, document.body.scrollHeight); // 페이지를 맨 아래로 스크롤
};

const displayConnectionStatus = (nickName) => {
    const connectionStatus = document.getElementById('connectionStatus');
    connectionStatus.innerText = `Hello ${nickName} you connected Successfully`;
};

socket.on('connect', () => {
    socket.nickName = prompt('Enter Your Name');
    displayConnectionStatus(socket.nickName);
    socket.emit('new user', socket.nickName);

    console.log(`A user connected with id ${socket.id}`);

    const messages = document.getElementById('messages');
    const form = document.getElementById('grpMsgForm');
    const input = document.getElementById('grpMsgInput');

    form.onsubmit = (e) => {
        e.preventDefault();
        if (input.value) {
            const msg = input.value;
            messaging(messages, 'ME', msg);
            socket.emit('group message', socket.nickName, msg);
        }
        input.value = '';
    };

    input.oninput = () => {
        socket.emit('userIsTyping', socket.nickName);
    };

    input.onchange = () => {
        socket.emit('userIsNotTyping');
    };

    socket.on('new user', (nickName) => {
        alert(`${nickName} has joined the Chat`);
    });

    socket.on('group message', (nickname, msg) => {
        messaging(messages, nickname, msg);
    });

    socket.on('usersList', (users) => {
        const connectedUsers = document.getElementById('connectedUsers');
        connectedUsers.innerHTML = '';
        for (const id in users) {
            const nickName = users[id];
            const user = document.createElement('li');
            user.innerText = nickName;

            connectedUsers.appendChild(user);

            const sendMsgBtn = document.createElement('button');
            sendMsgBtn.innerText = `Send Private message to ${nickName}`;
            const cantSendMsg = document.createElement('span');
            cantSendMsg.innerText = `Can't Send a message to yourself`;
            if (id !== socket.id) {
                connectedUsers.appendChild(sendMsgBtn);
            } else {
                // 본인
                connectedUsers.appendChild(cantSendMsg);
            }

            // 개인메시지
            const privateMsgs = document.getElementById('privateMsgs');
            sendMsgBtn.onclick = () => {
                // 이미 대화 중인지 확인
                if (!usersTalkingPrivately[id]) {
                    usersTalkingPrivately[id] = nickName;
                    const privMsgArea = document.createElement('ul');
                    privMsgArea.id = id; // 생성된 ul의 id 설정
                    privMsgArea.classList.add('privMsg'); // privMsgArea 요소에 privMsg 클래스를 추가하여 CSS 스타일 적용할 수 있게
                    const privHeading = document.createElement('h1');
                    const input = document.createElement('input');
                    const sendBtn = document.createElement('button');
                    sendBtn.type = 'submit';
                    sendBtn.innerText = 'Send';
                    privHeading.innerText = `Private messages between you and ${nickName}`;
                    privMsgArea.appendChild(privHeading); // 제목 요소를 개인 메시지 영역에 추가
                    privMsgArea.appendChild(input); // 입력 필드를 개인 메시지 영역에 추가
                    privMsgArea.appendChild(sendBtn); // 전송 버튼을 개인 메시지 영역에 추가
                    privateMsgs.appendChild(privMsgArea); // 개인 메시지 영역을 전체 메시지 컨테이너에 추가

                    // 첫 메시지 이후로 주고받을 때는 send버튼을 누르기 때문에 위의 if문은 상관이없다.
                    sendBtn.onclick = (e) => {
                        e.preventDefault();
                        const msg = input.value;
                        socket.emit(
                            'sendPrivateMsg',
                            socket.id, // 나(socket.id)
                            id, // 상대(socket.id)
                            socket.nickName, // 상대 닉네임
                            msg
                        );
                        const msgArea = document.getElementById(id);
                        messaging(msgArea, 'ME', msg);
                        input.value = '';
                    };
                } else {
                    alert(`You are already talking with ${nickName}`);
                }
            };
        }
    });

    socket.on('recPrivateMsg', (senderId, senderName, msg) => {
        // 개인 메시지 받은 사람이 처음 받는다면
        if (!usersTalkingPrivately[senderId]) {
            usersTalkingPrivately[senderId] = senderName;
            const privMsgArea = document.createElement('ul');
            privMsgArea.id = senderId;
            privMsgArea.classList.add('privMsg');
            const privHeading = document.createElement('h1');
            const input = document.createElement('input');
            const sendBtn = document.createElement('button');
            sendBtn.type = 'submit';
            sendBtn.innerText = 'send';
            privHeading.innerText = `Private messages between you and ${senderName}`;
            privMsgArea.appendChild(privHeading);
            privMsgArea.appendChild(input);
            privMsgArea.appendChild(sendBtn);
            privateMsgs.appendChild(privMsgArea);
            messaging(privMsgArea, senderName, msg);

            sendBtn.onclick = (e) => {
                e.preventDefault();
                const msg = input.value;
                const msgArea = document.getElementById(senderId);
                messaging(msgArea, 'ME', msg);
                socket.emit(
                    'sendPrivateMsg',
                    socket.id,
                    senderId,
                    socket.nickName,
                    msg
                );
                input.value = '';
            };
        } else {
            const msgArea = document.getElementById(senderId);
            messaging(msgArea, senderName, msg);
        }
    });

    socket.on('userIsTyping', (nickName) => {
        const typing = document.getElementById('typingStatus');
        typing.innerText = `${nickName} is typing`;
    });

    socket.on('userIsNotTyping', () => {
        const typing = document.getElementById('typingStatus');
        typing.innerText = '';
    });

    socket.on('user left', (userNickName) => {
        alert(`${userNickName} Has left the Chat`);
    });
});
