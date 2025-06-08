// lib/auth.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api, { setToken } from "./api";
import { useRouter } from "next/navigation";
import { Token } from "@/types/auth";

// mirror your back-end /auth/me shape
export type User = {
  id: string;
  role: "owner" | "administrator" | "collaborator" | "standard";
  company_id: string | null;
  email: string;
  card_full_name?: string | null;
  card_email?: string | null;
  card_mobile_phone?: string | null;
  card_job_title?: string | null;
  card_office_phone?: string | null;
  card_web?: string | null;
};

interface AuthState {
  user: User | null;
  login(email: string, password: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  // on mount: try to rehydrate from localStorage
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);
        try {
          const { data } = await api.get<User>("/auth/me");
          setUser(data);
        } catch {
          // invalid / expired
          setToken(undefined);
          localStorage.removeItem("token");
        }
      }
      setInitializing(false);
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    // OAuth2 password grant
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const { data: tok } = await api.post<Token>(
      "/auth/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // store & apply
    localStorage.setItem("token", tok.access_token);
    setToken(tok.access_token);

    // fetch profile
    const { data: me } = await api.get<User>("/auth/me");
    setUser(me);

    router.replace("/batches");
  };

  const logout = () => {
    setToken(undefined);
    localStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
  };

  if (initializing) {
    // or show a spinner
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be inside <AuthProvider>");
  }
  return ctx;
}
