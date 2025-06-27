import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDecryptedCookie } from '../Utils/Cookie';

type UserData = {
  token: string;
  user_type: number;
  name?: string;
};

type UserContextType = {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUserFromCookie = () => {
    setLoading(true);
    try {
      const decrypted = getDecryptedCookie('user_data');
      if (decrypted) {
        const parsed = JSON.parse(decrypted);
        if (parsed?.token) {
          setUser(parsed);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to parse user_data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromCookie();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: loadUserFromCookie }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
