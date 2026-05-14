// ============================================
// API SERVICE LAYER  (src/services/api.ts)
// ============================================
// Centralised place for all HTTP calls to the backend.
// Components should import these functions instead of calling fetch() directly.
//
// HOW THE API BASE URL WORKS PER ENVIRONMENT:
//
// 1. LOCAL DEVELOPMENT (npm run dev:all):
//    - VITE_API_URL is NOT set → API_BASE = '' (empty string)
//    - fetch('/api/...') calls are relative → Vite's proxy in vite.config.ts
//      intercepts them and forwards to http://127.0.0.1:5000 → no CORS issues
//
// 2. PRODUCTION (Vercel frontend + Render backend):
//    - VITE_API_URL is set in Vercel env settings to your Render URL
//      e.g. VITE_API_URL=https://diagonalley-server.onrender.com
//    - API_BASE = 'https://diagonalley-server.onrender.com'
//    - fetch calls become full absolute URLs → CORS handled in server.js

// Production: full Render backend URL. Development: empty string (Vite proxy handles it).
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// ── Helper: build auth header ────────────────────────────────────────
const authHeader = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

// ── Types ────────────────────────────────────────────────────────────
export interface ApiUser {
  id: string;
  username: string;
  email: string;
  hogwartsHouse: string | null;
  sortingCompleted: boolean;
  avatar: string;
  role: string;
  createdAt: string;
  lastLogin: string | null;
  activityLog: { action: string; timestamp: string }[];
}

export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
}

// ── Auth endpoints ────────────────────────────────────────────────────

export const authApi = {
  register: async (username: string, email: string, password: string, phoneNumber?: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, ...(phoneNumber ? { phoneNumber } : {}) }),
    });
    return res.json() as Promise<{ success: boolean; message: string; token?: string; user?: ApiUser }>;
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json() as Promise<{ success: boolean; message: string; token?: string; user?: ApiUser }>;
  },

  me: async (token: string) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeader(token),
    });
    return res.json() as Promise<{ success: boolean; user?: ApiUser }>;
  },

  logout: async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' }).catch(() => {});
  },

  // ── OTP Password Reset ─────────────────────────────────────────────
  sendOtp: async (email: string) => {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json() as Promise<{ success: boolean; message: string; otp?: string }>;
  },

  verifyOtp: async (email: string, otp: string) => {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    return res.json() as Promise<{ success: boolean; message: string }>;
  },

  resetPassword: async (email: string, newPassword: string) => {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    return res.json() as Promise<{ success: boolean; message: string }>;
  },
};

// ── User endpoints ────────────────────────────────────────────────────

export const userApi = {
  getProfile: async (token: string) => {
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: authHeader(token),
    });
    return res.json() as Promise<{ success: boolean; user?: ApiUser }>;
  },

  updateAvatar: async (token: string, avatar: string) => {
    const res = await fetch(`${API_BASE}/user/avatar`, {
      method: 'PUT',
      headers: authHeader(token),
      body: JSON.stringify({ avatar }),
    });
    return res.json() as Promise<{ success: boolean; message: string; user?: ApiUser }>;
  },

  updateProfile: async (token: string, username: string) => {
    const res = await fetch(`${API_BASE}/user/update`, {
      method: 'PUT',
      headers: authHeader(token),
      body: JSON.stringify({ username }),
    });
    return res.json() as Promise<{ success: boolean; message: string; user?: ApiUser }>;
  },

  // Trigger Sorting Hat ceremony — idempotent, safe to call multiple times
  sort: async (token: string) => {
    const res = await fetch(`${API_BASE}/user/sort`, {
      method: 'POST',
      headers: authHeader(token),
    });
    return res.json() as Promise<{
      success: boolean;
      message: string;
      house?: string;
      alreadySorted?: boolean;
      user?: ApiUser;
    }>;
  },

  checkAuth: async (token: string) => {
    const res = await fetch(`${API_BASE}/user/check-auth`, {
      headers: authHeader(token),
    });
    return res.json() as Promise<{ success: boolean; authenticated: boolean; user?: ApiUser }>;
  },
};
