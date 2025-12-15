
import { createContext, useState, useEffect, ReactNode } from "react";

interface UserInfoContextType {
  user: any;
  setUser: (user: any) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const UserInfoContext = createContext<UserInfoContextType>({
  user: null,
  setUser: () => {},
  accessToken: null,
  setAccessToken: () => {},
  logout: () => {},
});

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("accessToken");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setAccessToken(savedToken);
  }, []);

  useEffect(() => {
    user
      ? localStorage.setItem("user", JSON.stringify(user))
      : localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    accessToken
      ? localStorage.setItem("accessToken", accessToken)
      : localStorage.removeItem("accessToken");
  }, [accessToken]);

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return (
    <UserInfoContext.Provider value={{ user, setUser, accessToken, setAccessToken, logout }}>
      {children}
    </UserInfoContext.Provider>
  );
};

