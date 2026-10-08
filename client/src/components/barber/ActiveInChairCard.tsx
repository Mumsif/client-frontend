/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - ACTIVE IN-CHAIR CARD COMPONENT
 * ============================================================================
 * Direct extraction from Figma CSS:
 * - CURRENT IN-CHAIR (High-Contrast Emerald Card)
 * - background: #008378; border-radius: 12px
 * - Complete Service & Release Chair Button (48px Touch Target)
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
          backgroundColor: '#F8F9FF',
          border: '2px dashed #008378',
          borderRadius: '12px',
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
            backgroundColor: '#EFF4FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00685F',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0D1C2F' }}>
            Chair Currently Vacant
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#5C647A' }}>
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
        backgroundColor: '#008378',
        borderRadius: '12px',
        boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
        color: '#F4FFFC',
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
            stroke="#F4FFFC"
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
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '0.65px',
              textTransform: 'uppercase',
              color: '#F4FFFC',
            }}
          >
            CURRENT IN-CHAIR
          </span>
        </div>

        {/* White Pill Badge with Ticket # */}
        <div
          style={{
            padding: '4px 10px',
            backgroundColor: '#FFFFFF',
            borderRadius: '9999px',
            color: '#0D1C2F',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.13px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
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
              fontSize: '32px',
              lineHeight: '36px',
              letterSpacing: '-0.72px',
              color: '#F4FFFC',
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
              color: 'rgba(244, 255, 252, 0.9)',
              margin: '2px 0 0',
            }}
          >
            {serviceNames}
          </p>

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: 'rgba(244, 255, 252, 0.8)',
              marginTop: '4px',
            }}
          >
            Started at {startedAt} · Active Session
          </span>
        </div>

        {/* Live Progress Countdown Box (Glassmorphic) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#F4FFFC',
                animation: 'countdownBlink 1.5s infinite',
              }}
            />
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                letterSpacing: '0.13px',
                color: 'rgba(244, 255, 252, 0.85)',
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
              color: '#F4FFFC',
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
              color: 'rgba(244, 255, 252, 0.75)',
            }}
          >
            Est. Complete ~{remainingMinutes}m
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
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: '16px',
          color: '#00685F',
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
          stroke="#00685F"
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
