/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - APP ROUTES & VIEW NAVIGATION
 * ============================================================================
 * Coordinates seamless switching between Customer flows and Barber Station:
 * - Public Customer Routes:
 *   - ServiceBookingView: Customer Booking & Service Menu (Figma layout)
 *   - PassStatusView: Live Queue Pass Tracker with 4-Digit OTP
 *   - SalonSelectView: Akkaraipattu Pilot Salon Directory
 * - Protected Barber Workstation Routes:
 *   - BarberLoginView: PIN authorization
 *   - WorkstationDashboardView: Real-Time Chair Board (Chair 1 & Chair 2)
 * ============================================================================
 */

import React, { useState } from 'react';
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
  const [currentView, setCurrentView] = useState<AppViewMode>('customer_booking');
  const [activePass, setActivePass] = useState<AppointmentResponseDTO | null>(null);

  const handleBookingConfirmed = (pass: AppointmentResponseDTO) => {
    setActivePass(pass);
    setCurrentView('customer_pass');
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'customer_booking':
        return (
          <ServiceBookingView
            onBookingConfirmed={handleBookingConfirmed}
            onNavigateToBarberStation={() => setCurrentView(isAuthenticated ? 'barber_station' : 'barber_login')}
            onNavigateToPassStatus={() => setCurrentView('customer_pass')}
          />
        );

      case 'customer_pass':
        return (
          <PassStatusView
            pass={activePass}
            onBackToBooking={() => setCurrentView('customer_booking')}
            onNavigateToBarberStation={() => setCurrentView(isAuthenticated ? 'barber_station' : 'barber_login')}
          />
        );

      case 'salon_select':
        return (
          <SalonSelectView
            onSelectSalon={() => setCurrentView('customer_booking')}
            onNavigateToBarberStation={() => setCurrentView(isAuthenticated ? 'barber_station' : 'barber_login')}
          />
        );

      case 'barber_login':
        return (
          <BarberLoginView
            onLoginSuccess={() => setCurrentView('barber_station')}
            onBackToCustomer={() => setCurrentView('customer_booking')}
          />
        );

      case 'barber_station':
        return (
          <WorkstationDashboardView
            onNavigateToCustomerBooking={() => setCurrentView('customer_booking')}
            onLogout={() => {
              logout();
              setCurrentView('barber_login');
            }}
          />
        );

      default:
        return (
          <ServiceBookingView
            onBookingConfirmed={handleBookingConfirmed}
            onNavigateToBarberStation={() => setCurrentView('barber_login')}
          />
        );
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* View Switcher Quick Floating Badge on Top Right */}
      <div
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          zIndex: 99999,
          display: 'flex',
          gap: '6px',
          backgroundColor: 'rgba(13, 28, 47, 0.88)',
          padding: '4px',
          borderRadius: '9999px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        <button
          type="button"
          onClick={() => setCurrentView('customer_booking')}
          style={{
            padding: '5px 12px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: currentView === 'customer_booking' ? '#00685F' : 'transparent',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Customer Menu
        </button>
        <button
          type="button"
          onClick={() => setCurrentView('customer_pass')}
          style={{
            padding: '5px 12px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: currentView === 'customer_pass' ? '#00685F' : 'transparent',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Live Pass
        </button>
        <button
          type="button"
          onClick={() => setCurrentView(isAuthenticated ? 'barber_station' : 'barber_login')}
          style={{
            padding: '5px 12px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: currentView === 'barber_station' ? '#008378' : 'transparent',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Barber Board
        </button>
      </div>

      {renderActiveView()}
    </div>
  );
};
