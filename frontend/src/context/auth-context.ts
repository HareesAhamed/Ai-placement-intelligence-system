import { createContext } from 'react';

export type AuthMode = 'login' | 'register';

export type AuthContextValue = {
  isAuthenticated: boolean;
  authEmail: string | null;
  authModalOpen: boolean;
  authMode: AuthMode;
  setupModalOpen: boolean;
  setupRequired: boolean;
  openAuthModal: (mode: AuthMode) => void;
  closeAuthModal: () => void;
  openSetupModal: () => void;
  closeSetupModal: () => void;
  refreshSetupState: () => Promise<void>;
  completeSetupFlow: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
