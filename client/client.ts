const io = require('socket.io-client');
const socket = io.connect('http://localhost:8080', { reconnect: true });

const terminal = require('terminal-kit').terminal;
import { RsaPublicKey, RsaPrivateKey, generateKeyPairSync, createPublicKey } from 'crypto';
import { encrypt, decrypt } from '../common/rsa';
import { NewUserMsg, PublicKeyMsg, ReceiveMessageMsg, SendMessageMsg } from './util/protocol';

let messages = [];
let connected = false;
let inputAbort = null;
let serverPublicKey: string = '';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: '1234'
    }
});

terminal.on('key', (name) => {
    if (name !== 'CTRL_C') return;
    terminal.grabInput(false); 
    setTimeout(() => process.exit(), 100); 
});

socket.on('receive-message', (receiveMessageMsg: ReceiveMessageMsg) => {
    receiveMessage(receiveMessageMsg.name, receiveMessageMsg.message);
});

socket.on('public-key', (publicKeyMsg: PublicKeyMsg) => { 
    serverPublicKey = publicKeyMsg.publicKey;
    connected = true;
});

socket.on('user-connected', (name) => {
    messages.push({ name: 'SYSTEM', message: 'User ' + name + ' has connected' });
    refreshTerminal();
});

socket.on('user-disconnected', (name) => {
    messages.push({ name: 'SYSTEM', message: 'User ' + name + ' has disconnected' });
    refreshTerminal();
});

function refreshTerminal()
{
    terminal.clear();
    if (inputAbort) inputAbort.abort();

    for (let i = messages.length - terminal.height + 1; i < messages.length; i++)
    {
        if (i >= 0) terminal(messages[i].name + ': ' + messages[i].message);
        terminal('\n');
    }

    terminal('Write a message: ');
    inputAbort = terminal.inputField({}, (_, msg) => sendMessage(msg));
}

function sendMessage(message)
{
    const sendMessageMsg: SendMessageMsg = { message: encrypt(serverPublicKey, message) };
    socket.emit('send-message', sendMessageMsg);
    refreshTerminal();
}

function receiveMessage(user, message)
{
    messages.push({ name: user, message: decrypt(privateKey, '1234', message) });
    refreshTerminal();
}

async function init()
{
    terminal('Please enter your name: ');
    const name = await terminal.inputField({}).promise;
    terminal.clear();
    terminal('Connecting ...');
    while (!connected);
    const newUserMsg: NewUserMsg = { name, publicKey };
    socket.emit('new-user', newUserMsg);
    refreshTerminal();
}

init();
