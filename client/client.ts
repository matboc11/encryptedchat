const io = require('socket.io-client');
const terminal = require('terminal-kit').terminal;
const socket = io.connect('http://localhost:8080', { reconnect: true });
const crypto = require('crypto');

let messages = [];
let name = '';
let connected = false;
let inputAbort = null;
let serverPublicKey = '';

socket.on('receive-message', details => receiveMessage(details['name'], details['message']));
socket.on('public-key', pubk => { 
    serverPublicKey = pubk;
    connected = true;
 });
socket.on('user-connected', name => receiveMessage('SYSTEM', 'User ' + name + ' has connected') );

terminal.on('key', function(name, _, _) 
{
    if (name === 'CTRL_C') 
    {
        terminal.grabInput(false); 
        setTimeout(function() { process.exit() } , 100); 
    }
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
    inputAbort = terminal.inputField({}, (_, msg) => sendMessage(name, msg));
}

async function init()
{
    terminal('Please enter your name: ');
    name = await terminal.inputField({}).promise;
    terminal.clear();
    terminal('Connecting ...');
    while (!connected);
    socket.emit('new-user', { name, publicKey: '' });
    refreshTerminal();
}

function sendMessage(user, message)
{
    messages.push({ name: user, message: message });

    socket.emit('send-chat-message', crypto.publicEncrypt(serverPublicKey, Buffer.from(message)).toString('base64'));
    refreshTerminal();
}

function receiveMessage(user, message)
{
    messages.push({ name: user, message: message });
    refreshTerminal();
}

init();
