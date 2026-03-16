import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { AuthContext, type AuthContextValue, type AuthMode } from './auth-context';

import {
  clearAuth,
  fetchSurveyStatus,
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
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);

  const openAuthModal = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const openSetupModal = useCallback(() => {
    setSetupModalOpen(true);
  }, []);

  const closeSetupModal = useCallback(() => {
    setSetupModalOpen(false);
  }, []);

  const refreshSetupState = useCallback(async () => {
    if (!isAuthenticated()) {
      setSetupRequired(false);
      setSetupModalOpen(false);
      return;
    }
    try {
      const status = await fetchSurveyStatus();
      const shouldRequire = !status.has_survey;
      setSetupRequired(shouldRequire);
      if (shouldRequire) {
        setSetupModalOpen(true);
      }
    } catch {
      setSetupRequired(false);
    }
  }, []);

  const completeSetupFlow = useCallback(() => {
    setSetupRequired(false);
    setSetupModalOpen(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await loginUser({ email, password });
    setAuthenticated(true);
    setAuthEmail(email);
    setAuthModalOpen(false);
    await refreshSetupState();
  }, [refreshSetupState]);

  const register = useCallback(async (email: string, password: string, fullName?: string) => {
    await registerUser({ email, password, full_name: fullName });
    setAuthenticated(true);
    setAuthEmail(email);
    setAuthModalOpen(false);
    await refreshSetupState();
  }, [refreshSetupState]);

  const logout = useCallback(() => {
    clearAuth();
    setAuthenticated(false);
    setAuthEmail(null);
    setSetupRequired(false);
    setSetupModalOpen(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: authenticated,
      authEmail,
      authModalOpen,
      authMode,
      setupModalOpen,
      setupRequired,
      openAuthModal,
      closeAuthModal,
      openSetupModal,
      closeSetupModal,
      refreshSetupState,
      completeSetupFlow,
      login,
      register,
      logout,
    }),
    [
      authenticated,
      authEmail,
      authModalOpen,
      authMode,
      setupModalOpen,
      setupRequired,
      openAuthModal,
      closeAuthModal,
      openSetupModal,
      closeSetupModal,
      refreshSetupState,
      completeSetupFlow,
      login,
      register,
      logout,
    ]
  );

  useEffect(() => {
    if (authenticated) {
      void refreshSetupState();
    }
  }, [authenticated, refreshSetupState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
