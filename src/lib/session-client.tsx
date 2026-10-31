"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types/api";
import { request } from "./client-api";
const AuthContext = createContext<{ user: User | null; refresh: () => Promise<void>; logout: () => Promise<void> }>({ user: null, refresh: async () => {}, logout: async () => {} });
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  async function refresh() { try { setUser((await request<{ user: User | null }>("/api/auth/me")).user); } catch { setUser(null); } }
  async function logout() { await request("/api/auth/logout", {}); setUser(null); }
  useEffect(() => { void refresh(); }, []);
  return <AuthContext.Provider value={{ user, refresh, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
