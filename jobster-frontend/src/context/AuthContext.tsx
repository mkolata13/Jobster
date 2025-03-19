import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isLoggedIn: boolean;
  roles: string[] | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

interface JwtPayload {
  username?: string;
  roles: string[];
  exp?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [roles, setRoles] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setRoles(decoded.roles || []);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("jwt", token);
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setIsLoggedIn(true);
      setRoles(decoded.roles || []);
    } catch (error) {
      console.error("Token decoding error:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setRoles(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, roles, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
