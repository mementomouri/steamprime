"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  isLoggedIn: boolean;
  loginTime: number;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (phoneNumber: string, firstName?: string, lastName?: string, email?: string, address?: string, city?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // بررسی وضعیت ورود از localStorage در زمان بارگذاری
  useEffect(() => {
    const savedUser = localStorage.getItem('otp_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // بررسی اینکه آیا session منقضی شده (24 ساعت)
        if (Date.now() - userData.loginTime < 24 * 60 * 60 * 1000) {
          setUser(userData);
        } else {
          // حذف session منقضی شده
          localStorage.removeItem('otp_user');
        }
      } catch (error) {
        localStorage.removeItem('otp_user');
      }
    }
  }, []);

  const login = (phoneNumber: string, firstName?: string, lastName?: string, email?: string, address?: string, city?: string) => {
    const userData: AuthUser = {
      phoneNumber,
      firstName,
      lastName,
      email,
      address,
      city,
      isLoggedIn: true,
      loginTime: Date.now()
    };
    setUser(userData);
    localStorage.setItem('otp_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('otp_user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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