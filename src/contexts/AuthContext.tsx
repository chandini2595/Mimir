'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      router.push('/signin');
      return;
    }

    // Developer backdoor: skip backend check
    if (token === 'dev-demo-token') {
      const devUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (devUser && devUser.username === 'dev@mimir.dev') {
        setUser(devUser);
        setLoading(false);
        return;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/signin');
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/signin');
      }
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/signin');
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/signin');
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
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
