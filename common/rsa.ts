import { RsaPrivateKey, RsaPublicKey, privateDecrypt, publicEncrypt } from 'crypto';

export function encrypt(publicKey: string, message: string): string
{
    const messageBuffer: Buffer = Buffer.from(message);
    const messageBufferEncrypted: Buffer = publicEncrypt(publicKey, messageBuffer);
    return messageBufferEncrypted.toString('base64');
}

export function decrypt(privateKey: string, passphrase: string, message: string): string
{
    const msgBuffer: Buffer = Buffer.from(message, 'base64');
    const decryptedBuffer: Buffer = privateDecrypt({ key: privateKey.toString(), passphrase }, msgBuffer);
    return decryptedBuffer.toString('utf8');
}
