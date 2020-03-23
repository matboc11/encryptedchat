import { RsaPublicKey } from 'crypto';

export interface Protocol_NewUser
{
    name: string,
    publicKey: RsaPublicKey
}
