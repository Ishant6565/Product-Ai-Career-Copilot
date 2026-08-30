'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { api } from './api';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchDemoPersona: (persona?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const p = await api.getProfile();
      setProfile(p);
    } catch (err) {
      console.warn('Could not refresh profile:', err);
    }
  };

  const login = (authToken: string, authUser: User) => {
    localStorage.setItem('career_copilot_token', authToken);
    setToken(authToken);
    setUser(authUser);
    refreshProfile();
  };

  const logout = () => {
    localStorage.removeItem('career_copilot_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const switchDemoPersona = async (persona: string = 'fullstack') => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin(persona);
      login(res.access_token, res.user);
    } catch (err) {
      console.error('Demo login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('career_copilot_token');
      if (savedToken) {
        setToken(savedToken);
        try {
          const me = await api.getMe();
          setUser(me);
          const p = await api.getProfile();
          setProfile(p);
        } catch (err) {
          console.warn('Session expired or offline fallback:', err);
          // Auto load demo profile for seamless experience
          await switchDemoPersona();
        }
      } else {
        // Auto sign in as demo user for instant interactive testing
        await switchDemoPersona();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, token, isLoading, login, logout, switchDemoPersona, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
