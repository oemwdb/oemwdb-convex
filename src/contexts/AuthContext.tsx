import React, { createContext, useContext, useMemo } from 'react';
import { useUser, useClerk } from '@clerk/react';

interface AuthContextType {
  user: any | null;
  session: any | null;
  role: 'admin' | 'user' | null;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut, openSignIn, openSignUp } = useClerk();

  const isLoading = !isLoaded;
  const isAuthenticated = !!isSignedIn;

  // These open Clerk's modal — the actual form UI is handled by Clerk components
  const signIn = async (_email: string, _password: string) => {
    openSignIn();
  };

  const signUp = async (_email: string, _password: string, _username: string) => {
    openSignUp();
  };

  const signOut = async () => {
    await clerkSignOut();
  };

  const contextValue = useMemo(() => ({
    user: user ?? null,
    session: null,
    role: null,
    profile: null,
    signIn,
    signUp,
    signOut,
    isLoading,
    isAuthenticated,
  }), [user, isLoading, isAuthenticated]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};