/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - OTP VERIFICATION MODAL
 * ============================================================================
 * Connects with Spring Boot Barber Controller:
 * -> com.glowslot.controller.BarberController.java: verifyOtp
 * -> com.glowslot.service.QueueManagementService.java
 *
 * Implements tamper-resistant customer validation before seating.
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export interface OtpVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  chairId: string;
  chairName: string;
  appointmentId: string;
  customerName: string;
  ticketNumber: string;
  expectedOtp?: string;
  onConfirmVerify: (chairId: string, appointmentId: string, otp: string) => Promise<boolean>;
}

export const OtpVerifyModal: React.FC<OtpVerifyModalProps> = ({
  isOpen,
  onClose,
  chairId,
  chairName,
  appointmentId,
  customerName,
  ticketNumber,
  expectedOtp,
  onConfirmVerify,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '']);
      setErrorMessage(null);
      setTimeout(() => inputRefs[0].current?.focus(), 150);
    }
  }, [isOpen]);

  const handleDigitChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance
    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = digits.join('');
    if (fullOtp.length < 4) {
      setErrorMessage('Please enter all 4 digits of the OTP.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const success = await onConfirmVerify(chairId, appointmentId, fullOtp);
      if (success) {
        onClose();
      } else {
        setErrorMessage('Invalid OTP code. Please check with customer.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Validation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Customer OTP"
      subtitle={`Seating ${customerName} (${ticketNumber}) at ${chairName}`}
      maxWidth="420px"
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="emerald"
            size="md"
            onClick={handleVerify}
            isLoading={isSubmitting}
            disabled={digits.join('').length < 4}
          >
            Verify & Seat Customer
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        {expectedOtp && (
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: '#EFF4FF',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#00685F',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Demo Pass OTP: <strong>{expectedOtp}</strong>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              style={{
                width: '56px',
                height: '64px',
                borderRadius: '12px',
                border: digit ? '2px solid #00685F' : '1.5px solid #DAE2FD',
                backgroundColor: digit ? '#F4FFFC' : '#EFF4FF',
                textAlign: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '26px',
                color: '#0D1C2F',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </div>

        {errorMessage && (
          <p
            style={{
              color: '#EF4444',
              fontSize: '13px',
              margin: 0,
              fontWeight: 500,
            }}
          >
            {errorMessage}
          </p>
        )}

        <p
          style={{
            fontSize: '12px',
            color: '#5C647A',
            textAlign: 'center',
            margin: 0,
            lineHeight: '18px',
          }}
        >
          Customer receives this 4-digit code on their GlowSlot digital pass. Entering it starts the session timer.
        </p>
      </div>
    </Modal>
  );
};
