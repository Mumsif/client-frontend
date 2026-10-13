/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - SECURE ROUTE & VIEW CONTROLLER
 * ============================================================================
 * Implements role-separated routing with authentication guards:
 * - Public Customer Routes:
 *   - '/' | '#/'          -> HomeView (Akkaraipattu 3-Salon Showcase & Video Background)
 *   - '#/book'            -> ServiceBookingView (Consumer Booking & Service Menu)
 *   - '#/pass'            -> PassStatusView (Live Queue Pass Tracker with 4-Digit OTP)
 *   - '#/salons'          -> SalonSelectView (Pilot Salon Directory across Akkaraipattu)
 *   - '#/otp_sent'        -> OtpSentView (Instant OTP Code Notification & Dispatch)
 * - Protected Staff Routes:
 *   - '#/barber'          -> BarberLoginView (PIN Auth) or WorkstationDashboardView (Real-time Chair Board)
 *
 * Full 5-Step Lifecycle Supported:
 * Step 1: User Visits Website (HomeView with Haircut Background Video)
 * Step 2: Find Suitable Salon in Akkaraipattu (Western Cutters, Royal Blades, Eastern Glow)
 * Step 3: Select Time and get the OTP (BookingPass with 4-digit security code)
 * Step 4: Barber Types OTP at his side and timer starts (Workstation verification & countdown)
 * Step 5: After finish haircut get payment (PaymentModal settlement & digital receipt)
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { HomeView } from '../views/customer/HomeView';
import { ServiceBookingView } from '../views/customer/ServiceBookingView';
import { PassStatusView } from '../views/customer/PassStatusView';
import { OtpSentView } from '../views/customer/OtpSentView';
import { SalonSelectView } from '../views/customer/SalonSelectView';
import { WorkstationDashboardView } from '../views/barber/WorkstationDashboardView';
import { AuthView } from '../views/auth/AuthView';
import type { AppointmentResponseDTO } from '../api/bookingApi';
import { useAuth } from '../hooks/useAuth';

export type AppViewMode =
  | 'home'
  | 'customer_booking'
  | 'customer_pass'
  | 'otp_sent'
  | 'salon_select'
  | 'barber_login'
  | 'barber_station'
  | 'auth';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  // Helper to determine view from current URL hash
  const getViewFromUrl = useCallback((): AppViewMode => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#/barber' || hash === '#barber') {
      return isAuthenticated ? 'barber_station' : 'auth';
    }
    if (hash === '#/login' || hash === '#login' || hash === '#/auth' || hash === '#auth') {
      return 'auth';
    }
    if (hash === '#/pass' || hash === '#pass') {
      return 'customer_pass';
    }
    if (hash === '#/salons' || hash === '#salons') {
      return 'salon_select';
    }
    if (hash === '#/book' || hash === '#book' || hash === '#/booking') {
      return 'customer_booking';
    }
    if (hash === '#/otp_sent' || hash === '#otp_sent') {
      return 'otp_sent';
    }
    if (hash === '#/home' || hash === '#home' || hash === '#/' || hash === '' || hash === '#') {
      return 'home';
    }
    return 'home';
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

  // OTP Sent screen - holds last submitted customer details
  const [otpCustomerName, setOtpCustomerName] = useState<string>('');
  const [otpCustomerPhone, setOtpCustomerPhone] = useState<string>('');
  const [otpSalonName, setOtpSalonName] = useState<string>('Western Cutters');

  // Selected salon ID (defaults to 'salon_1' Western Cutters)
  const [selectedSalonId, setSelectedSalonId] = useState<string>(() => {
    try {
      return localStorage.getItem('trimly_selected_salon_id') || 'salon_1';
    } catch {
      return 'salon_1';
    }
  });

  const handleSelectSalon = (salonId: string) => {
    setSelectedSalonId(salonId);
    try {
      localStorage.setItem('trimly_selected_salon_id', salonId);
    } catch {
      // Storage fallback
    }
    navigateTo('customer_booking');
  };

  // Navigate helper that updates URL hash and browser history
  const navigateTo = useCallback((view: AppViewMode) => {
    switch (view) {
      case 'home':
        window.location.hash = '#/';
        break;
      case 'customer_booking':
        window.location.hash = '#/book';
        break;
      case 'customer_pass':
        window.location.hash = '#/pass';
        break;
      case 'otp_sent':
        window.location.hash = '#/otp_sent';
        break;
      case 'salon_select':
        window.location.hash = '#/salons';
        break;
      case 'barber_station':
        window.location.hash = '#/barber';
        break;
      case 'auth':
      case 'barber_login':
        window.location.hash = '#/login';
        break;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser navigation (Back/Forward or direct link changes)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentView(getViewFromUrl());
    };

    window.addEventListener('hashchange', handleLocationChange);
    return () => window.removeEventListener('hashchange', handleLocationChange);
  }, [getViewFromUrl]);

  // Handle successful customer booking -> show OTP sent screen
  const handleBookingConfirmed = (
    pass: AppointmentResponseDTO,
    customerName?: string,
    customerPhone?: string,
    salonName?: string,
  ) => {
    setActivePass(pass);
    try {
      localStorage.setItem('glowslot_active_pass', JSON.stringify(pass));
    } catch {
      // Storage fallback
    }
    // Store customer info for OTP sent screen
    if (customerName) setOtpCustomerName(customerName);
    if (customerPhone) setOtpCustomerPhone(customerPhone);
    if (salonName) setOtpSalonName(salonName);
    navigateTo('otp_sent');
  };

  // Render view with security guards
  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            onSelectSalon={handleSelectSalon}
            onNavigateToBooking={() => navigateTo('customer_booking')}
            onNavigateToSalons={() => navigateTo('salon_select')}
            onNavigateToPass={() => navigateTo('customer_pass')}
            onNavigateToBarber={() => navigateTo(isAuthenticated ? 'barber_station' : 'auth')}
            onNavigateToLogin={() => navigateTo('auth')}
          />
        );

      case 'customer_booking':
        return (
          <ServiceBookingView
            salonId={selectedSalonId}
            hasActivePass={Boolean(activePass)}
            onBookingConfirmed={handleBookingConfirmed}
            onNavigateToPassStatus={() => navigateTo('customer_pass')}
            onNavigateToSalons={() => navigateTo('salon_select')}
            onNavigateToBarberStation={() => navigateTo(isAuthenticated ? 'barber_station' : 'auth')}
            onNavigateToHome={() => navigateTo('home')}
            onNavigateToLogin={() => navigateTo('auth')}
          />
        );

      case 'otp_sent':
        return (
          <OtpSentView
            customerName={otpCustomerName}
            customerPhone={otpCustomerPhone}
            salonName={otpSalonName}
            onCorrectPhone={() => navigateTo('customer_booking')}
            onCheckQueue={() => navigateTo('customer_pass')}
            onBackToHome={() => navigateTo('home')}
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
            onSelectSalon={handleSelectSalon}
            onBackToBooking={() => navigateTo('home')}
            onNavigateToHome={() => navigateTo('home')}
          />
        );

      case 'auth':
      case 'barber_login': {
        return (
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#111113',
              padding: '24px 16px',
            }}
          >
            <AuthView
              onSuccess={(role) => {
                if (role === 'staff') {
                  navigateTo('barber_station');
                } else {
                  navigateTo('customer_booking');
                }
              }}
              onBack={() => navigateTo('home')}
            />
          </div>
        );
      }

      case 'barber_station':
        // Protected Route Guard: If not authenticated, show unified AuthView!
        if (!isAuthenticated) {
          return (
            <div
              style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#111113',
                padding: '24px 16px',
              }}
            >
              <AuthView
                onSuccess={(role) => {
                  if (role === 'staff') {
                    navigateTo('barber_station');
                  } else {
                    navigateTo('home');
                  }
                }}
                onBack={() => navigateTo('home')}
              />
            </div>
          );
        }
        return (
          <WorkstationDashboardView
            onNavigateToHome={() => navigateTo('home')}
            onLogout={() => {
              logout();
              navigateTo('home');
            }}
          />
        );

      default:
        return (
          <HomeView
            onSelectSalon={handleSelectSalon}
            onNavigateToBooking={() => navigateTo('customer_booking')}
            onNavigateToSalons={() => navigateTo('salon_select')}
            onNavigateToPass={() => navigateTo('customer_pass')}
            onNavigateToBarber={() => navigateTo(isAuthenticated ? 'barber_station' : 'auth')}
            onNavigateToLogin={() => navigateTo('auth')}
          />
        );
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {renderActiveView()}
    </div>
  );
};
