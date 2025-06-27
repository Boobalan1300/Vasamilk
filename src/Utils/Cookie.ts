import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { SECRET_KEY } from "../../public/config";



export const setEncryptedCookie = (
  key: string,
  value: string | object,
  expiresInMinutes?: number
): void => {
  try {
    const plainText = typeof value === "string" ? value : JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();

    Cookies.set(key, encrypted, {
      expires: expiresInMinutes ? expiresInMinutes / (24 * 60) : 7, 
      secure: true,
      sameSite: "Strict",
    });
  } catch (error) {
    console.error(`Error setting encrypted cookie [${key}]`, error);
  }
};


export const getDecryptedCookie = (key: string): string | null => {
  const encrypted = Cookies.get(key);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    console.error(`Error decrypting cookie [${key}]`, error);
    return null;
  }
};

export const clearCookie = (key: string): void => {
  try {
    Cookies.remove(key);
  } catch (error) {
    console.error(`Error clearing cookie [${key}]`, error);
  }
};

export interface ParsedUser {
  token: string;
  [key: string]: any;
}


export const getUser = (): ParsedUser | null => {
  try {
    const decrypted = getDecryptedCookie("user_data") || "";
    const parsed = JSON.parse(decrypted);
    if (parsed?.token) {
   
      return parsed;
    }
    return null;
  } catch (err) {
    console.error("Failed to parse user data from cookie:", err);
    return null;
  }
};