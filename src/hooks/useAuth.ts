import { useState, useEffect } from "react";
import type { AdminAuth } from "@/types";

const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "admin";

export const useAuth = () => {
  const [auth, setAuth] = useState<AdminAuth>({
    isAuthenticated: false,
    login: "",
  });

  useEffect(() => {
    const savedAuth = localStorage.getItem("adminAuth");
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      const authData = { isAuthenticated: true, login: username };
      setAuth(authData);
      localStorage.setItem("adminAuth", JSON.stringify(authData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, login: "" });
    localStorage.removeItem("adminAuth");
  };

  return { auth, login, logout };
};
