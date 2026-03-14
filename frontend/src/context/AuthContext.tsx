import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { AuthContext, type AuthContextValue, type AuthMode } from './auth-context';

import {
  clearAuth,
  getStoredAuthEmail,
  isAuthenticated,
  loginUser,
  registerUser,
} from '../services/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated());
  const [authEmail, setAuthEmail] = useState<string | null>(getStoredAuthEmail());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const openAuthModal = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await loginUser({ email, password });
    setAuthenticated(true);
    setAuthEmail(email);
    setAuthModalOpen(false);
  }, []);

  const register = useCallback(async (email: string, password: string, fullName?: string) => {
    await registerUser({ email, password, full_name: fullName });
    setAuthenticated(true);
    setAuthEmail(email);
    setAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuthenticated(false);
    setAuthEmail(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: authenticated,
      authEmail,
      authModalOpen,
      authMode,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
    }),
    [authenticated, authEmail, authModalOpen, authMode, openAuthModal, closeAuthModal, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
