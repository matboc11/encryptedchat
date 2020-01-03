const io = require('socket.io-client');
const question = async a =>
    new Promise(b => {
        const c = require('readline').createInterface({ input: process.stdin, output: process.stdout });
        c.question(a, a => (c.close() ? '' : b(a)));
    });

async function handleMessage(socket) {
    let message = await question('You:');
    socket.emit('send-chat-message', message);

    if (message === '!quit') {
        return false; // quit the application
    }
}

async function init() {
    const name = await question('Please enter your name: ');
    const socket = io.connect('http://localhost:8080', { reconnect: true });

    socket.on('connect', () => {
        console.log('Connected');
        socket.emit('new-user', name);
    });

    socket.on('chat-message', details => console.log(details['name'] + ': ' + details['message']));

    while ((await handleMessage(socket)) !== false);
}

init();