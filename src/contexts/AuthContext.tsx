import React, { createContext, useContext, useState, ReactNode } from 'react';
import authApi, { User as ApiUser, Role } from '../apis/auth';
import socketService from '../services/socketService';

type User = ApiUser;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, roleHint?: Role) => Promise<void>;
  signup: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      try {
        const u = await authApi.me();
        if (u) setUser(u);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string, roleHint?: Role) => {
    const u = await authApi.login(email, password, roleHint);
    setUser(u);
    // Reconnect socket for the newly authenticated user without a full reload
    try {
      socketService.disconnect();
      if (u?.id) socketService.connect(u.id);
    } catch (e) {
      console.warn('Socket reconnect after login failed', e);
    }
  };

  const signup = async (name: string, email: string, password: string, role: Role) => {
    const u = await authApi.signup(name, email, password, role);
    setUser(u);
    // Reconnect socket for the newly registered user without a full reload
    try {
      socketService.disconnect();
      if (u?.id) socketService.connect(u.id);
    } catch (e) {
      console.warn('Socket reconnect after signup failed', e);
    }
  };

  const logout = async () => {
    if (!user) return;
    await authApi.logout(user.role);
    setUser(null);
    // Disconnect socket on logout
    try {
      socketService.disconnect();
    } catch (e) {
      console.warn('Socket disconnect on logout failed', e);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const u = await authApi.updateProfile(user.role, updates);
    setUser(u);
  };

  const refreshUser = async () => {
    try {
      const u = await authApi.me();
      if (u) setUser(u);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};