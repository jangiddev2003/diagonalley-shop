// ============================================
// AUTH CONTEXT  (Global Authentication State)
// ============================================
// Provides auth state + sorting hat + avatar update to the entire app.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, userApi, ApiUser } from '@/services/api';

// ── Types ────────────────────────────────────────────────────────────

interface AuthContextType {
  user:             ApiUser | null;
  token:            string | null;
  isLoading:        boolean;
  isAuthenticated:  boolean;
  login:            (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register:         (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout:           () => void;
  updateAvatar:     (avatar: string) => Promise<{ success: boolean; message: string }>;
  updateProfile:    (username: string) => Promise<{ success: boolean; message: string }>;
  runSortingHat:    () => Promise<{ success: boolean; house?: string; alreadySorted?: boolean; message: string }>;
  refreshUser:      () => Promise<void>;
}

interface RegisterData {
  username:    string;
  email:       string;
  password:    string;
  phoneNumber?: string;
}

// ── Context ──────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'diagonalley-token';

// ── Provider ─────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,      setUser]      = useState<ApiUser | null>(null);
  const [token,     setToken]     = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // ── Persist token ─────────────────────────────────────────────────
  const persistToken = (t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  // ── Verify token on load / token change ──────────────────────────
  useEffect(() => {
    const verify = async () => {
      if (!token) { setIsLoading(false); return; }

      try {
        const data = await authApi.me(token);
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── LOGIN ─────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password);
      if (data.success && data.token && data.user) {
        persistToken(data.token);
        setUser(data.user);
      }
      return { success: data.success, message: data.message };
    } catch {
      return { success: false, message: 'Unable to connect to the server. Is the backend running?' };
    }
  };

  // ── REGISTER ──────────────────────────────────────────────────────
  const register = async ({ username, email, password, phoneNumber }: RegisterData) => {
    try {
      const data = await authApi.register(username, email, password, phoneNumber);
      if (data.success && data.token && data.user) {
        persistToken(data.token);
        setUser(data.user);
      }
      return { success: data.success, message: data.message };
    } catch {
      return { success: false, message: 'Unable to connect to the server. Is the backend running?' };
    }
  };

  // ── LOGOUT ───────────────────────────────────────────────────────
  const logout = () => {
    clearAuth();
    authApi.logout(); // fire-and-forget
  };

  // ── UPDATE AVATAR ─────────────────────────────────────────────────
  const updateAvatar = async (avatar: string) => {
    if (!token) return { success: false, message: 'Not authenticated.' };
    try {
      const data = await userApi.updateAvatar(token, avatar);
      if (data.success && data.user) setUser(data.user);
      return { success: data.success, message: data.message };
    } catch {
      return { success: false, message: 'Failed to update avatar.' };
    }
  };

  // ── UPDATE PROFILE ────────────────────────────────────────────────
  const updateProfile = async (username: string) => {
    if (!token) return { success: false, message: 'Not authenticated.' };
    try {
      const data = await userApi.updateProfile(token, username);
      if (data.success && data.user) setUser(data.user);
      return { success: data.success, message: data.message };
    } catch {
      return { success: false, message: 'Failed to update profile.' };
    }
  };

  // ── SORTING HAT CEREMONY ──────────────────────────────────────────
  // Calls backend to permanently assign a random house (server-side).
  // Idempotent — safe to call multiple times; subsequent calls return existing house.
  const runSortingHat = async () => {
    if (!token) return { success: false, message: 'Not authenticated.' };
    try {
      const data = await userApi.sort(token);
      if (data.success && data.user) setUser(data.user);
      return {
        success:      data.success,
        house:        data.house,
        alreadySorted: data.alreadySorted,
        message:      data.message,
      };
    } catch {
      return { success: false, message: 'Failed to contact the Sorting Hat.' };
    }
  };

  // ── REFRESH USER ──────────────────────────────────────────────────
  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await userApi.getProfile(token);
      if (data.success && data.user) setUser(data.user);
    } catch { /* silent */ }
  };

  return (
    <AuthContext.Provider
      value={{
        user, token, isLoading, isAuthenticated,
        login, register, logout,
        updateAvatar, updateProfile, runSortingHat, refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
