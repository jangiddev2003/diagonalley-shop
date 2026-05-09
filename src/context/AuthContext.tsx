// ============================================
// AUTH CONTEXT (Global Authentication State)
// ============================================
// This context provides authentication state and functions to the entire app.
// Any component can check if the user is logged in, get user info, or trigger
// login/logout actions by using the useAuth() hook.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================
// API BASE URL
// ============================================
// Points to our Express backend server.
// In development, the Vite proxy forwards /api requests to port 5000.
const API_BASE = '/api/auth';

// ============================================
// TYPES
// ============================================
// The shape of user data returned from the backend
interface AuthUser {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: string;
}

// Everything our AuthContext provides to the rest of the app
interface AuthContextType {
  user: AuthUser | null;       // The currently logged-in user (or null if not logged in)
  token: string | null;        // The JWT token
  isLoading: boolean;          // True while we're checking auth status on page load
  isAuthenticated: boolean;    // Quick boolean check: is the user logged in?
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Data needed to register a new user
interface RegisterData {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
}

// ============================================
// CREATE THE CONTEXT
// ============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// AUTH PROVIDER COMPONENT
// ============================================
// Wrap your entire app with <AuthProvider> to give every component
// access to authentication state and functions.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // STATE: The current user object (null if not logged in)
  const [user, setUser] = useState<AuthUser | null>(null);

  // STATE: The JWT token (loaded from localStorage on startup)
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('diagonalley-token');
  });

  // STATE: Loading flag — true while we verify the token on page load
  const [isLoading, setIsLoading] = useState(true);

  // DERIVED STATE: Quick check if user is authenticated
  const isAuthenticated = !!user && !!token;

  // ============================================
  // EFFECT: Verify token on page load / refresh
  // ============================================
  // When the app loads (or the token changes), we call the /me endpoint
  // to verify the token is still valid and get the user's info.
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          // Token is valid — set the user
          setUser(data.user);
        } else {
          // Token is invalid or expired — clean up
          setUser(null);
          setToken(null);
          localStorage.removeItem('diagonalley-token');
        }
      } catch (error) {
        // Network error or server down — clean up
        console.error('Token verification failed:', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('diagonalley-token');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // ============================================
  // LOGIN FUNCTION
  // ============================================
  // Called by the LoginPage when the user submits the login form.
  // Makes a POST request to /api/auth/login with email and password.
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Store token in localStorage (persists across page refreshes)
        localStorage.setItem('diagonalley-token', data.token);
        setToken(data.token);
        setUser(data.user);
      }

      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Unable to connect to the server. Is the backend running?',
      };
    }
  };

  // ============================================
  // REGISTER FUNCTION
  // ============================================
  // Called by the RegisterPage when the user submits the signup form.
  // Makes a POST request to /api/auth/register with user data.
  const register = async (data: RegisterData) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        // Automatically log in the user after successful registration
        localStorage.setItem('diagonalley-token', result.token);
        setToken(result.token);
        setUser(result.user);
      }

      return { success: result.success, message: result.message };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Unable to connect to the server. Is the backend running?',
      };
    }
  };

  // ============================================
  // LOGOUT FUNCTION
  // ============================================
  // Clears the token and user data from both state and localStorage.
  const logout = () => {
    localStorage.removeItem('diagonalley-token');
    setToken(null);
    setUser(null);

    // Also notify the backend (fire-and-forget, no need to await)
    fetch(`${API_BASE}/logout`, { method: 'POST' }).catch(() => {});
  };

  // Provide all auth state and functions to child components
  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK: useAuth()
// ============================================
// A shortcut so components can easily access auth state:
//   const { user, login, logout } = useAuth();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
