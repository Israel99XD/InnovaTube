// src/app/utils/crypto.util.ts
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'misecret123ñ$'; // cámbiala por algo más seguro

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
