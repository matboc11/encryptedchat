const crypto = require('crypto');

function encrypt(publicKey, message)
{
    const messageBuffer = Buffer.from(message);
    const messageBufferEncrypted = crypto.publicEncrypt(publicKey, messageBuffer);
    return messageBufferEncrypted.toString('base64');
}

function decrypt(privateKey, passphrase, message)
{
    const msgBuffer = Buffer.from(message, 'base64');
    const decryptedBuffer = crypto.privateDecrypt({ key: privateKey, passphrase }, msgBuffer);
    return decryptedBuffer.toString('utf8');
}

export default {
    encrypt, decrypt
};
