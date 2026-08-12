import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PublicUser } from '../lib/api';

// localStorage is fine for the web build; if this ever ships as a real
// Capacitor native app, swap these for @capacitor/preferences instead —
// localStorage isn't guaranteed to persist there the same way.
const TOKEN_KEY = 'cuny_compass_token';
const USER_KEY = 'cuny_compass_user';

type AuthContextValue = {
  token: string | null;
  user: PublicUser | null;
  login: (token: string, user: PublicUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<PublicUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as PublicUser) : null;
  });

  function login(newToken: string, newUser: PublicUser) {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
