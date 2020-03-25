const io = require('socket.io')(8080);
const fs = require('fs');

import { encrypt, decrypt } from '../common/rsa';
import { User } from './util/user';
import { NewUserMsg, PublicKeyMsg, ReceiveMessageMsg, SendMessageMsg } from './util/protocol';

let users: User[] = [];

const publicKey: string = fs.readFileSync('public.pem', 'utf8');
const privateKey: string = fs.readFileSync('private.pem', 'utf8');

io.on('connection', socket => 
{
    const publicKeyMsg: PublicKeyMsg = { publicKey };
    socket.emit('public-key', publicKeyMsg);

    socket.on('new-user', (newUserMsg: NewUserMsg) =>
    {
        const user: User = { socketId: socket.id, name: newUserMsg.name, publicKey: newUserMsg.publicKey };
        users.push(user);

        io.emit('user-connected', user.name);
        console.log('User connected: ' + user.name);
    });

    socket.on('send-message', (sendMessageMsg: SendMessageMsg) => 
    {
        const sender = users.find((e) => e.socketId === socket.id);
        if (!sender) return;
        const decryptedMessage = decrypt(privateKey, '1234', sendMessageMsg.message);

        for (const user of users)
        {
            const receiveMessageMsg: ReceiveMessageMsg = { 
                name: sender.name, 
                message: encrypt(sender.publicKey, decryptedMessage)
            };
            io.to(`${user.socketId}`).emit('receive-message', receiveMessageMsg);
        }

        console.log(sender.name + ': ' + decryptedMessage);
    });

    socket.on('disconnect', () => 
    {
        const senderIdx = users.findIndex((e) => e.socketId === socket.id);
        if (!users[senderIdx]) return;
        io.emit('user-disconnected', users[senderIdx].name);
        console.log('User disconnected: ' + users[senderIdx].name);
        users.splice(senderIdx, 1);
    });
});
