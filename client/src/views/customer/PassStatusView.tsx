/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - PASS STATUS VIEW (LIVE QUEUE TRACKER)
 * ============================================================================
 * Displays the customer's digital booking pass with live queue countdown,
 * 4-digit OTP card, and real-time status.
 *
 * Connects with Spring Boot:
 * - com.glowslot.controller.PublicBookingController.java: getBookingPass
 * - com.glowslot.controller.PublicBookingController.java: cancelBooking
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { bookingApi, type AppointmentResponseDTO } from '../../api/bookingApi';
import { BookingPass } from '../../components/customer/BookingPass';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';

export interface PassStatusViewProps {
  pass?: AppointmentResponseDTO | null;
  onBackToBooking?: () => void;
}

export const PassStatusView: React.FC<PassStatusViewProps> = ({
  pass: initialPass,
  onBackToBooking,
}) => {
  const [pass, setPass] = useState<AppointmentResponseDTO | null>(initialPass || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialPass);

  const loadPass = async () => {
    setIsLoading(true);
    const stored = localStorage.getItem('glowslot_active_pass');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AppointmentResponseDTO;
        const fresh = await bookingApi.getBookingPass(parsed.appointmentId);
        setPass(fresh || parsed);
      } catch {
        setPass(null);
      }
    } else {
      setPass(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!initialPass) {
      loadPass();
    } else {
      setPass(initialPass);
    }
  }, [initialPass]);

  const handleCancelBooking = async (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel your appointment? (Free cancellation up to 30 mins before)')) {
      await bookingApi.cancelBooking(appointmentId);
      setPass(null);
      alert('Booking cancelled successfully.');
      if (onBackToBooking) onBackToBooking();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#111113',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px 80px',
      }}
      className="pass-status-view"
    >
      {/* Top Navbar */}
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '12px',
        }}
      >
        <div
          className="trimly-logo-link"
          role="button"
          tabIndex={0}
          onClick={() => { window.location.hash = '#/'; }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          title="Return to Trimly Home"
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #C5A880 0%, #D4AF37 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111113',
              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.25)',
            }}
          >
            <Icon name="scissors" size={15} color="#111113" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '17px', color: '#F8F6F0', lineHeight: 1.2 }}>
              Trimly
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8E8A85' }}>
              Smart Salon Booking
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBackToBooking && (
            <button
              type="button"
              onClick={onBackToBooking}
              style={{
                padding: '6px 12px',
                backgroundColor: '#1A1A1E',
                border: '1px solid #2E2C2A',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#D4AF37',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease',
              }}
            >
              ← Services
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#D4AF37', fontWeight: 600 }}>
            <span className="live-pulse-dot" />
            <span>Live Queue</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '60px', color: '#8E8A85', textAlign: 'center' }}>
          Loading your active pass...
        </div>
      ) : pass ? (
        <div style={{ maxWidth: '480px', width: '100%' }}>
          <BookingPass
            pass={pass}
            onCancel={handleCancelBooking}
            onRefresh={loadPass}
          />
        </div>
      ) : (
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            backgroundColor: '#1A1A1E',
            border: '1px solid #2E2C2A',
            borderRadius: '16px',
            padding: '36px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#26241F',
              border: '1px solid #3E3A32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="ticket" size={26} color="#D4AF37" />
          </div>
          <h3 style={{ margin: 0, color: '#F8F6F0' }}>No Active Booking Pass Found</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#8E8A85' }}>
            Book your haircut or grooming package from the Service Menu to generate your digital booking pass.
          </p>
          {onBackToBooking && (
            <Button variant="primary" size="md" onClick={onBackToBooking}>
              Browse Service Menu
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
