const io = require('socket.io')(8080);

let users = [];

io.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        io.emit('user-connected', name);
        console.log('User connected:', name);
    });

    socket.on('send-chat-message', message => {
        let payload = { message: message, name: users[socket.id] };
        socket.broadcast.emit('chat-message', payload);
        console.log(payload);
    });

    socket.on('disconnect', () => {
        io.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});