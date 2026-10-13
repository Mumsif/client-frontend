import { Icon } from '../../components/common/Icon';

/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - OTP SENT CONFIRMATION VIEW
 * ============================================================================
 * Shown immediately after the customer submits their booking & phone number.
 * Simulates an OTP SMS dispatch (mock/test mode - no real SMS sent).
 *
 * Features:
 * - Visual confirmation that OTP was "sent" to their phone
 * - Correct the phone number (back to booking modal)
 * - Didn't receive OTP? Resend with 60s countdown
 * - Check the Queue (go to PassStatusView)
 * - Back to Home / Salon Dashboard
 *
 * NOTE: This is test/mock mode. When Spring Boot backend is ready,
 * replace the mock dispatch with a real POST /api/otp/send call.
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';

export interface OtpSentViewProps {
  customerName: string;
  customerPhone: string;
  salonName?: string;
  onCorrectPhone: () => void;
  onCheckQueue: () => void;
  onBackToHome: () => void;
}

const RESEND_COOLDOWN = 60;

export const OtpSentView: React.FC<OtpSentViewProps> = ({
  customerName,
  customerPhone,
  salonName = 'Western Cutters',
  onCorrectPhone,
  onCheckQueue,
  onBackToHome,
}) => {
  const [resendCountdown, setResendCountdown] = useState<number>(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendCount, setResendCount] = useState<number>(0);
  const [justResent, setJustResent] = useState<boolean>(false);
  const [pulseActive, setPulseActive] = useState<boolean>(true);

  useEffect(() => {
    if (resendCountdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendCountdown((p) => p - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const t = setTimeout(() => setPulseActive(false), 3200);
    return () => clearTimeout(t);
  }, []);

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setResendCount((c) => c + 1);
    setCanResend(false);
    setResendCountdown(RESEND_COOLDOWN);
    setJustResent(true);
    setTimeout(() => setJustResent(false), 3000);
    // TODO (Backend): POST /api/otp/resend { phone: customerPhone }
    console.log('[Mock] OTP resent to', customerPhone);
  }, [canResend, customerPhone]);

  const rawDigits = customerPhone.replace(/\D/g, '');
  const displayPhone = `+94 ${rawDigits.slice(0, 2)} ${rawDigits.slice(2, 5)} ${rawDigits.slice(5)}`.trim();
  const maskedPhone = displayPhone.length > 6
    ? displayPhone.slice(0, displayPhone.length - 4).replace(/\d/g, '•') + displayPhone.slice(-4)
    : displayPhone;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111113',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(197,168,128,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#1A1A1E',
          borderRadius: '24px',
          border: '1px solid #2E2C2A',
          boxShadow: '0px 12px 48px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top gradient bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #D4AF37 0%, #C5A880 100%)' }} />

        <div style={{ padding: '36px 28px 28px' }}>

          {/* Icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {pulseActive && (
                <div style={{ position: 'absolute', width: '88px', height: '88px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.18)', animation: 'gs-pulse 1.3s ease-out infinite' }} />
              )}
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg, #C5A880 0%, #D4AF37 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 6px 24px rgba(212,175,55,0.3)', position: 'relative', zIndex: 1 }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#111113" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#F8F6F0', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
              Booking Confirmed
            </h1>
            <p style={{ fontSize: '14px', color: '#8E8A85', margin: 0, lineHeight: 1.6 }}>
              Hi <strong style={{ color: '#F8F6F0' }}>{customerName}</strong>, your booking pass
              has been sent to your mobile number.
            </p>
          </div>

          {/* SMS Verification Notice */}
          <div
            style={{
              margin: '20px 0 16px',
              padding: '14px 16px',
              backgroundColor: '#22201C',
              borderRadius: '12px',
              border: '1.5px solid #3E3A32',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #C5A880 0%, #D4AF37 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="check" size={20} color="#111113" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8F6F0', marginBottom: '2px' }}>
                Private Verification Code Sent via SMS
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#8E8A85', lineHeight: 1.4 }}>
                Show the SMS code to your barber when you arrive at the salon.
              </p>
            </div>
          </div>

          {/* Phone pill */}
          <div style={{ margin: '10px 0 18px', padding: '14px 16px', backgroundColor: '#161619', borderRadius: '14px', border: '1.5px solid #2E2C2A', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#222227', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round">
                <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', color: '#8E8A85', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '2px' }}>Customer Phone</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#F8F6F0', fontFamily: "'Courier New', monospace", letterSpacing: '1px' }}>{maskedPhone}</div>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#D4AF37', backgroundColor: '#26241F', padding: '4px 10px', borderRadius: '20px', border: '1px solid #3E3A32', flexShrink: 0 }}>
              {salonName}
            </div>
          </div>

          {/* Info banner */}
          <div style={{ padding: '12px 14px', backgroundColor: '#22201C', borderRadius: '12px', border: '1px solid #3E3A32', fontSize: '12px', color: '#D4AF37', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', lineHeight: 1.5 }}>
            <Icon name="check-circle" size={16} color="#D4AF37" />
            <span>
              Your digital booking pass is active. Check-in code is delivered privately to your SMS.
              {resendCount > 0 && <> · SMS resent <strong>{resendCount}×</strong></>}
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* 1. Primary: View Booking Pass */}
            <button
              id="btn-check-queue"
              type="button"
              onClick={onCheckQueue}
              style={{
                width: '100%',
                padding: '14px 20px',
                backgroundColor: '#D4AF37',
                color: '#111113',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0px 4px 18px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B8976C'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; }}
            >
              <Icon name="ticket" size={16} color="#111113" />
              <span>View Booking Pass & Live Queue</span>
            </button>

            {/* 2. Resend SMS */}
            <button
              id="btn-resend-otp"
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: canResend ? '#26241F' : '#161619',
                color: canResend ? '#D4AF37' : '#5C5854',
                border: '1px solid #2E2C2A',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: canResend ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
            >
              {justResent ? (
                <>
                  <Icon name="check" size={14} color="#D4AF37" />
                  <span>SMS Resent Successfully</span>
                </>
              ) : canResend ? (
                <>
                  <Icon name="send" size={14} color="#D4AF37" />
                  <span>Resend Confirmation SMS</span>
                </>
              ) : (
                <>
                  <Icon name="clock" size={14} color="#5C5854" />
                  <span>Resend available in {resendCountdown}s</span>
                </>
              )}
            </button>

            {/* 3. Correct phone */}
            <button
              id="btn-correct-phone"
              type="button"
              onClick={onCorrectPhone}
              style={{
                width: '100%',
                padding: '11px 20px',
                backgroundColor: '#1A1A1E',
                color: '#8E8A85',
                border: '1px solid #2E2C2A',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#222227';
                e.currentTarget.style.color = '#F8F6F0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1A1A1E';
                e.currentTarget.style.color = '#8E8A85';
              }}
            >
              <span>Edit Contact Number</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '2px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#2E2C2A' }} />
              <span style={{ fontSize: '11px', color: '#8E8A85', fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#2E2C2A' }} />
            </div>

            {/* 4. Back to Home */}
            <button
              id="btn-back-home"
              type="button"
              onClick={onBackToHome}
              style={{
                width: '100%', padding: '12px 20px',
                backgroundColor: 'transparent', color: '#8E8A85',
                border: 'none', borderRadius: '12px',
                fontWeight: 500, fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                transition: 'color 0.15s ease', fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#F8F6F0'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#8E8A85'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Back to Home / Dashboard
            </button>
          </div>
        </div>

        {/* Footer strip */}
        <div style={{ padding: '12px 28px', backgroundColor: '#141417', borderTop: '1px solid #2E2C2A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ fontSize: '11px', color: '#8E8A85', fontWeight: 500 }}>
            Secured by Trimly · Test Mode · No real SMS dispatched
          </span>
        </div>
      </div>

      <style>{`
        @keyframes gs-pulse {
          0%   { transform: scale(0.85); opacity: 0.7; }
          80%  { transform: scale(1.7);  opacity: 0;   }
          100% { transform: scale(1.7);  opacity: 0;   }
        }
      `}</style>
    </div>
  );
};
