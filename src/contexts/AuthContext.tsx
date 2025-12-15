import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  secretKey: string | null;
  authenticate: (key: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [secretKey, setSecretKey] = useState<string | null>(null);

  // 初始化时检查localStorage中的密钥
  useEffect(() => {
    const storedKey = localStorage.getItem("supabase_secret_key");
    if (storedKey) {
      setSecretKey(storedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // 验证密钥是否有效
  const authenticate = async (key: string): Promise<boolean> => {
    try {
      // 通过API端点验证密钥
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secretKey: key }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 验证成功，存储密钥
        localStorage.setItem("supabase_secret_key", key);
        setSecretKey(key);
        setIsAuthenticated(true);
        return true;
      } else {
        console.error("认证失败:", result.error);
        return false;
      }
    } catch (error) {
      console.error("认证失败:", error);
      return false;
    }
  };

  // 登出，清除密钥
  const logout = () => {
    localStorage.removeItem("supabase_secret_key");
    setSecretKey(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        secretKey,
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
