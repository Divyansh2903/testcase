"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi, type AuthUser } from "./api";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    await authApi.signOut();
    setUser(null);
  }, []);

  useEffect(() => {
    authApi
      .getUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signOut, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
