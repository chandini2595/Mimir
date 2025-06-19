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

    // Check if we have user data in localStorage first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Convert the stored user data to the expected format
        const user = {
          username: userData.email || userData.username || '',
          firstName: userData.firstName || userData.given_name || '',
          lastName: userData.lastName || userData.family_name || '',
          id: userData.id || userData.sub || 'unknown'
        };
        setUser(user);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
        localStorage.removeItem('user');
      }
    }

    try {
      const res = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          // Convert profile format to user format
          const user = {
            username: data.profile.email,
            firstName: data.profile.given_name || '',
            lastName: data.profile.family_name || '',
            id: data.profile.sub || 'unknown'
          };
          setUser(user);
        } else {
          throw new Error('Invalid profile data');
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/signin');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
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
