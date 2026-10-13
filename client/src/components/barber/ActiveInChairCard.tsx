/**
 * ============================================================================
 * TRIMLY - ACTIVE IN-CHAIR CARD COMPONENT
 * ============================================================================
 * Modern Noir & Champagne Gold Luxury Styling:
 * - CURRENT IN-CHAIR (Editorial Noir & Champagne Gold Station Card)
 * - background: #1A1A1E; border: 1.5px solid #D4AF37
 * - Complete Service & Release Chair Button (48px Touch Target in Champagne Gold)
 * - Live Progress Countdown with second-by-second ticking
 * ============================================================================
 */

import React from 'react';
import { Button } from '../common/Button';

export interface ActiveInChairCardProps {
  chairId: string;
  chairNumber: number;
  barberName: string;
  activeData?: {
    appointmentId: string;
    ticketNumber: string;
    customerName: string;
    serviceNames: string;
    startedAt: string;
    totalDurationMinutes: number;
    remainingMinutes: number;
    remainingSeconds: number;
  };
  onCompleteService: (chairId: string, appointmentId: string) => void;
  onOpenWalkIn?: () => void;
}

export const ActiveInChairCard: React.FC<ActiveInChairCardProps> = ({
  chairId,
  activeData,
  onCompleteService,
  onOpenWalkIn,
}) => {
  // If no customer currently seated in chair
  if (!activeData) {
    return (
      <div
        style={{
          width: '100%',
          minHeight: '220px',
          backgroundColor: '#161619',
          border: '2px dashed #2E2C2A',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#24221F',
            border: '1px solid #2E2C2A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D4AF37',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#F8F6F0' }}>
            Chair Currently Vacant
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#8E8A85' }}>
            Verify next OTP from queue below or seat immediate walk-in client.
          </p>
        </div>
        {onOpenWalkIn && (
          <Button variant="emerald" size="sm" onClick={onOpenWalkIn}>
            + Seat Walk-in Customer
          </Button>
        )}
      </div>
    );
  }

  const {
    appointmentId,
    ticketNumber,
    customerName,
    serviceNames,
    startedAt,
    remainingMinutes,
    remainingSeconds,
  } = activeData;

  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '24px',
        gap: '16px',
        width: '100%',
        backgroundColor: '#1A1A1E',
        borderRadius: '16px',
        border: '1.5px solid #D4AF37',
        boxShadow: '0px 8px 32px rgba(212, 175, 55, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.35)',
        color: '#F8F6F0',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
      className="active-in-chair-emerald-card"
    >
      {/* Top Meta Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Chair Icon */}
          <svg
            width="14"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 9h-4V3H9v6H5a2 2 0 0 0-2 2v7h18v-7a2 2 0 0 0-2-2Z" />
            <path d="M6 18v3" />
            <path d="M18 18v3" />
          </svg>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.65px',
              textTransform: 'uppercase',
              color: '#D4AF37',
            }}
          >
            CURRENT IN-CHAIR
          </span>
        </div>

        {/* Champagne Gold Pill Badge with Ticket # */}
        <div
          style={{
            padding: '4px 12px',
            backgroundColor: '#D4AF37',
            borderRadius: '9999px',
            color: '#111113',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.13px',
            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.35)',
          }}
        >
          {ticketNumber}
        </div>
      </div>

      {/* Center Details and Countdown Timer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Customer & Service Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '30px',
              lineHeight: '36px',
              letterSpacing: '-0.72px',
              color: '#F8F6F0',
              margin: 0,
            }}
          >
            {customerName}
          </h3>

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              lineHeight: '20px',
              color: '#C5A880',
              margin: '2px 0 0',
            }}
          >
            {serviceNames}
          </p>

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#8E8A85',
              marginTop: '4px',
            }}
          >
            Started at {startedAt} · Active Session
          </span>
        </div>

        {/* Live Progress Countdown Box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: '10px 18px',
            backgroundColor: '#141417',
            borderRadius: '12px',
            border: '1px solid #2E2C2A',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#D4AF37',
                animation: 'countdownBlink 1.5s infinite',
              }}
            />
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.5px',
                color: '#8E8A85',
              }}
            >
              TIME LEFT
            </span>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '30px',
              color: '#D4AF37',
              letterSpacing: '-0.4px',
              margin: '2px 0',
            }}
          >
            {remainingMinutes}:{formattedSeconds}
          </div>

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#8E8A85',
            }}
          >
            Est. Complete {remainingMinutes}m
          </span>
        </div>
      </div>

      {/* Complete Service & Release Chair Button (48px Touch Target) */}
      <button
        type="button"
        onClick={() => onCompleteService(chairId, appointmentId)}
        style={{
          width: '100%',
          minHeight: '48px',
          backgroundColor: '#D4AF37',
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0px 4px 16px rgba(212, 175, 55, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: '16px',
          color: '#111113',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none',
          marginTop: '4px',
        }}
        className="btn-complete-service"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111113"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>Complete Service & Release Chair</span>
      </button>
    </div>
  );
};
