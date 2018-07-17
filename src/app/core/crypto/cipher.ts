/**
 * 
 */
import { sjcl } from '../thirdparty/sjcl';

export class Cipher {
    private config: any;

    // We prefer the default config
    constructor(mode?: string, iter?: number, adata?: string, keySize?: number, tagSize?: number) {
        this.config = {
            adata: adata || '',
            iter: iter || 10000,
            mode: mode || 'ccm',
            keySize: keySize || 128,
            tagSize: tagSize || 64
        };
    }

    /**
     * Encrypt the plain text, returning a JSON string
     * 
     * @param  passwd Password used to encrypt the plainText
     * @param  plainText Text to be encrypted
     * @returns  JSON string
     */
    public encrypt(passwd: string, plainText: string): string {
        return sjcl.encrypt(passwd, plainText, this.config);
    }

    /**
     * Decypt the encrypted text by `encrypt` method
     * 
     * @param  passwd Password to decrypt the cipherText
     * @param  cipherText Text to be decrypted. Generated by `encrypt` method
     * @returns  Decrypted plain text
     */
    public decrypt(passwd: string, cipherText: string): string {
        return sjcl.decrypt(passwd, cipherText);
    }

    /**
     * sha256
     */
    public sha256(data: string) {
        return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(data));
    }
}