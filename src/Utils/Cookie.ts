import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { SECRET_KEY } from "../../public/config";

export const setEncryptedCookie = (
  key: string,
  value: string | object,
  expiresInMinutes?: number
): void => {
  const plainText = typeof value === "string" ? value : JSON.stringify(value);
  const encrypted = CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();

  Cookies.set(key, encrypted, {
    expires: expiresInMinutes ? expiresInMinutes / (24 * 60) : 7, // default - 7 days
    secure: true,
    sameSite: "Strict",
  });
};


export const getDecryptedCookie = (key: string): string | null => {
  const encrypted = Cookies.get(key);
  if (!encrypted) return null;

  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  // console.log("done",decrypted)
  return decrypted || null;
};



export const clearCookie = (key: string): void => {
  Cookies.remove(key);
};


