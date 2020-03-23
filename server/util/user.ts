import { RsaPublicKey } from 'crypto';

export interface User
{
    socketId: number,
    name: string,
    publicKey: RsaPublicKey
}
