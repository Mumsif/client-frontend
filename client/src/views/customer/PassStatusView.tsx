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

export interface PassStatusViewProps {
  pass?: AppointmentResponseDTO | null;
  onBackToBooking?: () => void;
  onNavigateToBarberStation?: () => void;
}

export const PassStatusView: React.FC<PassStatusViewProps> = ({
  pass: initialPass,
  onBackToBooking,
  onNavigateToBarberStation,
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
      // Demo fallback pass
      setPass({
        appointmentId: 'demo_pass_1042',
        ticketNumber: 'GS-1042',
        salonName: 'Classic Cuts Grooming Lab',
        salonAddress: 'Main Street, Akkaraipattu, Eastern Province',
        chairId: 'chair_1',
        chairName: 'Chair 1: Rifas',
        services: [
          {
            id: 'srv_1',
            name: 'Standard Fade Cut & Wash',
            category: 'haircut',
            durationMinutes: 30,
            priceLkr: 1800,
            description: 'Skin or taper fade sculpted with clipper-over-comb precision.',
          },
          {
            id: 'srv_2',
            name: 'Beard Sculpt & Herbal Steam',
            category: 'beard',
            durationMinutes: 25,
            priceLkr: 1200,
            description: 'Razor cheek alignment and deep conditioning argan butter infusion.',
          },
        ],
        customerName: 'Kasun Perera',
        customerPhone: '077 123 4567',
        scheduledTime: '15:15',
        estimatedChairTime: '15:15',
        totalDurationMinutes: 55,
        totalPriceLkr: 3000,
        otp: '8492',
        queuePosition: 2,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      });
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
        backgroundColor: '#F8F9FF',
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
        }}
      >
        {onBackToBooking && (
          <button
            type="button"
            onClick={onBackToBooking}
            style={{
              padding: '8px 14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D5E3FD',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#00685F',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Service Menu
          </button>
        )}

        {onNavigateToBarberStation && (
          <button
            type="button"
            onClick={onNavigateToBarberStation}
            style={{
              padding: '8px 14px',
              backgroundColor: '#00685F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Go to Workstation Board →
          </button>
        )}
      </div>

      {isLoading ? (
        <div style={{ padding: '60px', color: '#5C647A', textAlign: 'center' }}>
          Loading your active pass...
        </div>
      ) : pass ? (
        <div style={{ maxWidth: '480px', width: '100%' }}>
          <BookingPass pass={pass} onCancel={handleCancelBooking} onRefresh={loadPass} />
        </div>
      ) : (
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '36px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
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
              backgroundColor: '#EFF4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00685F',
            }}
          >
            🎫
          </div>
          <h3 style={{ margin: 0, color: '#0D1C2F' }}>No Active Booking Pass Found</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#5C647A' }}>
            Book your haircut or grooming package from the Service Menu to generate your digital OTP pass.
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
