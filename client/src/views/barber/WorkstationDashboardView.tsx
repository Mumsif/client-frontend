/**
 * ============================================================================
 * TRIMLY - BARBER STATION REAL-TIME CHAIR BOARD
 * ============================================================================
 * Modern Noir & Champagne Gold Luxury Styling:
 * - Barber Station Real-Time Chair Board
 * - TOP STATION UTILITY HEADER (Digital IST clock, Capacity badge, Wallet pill, Delay shift)
 * - ACTIVE CHAIRS MULTI-COLUMN BOARD (Chair 1 Dhanu & Chair 2 Thambi)
 * - SALON STATS BAR (Operational Telemetry)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useFirestoreQueue } from '../../hooks/useFirestoreQueue';
import { ChairColumn } from '../../components/barber/ChairColumn';
import { DelaySyncButton } from '../../components/barber/DelaySyncButton';
import { OtpVerifyModal } from '../../components/barber/OtpVerifyModal';
import { WalkInModal } from '../../components/barber/WalkInModal';
import { PaymentModal } from '../../components/barber/PaymentModal';
import { Badge } from '../../components/common/Badge';
import { Icon } from '../../components/common/Icon';
import westernCuttersImg from '../../assets/salon_hero.jpg';

export interface WorkstationDashboardViewProps {
  onLogout?: () => void;
  onNavigateToHome?: () => void;
}

export const WorkstationDashboardView: React.FC<WorkstationDashboardViewProps> = ({
  onLogout,
  onNavigateToHome,
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

  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    chairId: string;
    chairNumber: number;
    barberName: string;
    customerData: {
      appointmentId: string;
      ticketNumber: string;
      customerName: string;
      serviceNames: string;
      totalAmountLkr?: number;
    };
  }>({
    isOpen: false,
    chairId: '',
    chairNumber: 1,
    barberName: '',
    customerData: {
      appointmentId: '',
      ticketNumber: '',
      customerName: '',
      serviceNames: '',
    },
  });

  const handleOpenPaymentModal = (chairId: string, appointmentId: string) => {
    const chair = chairs.find((c) => c.chairId === chairId);
    if (!chair || !chair.activeInChair) {
      completeService(chairId, appointmentId);
      return;
    }
    setPaymentModalState({
      isOpen: true,
      chairId,
      chairNumber: chair.chairNumber,
      barberName: chair.barberName,
      customerData: {
        appointmentId,
        ticketNumber: chair.activeInChair.ticketNumber,
        customerName: chair.activeInChair.customerName,
        serviceNames: chair.activeInChair.serviceNames,
        totalAmountLkr: chair.activeInChair.serviceNames.toLowerCase().includes('beard') ? 800 : 400,
      },
    });
  };

  const handleConfirmPayment = async (
    chairId: string,
    appointmentId: string,
    _paymentMethod: string,
    _amount: number
  ) => {
    await completeService(chairId, appointmentId);
  };

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
        }) + ' IST'
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenWalkIn = (chairId: string) => {
    const chair = chairs.find((c) => c.chairId === chairId);
    setWalkInModalState({
      isOpen: true,
      chairId,
      chairName: chair ? `Chair ${chair.chairNumber} (${chair.barberName})` : 'Barber Chair',
    });
  };

  const handleGlobalDelayShift = async () => {
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
        backgroundColor: '#111113',
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
            backgroundColor: toastMessage.type === 'success' ? '#D4AF37' : toastMessage.type === 'warning' ? '#E5A93C' : '#C5A880',
            color: '#111113',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideUpFade 0.3s ease-out',
          }}
        >
          <Icon name="check" size={14} color="#111113" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Header (68px) */}
      <header
        className="trimly-header-padding"
        style={{
          width: '100%',
          minHeight: '68px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(20, 20, 23, 0.95)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.8)',
          borderBottom: '1px solid #2E2C2A',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            className="trimly-logo-link"
            role="button"
            tabIndex={0}
            onClick={() => {
              if (onNavigateToHome) onNavigateToHome();
              else window.location.hash = '#/';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (onNavigateToHome) onNavigateToHome();
                else window.location.hash = '#/';
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
            title="Return to Trimly Home"
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1.5px solid #2E2C2A',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                flexShrink: 0,
              }}
            >
              <img
                src={westernCuttersImg}
                alt="Western Cutters Barbershop"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '16px',
                  color: '#F8F6F0',
                  letterSpacing: '-0.3px',
                  whiteSpace: 'nowrap',
                  lineHeight: '1.2',
                }}
              >
                Trimly <span style={{ color: '#D4AF37' }}>Barber Station</span>
              </span>
              <div
                className="trimly-header-tagline"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span className="live-pulse-dot" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#D4AF37', whiteSpace: 'nowrap' }}>
                  Real-Time Chair Board · Western Cutters
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                style={{
                  padding: '7px 11px',
                  backgroundColor: 'transparent',
                  border: '1px solid #2E2C2A',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#8E8A85',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
                title="Exit Station"
              >
                <span className="mobile-hide">Exit Station</span>
                <span className="mobile-only-inline">Exit</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Top Station Utility Header */}
      <div
        className="trimly-content-padding"
        style={{
          maxWidth: '1280px',
          width: '100%',
          paddingTop: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: '#1A1A1E',
            border: '1px solid #2E2C2A',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.6)',
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
                  backgroundColor: '#26241F',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 9h-4V3H9v6H5a2 2 0 0 0-2 2v7h18v-7a2 2 0 0 0-2-2Z" />
                </svg>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 700, margin: 0, color: '#F8F6F0' }}>
                    Station Active
                  </h2>
                  <Badge variant="teal">CHAIRS 1 & 2</Badge>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8E8A85' }}>
                  Eastern Province Hub Sync
                </span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div style={{ width: '1px', height: '36px', backgroundColor: '#2E2C2A' }} className="desktop-only" />

            {/* Live Digital Clock (IST) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#161619',
                border: '1px solid #2E2C2A',
                borderRadius: '12px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8E8A85' }}>
                  CURRENT TIME (IST)
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: '17px',
                    color: '#F8F6F0',
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
                backgroundColor: '#161619',
                border: '1px solid #2E2C2A',
                borderRadius: '12px',
              }}
            >
              <span className="live-pulse-dot" />
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: '#8E8A85', fontWeight: 600 }}>
                  CHAIR OCCUPANCY
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '15px', color: '#D4AF37' }}>
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
                backgroundColor: '#161619',
                border: '1px solid #2E2C2A',
                borderRadius: '12px',
                minHeight: '48px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.2">
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
                      color: '#D4AF37',
                    }}
                  >
                    LKR {walletBalance.toLocaleString()}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8E8A85' }}>
                    Rs. 50 / cut platform fee
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWalletTopUp}
                style={{
                  padding: '6px 14px',
                  backgroundColor: '#D4AF37',
                  borderRadius: '8px',
                  color: '#111113',
                  border: 'none',
                  fontSize: '12px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.35)',
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
        className="trimly-content-padding"
        style={{
          maxWidth: '1280px',
          width: '100%',
          paddingTop: '20px',
          paddingBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '20px',
          boxSizing: 'border-box',
        }}
      >
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#8E8A85', gridColumn: '1 / -1' }}>
            Connecting to Real-time Firestore Queue...
          </div>
        ) : (
          chairs.map((chair) => (
            <ChairColumn
              key={chair.chairId}
              chair={chair}
              onVerifyOtp={verifyOtp}
              onCompleteService={handleOpenPaymentModal}
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
        className="trimly-content-padding"
        style={{
          maxWidth: '1280px',
          width: '100%',
          paddingBottom: '36px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            backgroundColor: '#1A1A1E',
            border: '1px solid #2E2C2A',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.6)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: '#8E8A85', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
              Today's Gross Bookings
            </span>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '24px',
                color: '#D4AF37',
                marginTop: '4px',
              }}
            >
              LKR {stats?.dailyRevenueLkr.toLocaleString() || '28,400'}
            </div>
            <span style={{ fontSize: '11px', color: '#8E8A85' }}>Updated in real-time</span>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#8E8A85', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
              Completed Appointments
            </span>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '24px',
                color: '#F8F6F0',
                marginTop: '4px',
              }}
            >
              {stats?.completedAppointmentsCount || 16} Serviced
            </div>
            <span style={{ fontSize: '11px', color: '#8E8A85' }}>Rs. 50 commission cleared</span>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#8E8A85', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
              Avg. Turnaround Time
            </span>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '24px',
                color: '#F8F6F0',
                marginTop: '4px',
              }}
            >
              {stats?.avgTurnaroundMinutes || 24} Mins
            </div>
            <span style={{ fontSize: '11px', color: '#D4AF37' }}>Within target variance</span>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#8E8A85', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
              Queue Velocity Score
            </span>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '24px',
                color: '#D4AF37',
                marginTop: '4px',
              }}
            >
              {stats?.queueVelocityScore || 98}% On-Time
            </div>
            <span style={{ fontSize: '11px', color: '#8E8A85' }}>Optimal salon flow</span>
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

      {/* Haircut Finished & Payment Settlement Modal */}
      <PaymentModal
        isOpen={paymentModalState.isOpen}
        onClose={() => setPaymentModalState((s) => ({ ...s, isOpen: false }))}
        chairId={paymentModalState.chairId}
        chairNumber={paymentModalState.chairNumber}
        barberName={paymentModalState.barberName}
        customerData={paymentModalState.customerData}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
};
