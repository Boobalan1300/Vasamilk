import { getDecryptedCookie } from "../Utils/Cookie";

interface UserData {
  token: string;
  user_id: number;
  user_name: string;
  user_type: number;
  distributor_id?: number;
}

export const useUser = (): UserData | null => {
  const decrypted = getDecryptedCookie("user_data");
  const parsed: UserData | null = decrypted ? JSON.parse(decrypted) : null;
  return parsed;
};

export const useToken = (): string | null => {
  const decrypted = getDecryptedCookie("user_data");
  const parsed = decrypted ? JSON.parse(decrypted) : null;
  return parsed?.token || null;
};

export const useUserType = (): number | null => {
  const decrypted = getDecryptedCookie("user_data");
  const parsed = decrypted ? JSON.parse(decrypted) : null;
  return parsed?.user_type ?? null;
};
