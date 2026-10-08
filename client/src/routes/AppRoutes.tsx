/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - SECURE ROUTE & VIEW CONTROLLER
 * ============================================================================
 * Implements role-separated routing with authentication guards:
 * - Public Customer Routes:
 *   - '/' | '#/'          -> ServiceBookingView (Consumer Booking & Service Menu)
 *   - '#/pass'            -> PassStatusView (Live Queue Pass Tracker with OTP)
 *   - '#/salons'          -> SalonSelectView (Pilot Salon Directory)
 * - Protected Staff Routes:
 *   - '#/barber'          -> BarberLoginView (PIN Auth) or WorkstationDashboardView
 *
 * Security:
 * - Public customers never see staff controls or chair dashboards.
 * - Workstation route is protected by session token guard.
 * - Developer quick-bar is restricted strictly to ?dev=true.
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ServiceBookingView } from '../views/customer/ServiceBookingView';
import { PassStatusView } from '../views/customer/PassStatusView';
import { SalonSelectView } from '../views/customer/SalonSelectView';
import { BarberLoginView } from '../views/barber/BarberLoginView';
import { WorkstationDashboardView } from '../views/barber/WorkstationDashboardView';
import type { AppointmentResponseDTO } from '../api/bookingApi';
import { useAuth } from '../hooks/useAuth';

export type AppViewMode = 'customer_booking' | 'customer_pass' | 'salon_select' | 'barber_login' | 'barber_station';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  // Helper to determine view from current URL hash
  const getViewFromUrl = useCallback((): AppViewMode => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#/barber' || hash === '#barber') {
      return isAuthenticated ? 'barber_station' : 'barber_login';
    }
    if (hash === '#/pass' || hash === '#pass') {
      return 'customer_pass';
    }
    if (hash === '#/salons' || hash === '#salons') {
      return 'salon_select';
    }
    return 'customer_booking';
  }, [isAuthenticated]);

  const [currentView, setCurrentView] = useState<AppViewMode>(getViewFromUrl);

  // Restore existing active pass from localStorage if available
  const [activePass, setActivePass] = useState<AppointmentResponseDTO | null>(() => {
    try {
      const saved = localStorage.getItem('glowslot_active_pass');
      return saved ? (JSON.parse(saved) as AppointmentResponseDTO) : null;
    } catch {
      return null;
    }
  });

  // Check if developer preview mode is explicitly requested via URL param (?dev=true)
  const isDevMode = typeof window !== 'undefined' && window.location.search.includes('dev=true');

  // Navigate helper that updates URL hash and browser history
  const navigateTo = useCallback((view: AppViewMode) => {
    switch (view) {
      case 'customer_booking':
        window.location.hash = '';
        break;
      case 'customer_pass':
        window.location.hash = '#/pass';
        break;
      case 'salon_select':
        window.location.hash = '#/salons';
        break;
      case 'barber_login':
      case 'barber_station':
        window.location.hash = '#/barber';
        break;
    }
    setCurrentView(view);
  }, []);

  // Listen for browser navigation (Back/Forward or direct link changes)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentView(getViewFromUrl());
    };

    window.addEventListener('hashchange', handleLocationChange);
    return () => window.removeEventListener('hashchange', handleLocationChange);
  }, [getViewFromUrl]);

  // Handle successful customer booking
  const handleBookingConfirmed = (pass: AppointmentResponseDTO) => {
    setActivePass(pass);
    try {
      localStorage.setItem('glowslot_active_pass', JSON.stringify(pass));
    } catch {
      // Storage fallback
    }
    navigateTo('customer_pass');
  };

  // Render view with security guards
  const renderActiveView = () => {
    switch (currentView) {
      case 'customer_booking':
        return (
          <ServiceBookingView
            hasActivePass={Boolean(activePass)}
            onBookingConfirmed={handleBookingConfirmed}
            onNavigateToPassStatus={() => navigateTo('customer_pass')}
            onNavigateToSalons={() => navigateTo('salon_select')}
            onNavigateToBarberStation={() => navigateTo(isAuthenticated ? 'barber_station' : 'barber_login')}
          />
        );

      case 'customer_pass':
        return (
          <PassStatusView
            pass={activePass}
            onBackToBooking={() => navigateTo('customer_booking')}
          />
        );

      case 'salon_select':
        return (
          <SalonSelectView
            onSelectSalon={() => navigateTo('customer_booking')}
            onBackToBooking={() => navigateTo('customer_booking')}
          />
        );

      case 'barber_login':
        return (
          <BarberLoginView
            onLoginSuccess={() => navigateTo('barber_station')}
            onBackToCustomer={() => navigateTo('customer_booking')}
          />
        );

      case 'barber_station':
        // Protected Route Guard
        if (!isAuthenticated) {
          return (
            <BarberLoginView
              onLoginSuccess={() => navigateTo('barber_station')}
              onBackToCustomer={() => navigateTo('customer_booking')}
            />
          );
        }
        return (
          <WorkstationDashboardView
            onNavigateToCustomerBooking={() => navigateTo('customer_booking')}
            onLogout={() => {
              logout();
              navigateTo('barber_login');
            }}
          />
        );

      default:
        return (
          <ServiceBookingView
            hasActivePass={Boolean(activePass)}
            onBookingConfirmed={handleBookingConfirmed}
            onNavigateToPassStatus={() => navigateTo('customer_pass')}
            onNavigateToSalons={() => navigateTo('salon_select')}
            onNavigateToBarberStation={() => navigateTo(isAuthenticated ? 'barber_station' : 'barber_login')}
          />
        );
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* 
        DEVELOPER QUICK SWITCHER:
        Only rendered when explicitly enabled in URL via ?dev=true.
        Hidden in all normal customer & production views.
      */}
      {isDevMode && (
        <div
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '16px',
            zIndex: 99999,
            display: 'flex',
            gap: '6px',
            backgroundColor: 'rgba(13, 28, 47, 0.92)',
            padding: '6px 10px',
            borderRadius: '9999px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <span style={{ color: '#00D1B2', fontSize: '10px', fontWeight: 700, padding: '4px 6px' }}>
            DEV TOOLS
          </span>
          <button
            type="button"
            onClick={() => navigateTo('customer_booking')}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: currentView === 'customer_booking' ? '#00685F' : 'transparent',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Booking
          </button>
          <button
            type="button"
            onClick={() => navigateTo('customer_pass')}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: currentView === 'customer_pass' ? '#00685F' : 'transparent',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Pass
          </button>
          <button
            type="button"
            onClick={() => navigateTo(isAuthenticated ? 'barber_station' : 'barber_login')}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: currentView === 'barber_station' || currentView === 'barber_login' ? '#008378' : 'transparent',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Staff
          </button>
        </div>
      )}

      {renderActiveView()}
    </div>
  );
};
