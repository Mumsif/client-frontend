/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - BARBER STATION REAL-TIME CHAIR BOARD
 * ============================================================================
 * Full implementation translating Figma CSS Layers:
 * - Barber Station Real-Time Chair Board
 * - TOP STATION UTILITY HEADER (Digital IST clock, Capacity badge, Wallet pill, Delay shift)
 * - ACTIVE CHAIRS MULTI-COLUMN BOARD (Chair 1 Rifas & Chair 2 Kannan)
 * - SALON STATS BAR (Operational Telemetry)
 *
 * Connects with Spring Boot:
 * - com.glowslot.controller.BarberController.java
 * - com.glowslot.service.QueueManagementService.java
 * - com.glowslot.service.WalletService.java (Rs. 50 deduction on service close)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useFirestoreQueue } from '../../hooks/useFirestoreQueue';
import { ChairColumn } from '../../components/barber/ChairColumn';
import { DelaySyncButton } from '../../components/barber/DelaySyncButton';
import { OtpVerifyModal } from '../../components/barber/OtpVerifyModal';
import { WalkInModal } from '../../components/barber/WalkInModal';
import { Badge } from '../../components/common/Badge';
import westernCuttersImg from '../../assets/salon_hero.jpg';

export interface WorkstationDashboardViewProps {
  onNavigateToCustomerBooking?: () => void;
  onLogout?: () => void;
}

export const WorkstationDashboardView: React.FC<WorkstationDashboardViewProps> = ({
  onNavigateToCustomerBooking,
  onLogout,
}) => {
  const {
    chairs,
    stats,
    wallet,
    isLoading,
    toastMessage,
    verifyOtp,
    completeService,
    applyDelayShift,
    registerWalkIn,
    toggleChairStatus,
    scheduleBreak,
    endBreak,
  } = useFirestoreQueue('salon_1');

  // Live Digital Clock state (IST format)
  const [currentTime, setCurrentTime] = useState<string>('');

  // Modals state
  const [otpModalState, setOtpModalState] = useState<{
    isOpen: boolean;
    chairId: string;
    chairName: string;
    appointmentId: string;
    customerName: string;
    ticketNumber: string;
    expectedOtp?: string;
  }>({
    isOpen: false,
    chairId: '',
    chairName: '',
    appointmentId: '',
    customerName: '',
    ticketNumber: '',
  });

  const [walkInModalState, setWalkInModalState] = useState<{
    isOpen: boolean;
    chairId: string;
    chairName: string;
  }>({
    isOpen: false,
    chairId: '',
    chairName: '',
  });

  // Wallet Top-up state simulation
  const [walletBalance, setWalletBalance] = useState<number>(wallet?.balanceLkr || 4250);

  useEffect(() => {
    if (wallet?.balanceLkr) {
      setWalletBalance(wallet.balanceLkr);
    }
  }, [wallet?.balanceLkr]);

  // Tick IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenWalkIn = (chairId: string) => {
    const chair = chairs.find((c) => c.chairId === chairId);
    setWalkInModalState({
      isOpen: true,
      chairId,
      chairName: chair ? `Chair ${chair.chairNumber} (${chair.barberName})` : 'Workstation',
    });
  };

  const handleGlobalDelayShift = async () => {
    // Apply cascading +15m shift to first active chair
    if (chairs.length > 0) {
      await applyDelayShift(chairs[0].chairId);
    }
  };

  const handleWalletTopUp = () => {
    setWalletBalance((prev) => prev + 1000);
    alert('Prepaid Dispatch Wallet credited with LKR 1,000 (Simulated Admin Top-up).');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F8F9FF',
        paddingBottom: '60px',
      }}
      className="workstation-dashboard-view"
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 10000,
            padding: '12px 20px',
            backgroundColor: toastMessage.type === 'success' ? '#00685F' : toastMessage.type === 'warning' ? '#B45309' : '#4648D4',
            color: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideUpFade 0.3s ease-out',
          }}
        >
          <span>✓</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Header (80px Backdrop blur) */}
      <header
        style={{
          width: '100%',
          height: '80px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1.5px solid #D5E3FD',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                flexShrink: 0,
              }}
            >
              <img
                src={westernCuttersImg}
                alt="Western Cutters Barbershop"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: '#0D1C2F' }}>
                Trimly <span style={{ color: '#00685F' }}>Barber Station</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="live-pulse-dot" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#00685F' }}>
                  Real-Time Chair Board · Western Cutters Akkaraipattu
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onNavigateToCustomerBooking && (
              <button
                type="button"
                onClick={onNavigateToCustomerBooking}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#EFF4FF',
                  border: '1px solid #DAE2FD',
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#00685F',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>← Customer Booking View</span>
              </button>
            )}

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  border: '1px solid #D5E3FD',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#5C647A',
                  cursor: 'pointer',
                }}
              >
                Exit Station
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Top Station Utility Header (160px from Figma) */}
      <div
        style={{
          maxWidth: '1280px',
          width: '100%',
          padding: '24px 24px 0',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.08), 0px 2px 4px -2px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Station Identity & Time Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#008378',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F4FFFC',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 9h-4V3H9v6H5a2 2 0 0 0-2 2v7h18v-7a2 2 0 0 0-2-2Z" />
                </svg>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 700, margin: 0, color: '#0D1C2F' }}>
                    Station Active
                  </h2>
                  <Badge variant="teal">CHAIRS 1 & 2</Badge>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#5C647A' }}>
                  Eastern Province Hub Sync
                </span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div style={{ width: '1px', height: '36px', backgroundColor: '#DAE2FD' }} className="desktop-only" />

            {/* Live Digital Clock (IST) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#EFF4FF',
                borderRadius: '12px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00685F" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#5C647A' }}>
                  CURRENT TIME (IST)
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: '18px',
                    color: '#0D1C2F',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {currentTime || '14:20:00 IST'}
                </span>
              </div>
            </div>

            {/* Capacity Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#DAE2FD',
                borderRadius: '12px',
              }}
            >
              <span className="live-pulse-dot" />
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: '#5C647A', fontWeight: 600 }}>
                  CHAIR OCCUPANCY
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '15px', color: '#0D1C2F' }}>
                  {chairs.filter((c) => c.status === 'BUSY').length} / {chairs.length} Chairs Active
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Prepaid Dispatch Wallet & Delay Shift Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Prepaid Dispatch Wallet Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                gap: '14px',
                backgroundColor: '#E6EEFF',
                borderRadius: '12px',
                minHeight: '48px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00685F" strokeWidth="2.2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: '15px',
                      color: '#0D1C2F',
                    }}
                  >
                    LKR {walletBalance.toLocaleString()}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#5C647A' }}>
                    Rs. 50 / cut platform fee
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWalletTopUp}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#00685F',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                + Top Up
              </button>
            </div>

            {/* Emergency Delay Action (+15m Shift) */}
            <DelaySyncButton onApplyDelay={handleGlobalDelayShift} />
          </div>
        </div>
      </div>

      {/* 3. Active Chairs Multi-Column Board (Grid with Chair 1 & Chair 2) */}
      <div
        style={{
          maxWidth: '1280px',
          width: '100%',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#5C647A', gridColumn: '1 / -1' }}>
            Connecting to Real-time Firestore Queue...
          </div>
        ) : (
          chairs.map((chair) => (
            <ChairColumn
              key={chair.chairId}
              chair={chair}
              onVerifyOtp={verifyOtp}
              onCompleteService={completeService}
              onRegisterWalkIn={registerWalkIn}
              onToggleStatus={toggleChairStatus}
              onOpenWalkInModal={handleOpenWalkIn}
              onScheduleBreak={scheduleBreak}
              onEndBreak={endBreak}
            />
          ))
        )}
      </div>

      {/* 4. Salon Stats Bar (Operational Telemetry) */}
      <div
        style={{
          maxWidth: '1280px',
          width: '100%',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: '#5C647A', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
              Today's Gross Bookings
            </span>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '24px',
                color: '#00685F',
                marginTop: '4px',
              }}
            >
              LKR {stats?.dailyRevenueLkr.toLocaleString() || '28,400'}
            </div>
            <span style={{ fontSize: '11px', color: '#3D4947' }}>Updated in real-time</span>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#5C647A', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
              Completed Appointments
            </span>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '24px',
                color: '#0D1C2F',
                marginTop: '4px',
              }}
            >
              {stats?.completedAppointmentsCount || 16} Serviced
            </div>
            <span style={{ fontSize: '11px', color: '#3D4947' }}>Rs. 50 commission cleared</span>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#5C647A', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
              Avg. Turnaround Time
            </span>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '24px',
                color: '#0D1C2F',
                marginTop: '4px',
              }}
            >
              {stats?.avgTurnaroundMinutes || 24} Mins
            </div>
            <span style={{ fontSize: '11px', color: '#00685F' }}>Within target variance</span>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#5C647A', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
              Queue Velocity Score
            </span>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '24px',
                color: '#4648D4',
                marginTop: '4px',
              }}
            >
              {stats?.queueVelocityScore || 98}% On-Time
            </div>
            <span style={{ fontSize: '11px', color: '#3D4947' }}>Optimal salon flow</span>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OtpVerifyModal
        isOpen={otpModalState.isOpen}
        onClose={() => setOtpModalState((s) => ({ ...s, isOpen: false }))}
        chairId={otpModalState.chairId}
        chairName={otpModalState.chairName}
        appointmentId={otpModalState.appointmentId}
        customerName={otpModalState.customerName}
        ticketNumber={otpModalState.ticketNumber}
        expectedOtp={otpModalState.expectedOtp}
        onConfirmVerify={async (cId, aId, otp) => {
          return await verifyOtp({ chairId: cId, appointmentId: aId, otp });
        }}
      />

      {/* Walk-in Registration Modal */}
      <WalkInModal
        isOpen={walkInModalState.isOpen}
        onClose={() => setWalkInModalState((s) => ({ ...s, isOpen: false }))}
        chairId={walkInModalState.chairId}
        chairName={walkInModalState.chairName}
        onConfirmWalkIn={registerWalkIn}
      />
    </div>
  );
};
