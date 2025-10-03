import React, { createContext, useContext, useState, ReactNode } from 'react';
import authApi, { User as ApiUser, Role } from '../apis/auth';

type User = ApiUser;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, roleHint?: Role) => Promise<void>;
  signup: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
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
  };

  const signup = async (name: string, email: string, password: string, role: Role) => {
    const u = await authApi.signup(name, email, password, role);
    setUser(u);
  };

  const logout = async () => {
    if (!user) return;
    await authApi.logout(user.role);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const u = await authApi.updateProfile(user.role, updates);
    setUser(u);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};