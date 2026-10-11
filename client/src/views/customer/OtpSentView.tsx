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
  customerOtp?: string;
  salonName?: string;
  onCorrectPhone: () => void;
  onCheckQueue: () => void;
  onBackToHome: () => void;
}

const RESEND_COOLDOWN = 60;

export const OtpSentView: React.FC<OtpSentViewProps> = ({
  customerName,
  customerPhone,
  customerOtp,
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
        background: 'linear-gradient(160deg, #EFF4FF 0%, #F5F0FF 50%, #F0FBF9 100%)',
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
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,104,95,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(70,72,212,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0px 12px 48px rgba(0,0,0,0.08), 0px 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top gradient bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #00685F 0%, #4648D4 100%)' }} />

        <div style={{ padding: '36px 28px 28px' }}>

          {/* Icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {pulseActive && (
                <div style={{ position: 'absolute', width: '88px', height: '88px', borderRadius: '50%', backgroundColor: 'rgba(0,104,95,0.14)', animation: 'gs-pulse 1.3s ease-out infinite' }} />
              )}
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg, #00685F 0%, #008378 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 6px 24px rgba(0,104,95,0.32)', position: 'relative', zIndex: 1 }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0D1C2F', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
              Booking Confirmed
            </h1>
            <p style={{ fontSize: '14px', color: '#5C647A', margin: 0, lineHeight: 1.6 }}>
              Hi <strong style={{ color: '#0D1C2F' }}>{customerName}</strong>, your booking pass
              has been sent to your mobile number.
            </p>
          </div>

          {/* Booking pass info */}
          {customerOtp && (
            <div
              style={{
                margin: '20px 0 16px',
                padding: '14px 16px',
                backgroundColor: '#F4FFFC',
                borderRadius: '12px',
                border: '1.5px solid #B2DDD9',
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
                  backgroundColor: '#00685F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name="check" size={20} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0D1C2F', marginBottom: '2px' }}>
                  Verification code sent via SMS
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#3D4947', lineHeight: 1.4 }}>
                  Show the code to your barber when you arrive at the salon.
                </p>
              </div>
            </div>
          )}

          {/* Phone pill */}
          <div style={{ margin: customerOtp ? '10px 0 18px' : '20px 0', padding: '14px 16px', backgroundColor: '#F0F4FF', borderRadius: '14px', border: '1.5px solid #D5E3FD', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#E8EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4648D4" strokeWidth="2.5" strokeLinecap="round">
                <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', color: '#5C647A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '2px' }}>Customer Phone</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0D1C2F', fontFamily: "'Courier New', monospace", letterSpacing: '1px' }}>{maskedPhone}</div>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#00685F', backgroundColor: '#E6F4F3', padding: '4px 10px', borderRadius: '20px', border: '1px solid #B2DDD9', flexShrink: 0 }}>
              {salonName}
            </div>
          </div>

          {/* Info banner */}
          <div style={{ padding: '12px 14px', backgroundColor: '#F0FBF9', borderRadius: '12px', border: '1px solid #B2DDD9', fontSize: '12px', color: '#00685F', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', lineHeight: 1.5 }}>
            <Icon name="check-circle" size={16} color="#00685F" />
            <span>
              Your digital booking pass and appointment PIN are ready.
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
                backgroundColor: '#00685F',
                color: '#FFFFFF',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0px 4px 16px rgba(0, 104, 95, 0.3)',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
            >
              <Icon name="ticket" size={16} color="#FFFFFF" />
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
                backgroundColor: canResend ? '#EFF4FF' : '#F8FAFC',
                color: canResend ? '#00685F' : '#94A3B8',
                border: '1px solid #E2E8F0',
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
                  <Icon name="check" size={14} color="#00685F" />
                  <span>SMS Resent Successfully</span>
                </>
              ) : canResend ? (
                <>
                  <Icon name="send" size={14} color="#00685F" />
                  <span>Resend Confirmation SMS</span>
                </>
              ) : (
                <>
                  <Icon name="clock" size={14} color="#94A3B8" />
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
                backgroundColor: '#FFFFFF',
                color: '#5C647A',
                border: '1px solid #E2E8F0',
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
                e.currentTarget.style.backgroundColor = '#F8F9FF';
                e.currentTarget.style.color = '#0D1C2F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#5C647A';
              }}
            >
              <span>Edit Contact Number</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '2px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              <span style={{ fontSize: '11px', color: '#9AA5B4', fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            </div>

            {/* 4. Back to Home */}
            <button
              id="btn-back-home"
              type="button"
              onClick={onBackToHome}
              style={{
                width: '100%', padding: '12px 20px',
                backgroundColor: 'transparent', color: '#5C647A',
                border: 'none', borderRadius: '12px',
                fontWeight: 500, fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                transition: 'color 0.15s ease', fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#0D1C2F'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#5C647A'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Back to Home / Dashboard
            </button>
          </div>
        </div>

        {/* Footer strip */}
        <div style={{ padding: '12px 28px', backgroundColor: '#F8F9FF', borderTop: '1px solid #EEF0F5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00685F" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ fontSize: '11px', color: '#9AA5B4', fontWeight: 500 }}>
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
