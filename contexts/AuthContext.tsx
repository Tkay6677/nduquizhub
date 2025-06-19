'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  level: string;
  avatar?: string;
  badges: string[];
  totalScore: number;
  quizzesCompleted: number;
  averageScore: number;
  role?: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'badges' | 'totalScore' | 'quizzesCompleted' | 'averageScore'>) => Promise<boolean>;
  logout: () => void;
  updateUserStats: (score: number) => void;
  awardBadge: (badge: string) => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('nduUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - check for admin credentials
    if (email === 'admin@ndu.edu.ng' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Admin User',
        email,
        department: 'Administration',
        level: 'Staff',
        badges: ['System Administrator'],
        totalScore: 0,
        quizzesCompleted: 0,
        averageScore: 0,
        role: 'admin'
      };
      
      setUser(adminUser);
      localStorage.setItem('nduUser', JSON.stringify(adminUser));
      return true;
    }
    
    // Regular student login
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      department: 'Computer Science',
      level: '300',
      badges: ['First Quiz', 'Early Bird'],
      totalScore: 850,
      quizzesCompleted: 12,
      averageScore: 70.8,
      role: 'student'
    };
    
    setUser(mockUser);
    localStorage.setItem('nduUser', JSON.stringify(mockUser));
    return true;
  };

  const register = async (userData: Omit<User, 'id' | 'badges' | 'totalScore' | 'quizzesCompleted' | 'averageScore'>): Promise<boolean> => {
    // Mock registration - in production, this would call your API
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      badges: ['Welcome to NDU Quiz Hub'],
      totalScore: 0,
      quizzesCompleted: 0,
      averageScore: 0,
      role: 'student'
    };
    
    setUser(newUser);
    localStorage.setItem('nduUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nduUser');
  };

  const updateUserStats = (score: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      totalScore: user.totalScore + score,
      quizzesCompleted: user.quizzesCompleted + 1,
      averageScore: Math.round(((user.totalScore + score) / (user.quizzesCompleted + 1)) * 10) / 10
    };
    
    setUser(updatedUser);
    localStorage.setItem('nduUser', JSON.stringify(updatedUser));
  };

  const awardBadge = (badge: string) => {
    if (!user || user.badges.includes(badge)) return;
    
    const updatedUser = {
      ...user,
      badges: [...user.badges, badge]
    };
    
    setUser(updatedUser);
    localStorage.setItem('nduUser', JSON.stringify(updatedUser));
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUserStats,
      awardBadge,
      isAdmin
    }}>
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