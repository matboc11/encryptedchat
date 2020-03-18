const io = require('socket.io')(8080);
const fs = require('fs');
const crypto = require('crypto');

let users = [];

const publicKey = fs.readFileSync('public.pem', 'utf8');
const privateKey = fs.readFileSync('private.pem', 'utf8');

io.on('connection', socket => 
{
    socket.emit('public-key', publicKey);

    socket.on('new-user', name => 
    {
        users[socket.id] = name;
        io.emit('user-connected', name);
        console.log('User connected:', name);
    });

    socket.on('send-chat-message', message => 
    {
        const msgBuffer = Buffer.from(message, 'base64');
        const decryptedBuffer = crypto.privateDecrypt({ key: privateKey, passphrase: '1234' }, msgBuffer);
        const decryptedMsg = decryptedBuffer.toString('utf8');
        let payload = { message: decryptedMsg, name: users[socket.id] };
        socket.broadcast.emit('chat-message', payload);
        console.log(payload);
    });

    socket.on('disconnect', () => 
    {
        io.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});
