'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  _id?: string;
  email: string;
  role: string;
  name?: string;
  points?: number;
  avatar?: string | null;
  loginActivity?: { method: string; timestamp: string }[];
  authIdentities?: { provider: string; providerId: string }[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (user: User) => void;
  logout: () => void;
  updateTokens: (token: string, refreshToken: string) => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Proactively refresh user data, validating cookies
    api.get('/auth/profile').then(res => {
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    }).catch(() => {
      // If profile fails, it means cookies are invalid or missing
      localStorage.removeItem('user');
      setUser(null);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/profile');
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const login = (newUser: User) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    const role = user?.role;
    try {
      await api.post('/auth/logout');
    } catch(e) {
      console.error(e);
    }
    localStorage.removeItem('user');
    setUser(null);
    if (role === 'admin' || role === 'super_admin') {
      router.push('/admin/login');
    } else {
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token: null, refreshToken: null, login, logout, updateTokens: () => {}, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
