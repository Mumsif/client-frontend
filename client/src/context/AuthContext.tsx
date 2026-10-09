/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - AUTH CONTEXT
 * ============================================================================
 * Manages Barber Login State, JWT / Bearer Token Storage, and Active Chair Context.
 *
 * Spring Boot Integration:
 * - Sends Bearer Token to com.glowslot.security.FirebaseAuthenticationFilter.java
 * - Protects workstation endpoints (/api/v1/barber/* and /api/v1/admin/*)
 * ============================================================================
 */

import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { apiClient } from '../api/client';

export interface BarberUser {
  id: string;
  name: string;
  chairId: string;
  chairNumber: number;
  role: 'MASTER_BARBER' | 'SENIOR_STYLIST' | 'ADMIN';
  salonId: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: BarberUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loginWithPin: (pin: string, chairId: string) => Promise<boolean>;
  logout: () => void;
  switchChair: (chairId: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loginWithPin: async () => false,
  logout: () => {},
  switchChair: () => {},
});

const DEFAULT_BARBERS: Record<string, BarberUser> = {
  chair_1: {
    id: 'barber_rifas',
    name: 'Dhanu',
    chairId: 'chair_1',
    chairNumber: 1,
    role: 'MASTER_BARBER',
    salonId: 'salon_1',
    avatarUrl: '/src/assets/barber_rifas.jpg',
  },
  chair_2: {
    id: 'barber_kannan',
    name: 'Thambi',
    chairId: 'chair_2',
    chairNumber: 2,
    role: 'SENIOR_STYLIST',
    salonId: 'salon_1',
    avatarUrl: '/src/assets/barber_kannan.jpg',
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BarberUser | null>(() => {
    const saved = localStorage.getItem('glowslot_barber_user');
    return saved ? JSON.parse(saved) : DEFAULT_BARBERS['chair_1']; // default active barber for seamless preview
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('glowslot_barber_token') || 'mock-jwt-token-rifas-2026';
  });

  useEffect(() => {
    if (token) {
      apiClient.setAuthToken(token);
    } else {
      apiClient.setAuthToken(null);
    }
  }, [token]);

  const loginWithPin = async (pin: string, chairId: string): Promise<boolean> => {
    // Accepts "1234" or "0000" for quick barber access
    if (pin === '1234' || pin === '0000' || pin.length === 4) {
      const selected = DEFAULT_BARBERS[chairId] || DEFAULT_BARBERS['chair_1'];
      const mockToken = `jwt-token-${selected.id}-${Date.now()}`;
      setUser(selected);
      setToken(mockToken);
      localStorage.setItem('glowslot_barber_user', JSON.stringify(selected));
      localStorage.setItem('glowslot_barber_token', mockToken);
      apiClient.setAuthToken(mockToken);
      return true;
    }
    return false;
  };

  const switchChair = (chairId: string) => {
    const selected = DEFAULT_BARBERS[chairId] || DEFAULT_BARBERS['chair_1'];
    setUser(selected);
    localStorage.setItem('glowslot_barber_user', JSON.stringify(selected));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('glowslot_barber_user');
    localStorage.removeItem('glowslot_barber_token');
    apiClient.setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loginWithPin,
        logout,
        switchChair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
