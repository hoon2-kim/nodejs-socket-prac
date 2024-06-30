const grpNsP = '/privgroup';
const grpSocket = io(grpNsP);

const messaging = (msgsArea, name, msg) => {
    const item = document.createElement('li');
    item.textContent = `${name}: ${msg}`;
    msgsArea.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
};

const displayConnectionStatus = (nickName) => {
    const connectionStatus = document.getElementById('connectionStatus');
    connectionStatus.innerText = `Hello ${nickName} you connected Successfully`;
};

const leaveGrp = (socket, grpName) => {
    let answer = prompt(
        `${socket.nickName} Are you sure you want to leave ${grpName} Group ??  \n Answer with yes or no`
    );
    while (
        answer !== 'yes' &&
        answer !== 'Yes' &&
        answer !== 'No' &&
        answer !== 'no'
    ) {
        alert('Invalid answer!!, Try again');
        answer = prompt(
            `${socket.nickName} Are you sure you want to leave ${grpName} Group ??  \n Answer with yes or no`
        );
    }

    if (answer === 'yes' || answer === 'Yes') {
        socket.disconnect();
        alert(
            `${socket.nickName} You left ${grpName} Successfully \n If you want  to rejoin the group just open the group link again`
        );
    } else if (answer === 'no' || answer === 'No') {
        alert(`Okay great you are still in ${grpName} Group`);
    }
};

grpSocket.on('connect', () => {
    console.log(
        `A new user connected to the group namespace and his id is ${grpSocket.id}`
    );

    grpSocket.emit('send grp id', grpID);
    grpSocket.nickName = prompt('What is your name?');
    displayConnectionStatus(grpSocket.nickName);

    grpSocket.emit(
        'send user name and grp name',
        grpSocket.nickName,
        grpID,
        grpName
    );

    grpSocket.emit('new user', grpSocket.nickName, grpID);
    grpSocket.on('new user', (nickName) => {
        alert(`${nickName} Has joined the chat`);
    });

    grpSocket.on('users list', (users) => {
        const connectedUsers = document.getElementById('connectedUsers');
        connectedUsers.innerHTML = '';
        for (const id in users) {
            const nickName = users[id];
            const user = document.createElement('li');
            user.innerText = nickName;
            connectedUsers.appendChild(user);
        }
    });

    const messages = document.getElementById('messages');
    const form = document.getElementById('grpMsgForm');
    const input = document.getElementById('grpMsgInput');
    form.onsubmit = (e) => {
        e.preventDefault();
        if (input.value) {
            const msg = input.value;
            messaging(messages, 'ME', msg);
            grpSocket.emit('group message', grpSocket.nickName, msg, grpID);
            input.value = '';
        }
    };

    grpSocket.on('group message', (nickName, msg) => {
        messaging(messages, nickName, msg);
    });

    grpSocket.on('user left', (nickName) => {
        alert(`${nickName} Has left the Group`);
    });

    const leaveGrpBtn = document.getElementById('leaveGrp');
    leaveGrpBtn.onclick = () => {};
});
