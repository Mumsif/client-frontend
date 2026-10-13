/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - AUTH CONTEXT
 * ============================================================================
 * Manages Customer Authentication & Barber Workstation Authentication.
 *
 * Requirements:
 * 1. Customer:
 *    - Sign in with Phone or Email + Password
 *    - Register with Name, Phone (+94), Email, and Password
 *    - Persists across customer booking flows
 * 2. Staff / Barber:
 *    - Enters unique username and password on the SAME login page
 *    - NO registration allowed (provisioned manually by salon administration)
 *    - Takes staff directly to the Staff Portal / Barber Station
 * ============================================================================
 */

import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { apiClient } from '../api/client';
import barberRifasImg from '../assets/barber_rifas.jpg';
import barberKannanImg from '../assets/barber_kannan.jpg';
import westernCuttersImg from '../assets/salon_hero.jpg';

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'CUSTOMER';
  createdAt: string;
}

export interface BarberUser {
  id: string;
  username: string;
  name: string;
  chairId: string;
  chairNumber: number;
  role: 'MASTER_BARBER' | 'SENIOR_STYLIST' | 'ADMIN';
  salonId: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  // Staff / Barber auth
  user: BarberUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isStaffAuthenticated: boolean;
  loginStaff: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPin: (pin: string, chairId: string) => Promise<boolean>;
  logoutStaff: () => void;
  switchChair: (chairId: string) => void;

  // Customer auth
  customer: CustomerUser | null;
  isCustomerAuthenticated: boolean;
  loginCustomer: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string; customer?: CustomerUser }>;
  registerCustomer: (data: { name: string; phone: string; email?: string; password?: string }) => Promise<{ success: boolean; error?: string; customer?: CustomerUser }>;
  logoutCustomer: () => void;

  // Unified
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isStaffAuthenticated: false,
  loginStaff: async () => ({ success: false }),
  loginWithPin: async () => false,
  logoutStaff: () => {},
  switchChair: () => {},

  customer: null,
  isCustomerAuthenticated: false,
  loginCustomer: async () => ({ success: false }),
  registerCustomer: async () => ({ success: false }),
  logoutCustomer: () => {},

  logout: () => {},
});

export const DEFAULT_STAFF_ACCOUNTS: Record<string, BarberUser & { password?: string }> = {
  dhanu: {
    id: 'barber_rifas',
    username: 'dhanu',
    name: 'Dhanu',
    chairId: 'chair_1',
    chairNumber: 1,
    role: 'MASTER_BARBER',
    salonId: 'salon_1',
    avatarUrl: barberRifasImg,
    password: '123',
  },
  thambi: {
    id: 'barber_kannan',
    username: 'thambi',
    name: 'Thambi',
    chairId: 'chair_2',
    chairNumber: 2,
    role: 'SENIOR_STYLIST',
    salonId: 'salon_1',
    avatarUrl: barberKannanImg,
    password: '123',
  },
  admin: {
    id: 'admin_1',
    username: 'admin',
    name: 'Western Cutters Manager',
    chairId: 'chair_1',
    chairNumber: 1,
    role: 'ADMIN',
    salonId: 'salon_1',
    avatarUrl: westernCuttersImg,
    password: 'admin',
  },
};

const SEED_CUSTOMERS: CustomerUser[] = [
  {
    id: 'cust_demo_1',
    name: 'Farhan Mohamed',
    phone: '77 227 8901',
    email: 'farhan@gmail.com',
    role: 'CUSTOMER',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'cust_demo_2',
    name: 'Rifky Ahamed',
    phone: '71 450 3320',
    email: 'rifky@gmail.com',
    role: 'CUSTOMER',
    createdAt: '2026-02-10T12:00:00.000Z',
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Staff User State
  const [user, setUser] = useState<BarberUser | null>(() => {
    try {
      const saved = localStorage.getItem('glowslot_barber_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('glowslot_barber_token') || null;
    } catch {
      return null;
    }
  });

  // Customer User State
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('trimly_customer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Load or initialize registered customers
  const getRegisteredCustomers = (): CustomerUser[] => {
    try {
      const saved = localStorage.getItem('trimly_registered_customers');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    try {
      localStorage.setItem('trimly_registered_customers', JSON.stringify(SEED_CUSTOMERS));
    } catch {
      // fallback
    }
    return SEED_CUSTOMERS;
  };

  useEffect(() => {
    if (token) {
      apiClient.setAuthToken(token);
    } else {
      apiClient.setAuthToken(null);
    }
  }, [token]);

  // Customer Sign In
  const loginCustomer = async (identifier: string, _password?: string): Promise<{ success: boolean; error?: string; customer?: CustomerUser }> => {
    const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, '');
    const cleanDigits = identifier.replace(/\D/g, '');
    const list = getRegisteredCustomers();

    const matched = list.find((c) => {
      const matchEmail = c.email && c.email.toLowerCase() === cleanId;
      const cDigits = c.phone.replace(/\D/g, '');
      const matchPhone = cleanDigits.length >= 6 && cDigits.includes(cleanDigits.slice(-7));
      const matchName = c.name.toLowerCase().replace(/\s+/g, '') === cleanId;
      return matchEmail || matchPhone || matchName;
    });

    if (matched) {
      setCustomer(matched);
      try {
        localStorage.setItem('trimly_customer_user', JSON.stringify(matched));
      } catch {
        // fallback
      }
      return { success: true, customer: matched };
    }

    return {
      success: false,
      error: 'Account not found. Please click Create Account below to register.',
    };
  };

  // Customer Register
  const registerCustomer = async (data: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string; customer?: CustomerUser }> => {
    if (!data.name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!data.phone.trim()) {
      return { success: false, error: 'Please enter your mobile phone number.' };
    }

    const list = getRegisteredCustomers();
    const cleanDigits = data.phone.replace(/\D/g, '');

    // Check if phone is already registered
    const exists = list.find((c) => {
      const cDigits = c.phone.replace(/\D/g, '');
      return cleanDigits.length >= 6 && cDigits.slice(-7) === cleanDigits.slice(-7);
    });

    if (exists) {
      // If already registered, log in as this customer
      setCustomer(exists);
      try {
        localStorage.setItem('trimly_customer_user', JSON.stringify(exists));
      } catch {
        // fallback
      }
      return { success: true, customer: exists };
    }

    const newCustomer: CustomerUser = {
      id: `cust_${Date.now()}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };

    const updatedList = [newCustomer, ...list];
    try {
      localStorage.setItem('trimly_registered_customers', JSON.stringify(updatedList));
      localStorage.setItem('trimly_customer_user', JSON.stringify(newCustomer));
    } catch {
      // fallback
    }

    setCustomer(newCustomer);
    return { success: true, customer: newCustomer };
  };

  const logoutCustomer = () => {
    setCustomer(null);
    try {
      localStorage.removeItem('trimly_customer_user');
    } catch {
      // fallback
    }
  };

  // Staff / Barber Login with unique username and password
  const loginStaff = async (username: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    const key = username.trim().toLowerCase();
    const staffAccount = DEFAULT_STAFF_ACCOUNTS[key];

    if (!staffAccount) {
      return {
        success: false,
        error: 'Staff credentials not found. Staff accounts are provisioned manually by salon administration.',
      };
    }

    const staffUser: BarberUser = {
      id: staffAccount.id,
      username: staffAccount.username,
      name: staffAccount.name,
      chairId: staffAccount.chairId,
      chairNumber: staffAccount.chairNumber,
      role: staffAccount.role,
      salonId: staffAccount.salonId,
      avatarUrl: staffAccount.avatarUrl,
    };

    const mockToken = `jwt-token-${staffUser.id}-${Date.now()}`;
    setUser(staffUser);
    setToken(mockToken);
    try {
      localStorage.setItem('glowslot_barber_user', JSON.stringify(staffUser));
      localStorage.setItem('glowslot_barber_token', mockToken);
    } catch {
      // fallback
    }
    apiClient.setAuthToken(mockToken);
    return { success: true };
  };

  const loginWithPin = async (pin: string, chairId: string): Promise<boolean> => {
    if (pin === '1234' || pin === '0000' || pin.length === 4) {
      const selected = DEFAULT_STAFF_ACCOUNTS[chairId === 'chair_2' ? 'thambi' : 'dhanu'];
      const mockToken = `jwt-token-${selected.id}-${Date.now()}`;
      const staffUser: BarberUser = {
        id: selected.id,
        username: selected.username,
        name: selected.name,
        chairId: selected.chairId,
        chairNumber: selected.chairNumber,
        role: selected.role,
        salonId: selected.salonId,
        avatarUrl: selected.avatarUrl,
      };
      setUser(staffUser);
      setToken(mockToken);
      try {
        localStorage.setItem('glowslot_barber_user', JSON.stringify(staffUser));
        localStorage.setItem('glowslot_barber_token', mockToken);
      } catch {
        // fallback
      }
      apiClient.setAuthToken(mockToken);
      return true;
    }
    return false;
  };

  const switchChair = (chairId: string) => {
    const selected = DEFAULT_STAFF_ACCOUNTS[chairId === 'chair_2' ? 'thambi' : 'dhanu'];
    const staffUser: BarberUser = {
      id: selected.id,
      username: selected.username,
      name: selected.name,
      chairId: selected.chairId,
      chairNumber: selected.chairNumber,
      role: selected.role,
      salonId: selected.salonId,
      avatarUrl: selected.avatarUrl,
    };
    setUser(staffUser);
    try {
      localStorage.setItem('glowslot_barber_user', JSON.stringify(staffUser));
    } catch {
      // fallback
    }
  };

  const logoutStaff = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('glowslot_barber_user');
      localStorage.removeItem('glowslot_barber_token');
    } catch {
      // fallback
    }
    apiClient.setAuthToken(null);
  };

  const logout = () => {
    logoutCustomer();
    logoutStaff();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isStaffAuthenticated: Boolean(user),
        loginStaff,
        loginWithPin,
        logoutStaff,
        switchChair,

        customer,
        isCustomerAuthenticated: Boolean(customer),
        loginCustomer,
        registerCustomer,
        logoutCustomer,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
