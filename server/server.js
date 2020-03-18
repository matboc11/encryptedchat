const io = require('socket.io')(8080);
const fs = require('fs');
const {encrypt, decrypt} = require('../util/rsa');

let users = [];

const publicKey = fs.readFileSync('public.pem', 'utf8');
const privateKey = fs.readFileSync('private.pem', 'utf8');

io.on('connection', socket => 
{
    socket.emit('public-key', publicKey);

    socket.on('new-user', data =>
    {
        users[socket.id] = data;
        io.emit('user-connected', data.name);
        console.log('User connected:', data);
    });

    socket.on('send-chat-message', message => 
    {
        const payload = { message: decrypt(privateKey, '1234', message), name: users[socket.id].name };

        // For every client -> encrypt with clients public key and send
        socket.broadcast.emit('chat-message', payload);

        console.log(payload);
    });

    socket.on('disconnect', () => 
    {
        io.emit('user-disconnected', users[socket.id].name);
        delete users[socket.id];
    });
});
