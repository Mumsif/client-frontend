/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - DELAY SYNC BUTTON COMPONENT
 * ============================================================================
 * Matches Figma Layer:
 * - Emergency Delay Action (+15m Shift)
 * - background: #DAE2FD; border-radius: 12px; min-height: 48px;
 * - Cascades +15 minute schedule shifts to downstream booked customers
 * - Handled by com.glowslot.service.QueueManagementService.java
 * ============================================================================
 */

import React, { useState } from 'react';

export interface DelaySyncButtonProps {
  onApplyDelay: () => Promise<void> | void;
  isLoading?: boolean;
}

export const DelaySyncButton: React.FC<DelaySyncButtonProps> = ({
  onApplyDelay,
  isLoading = false,
}) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleClick = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      setTimeout(() => setIsConfirming(false), 4000);
      return;
    }

    setIsConfirming(false);
    await onApplyDelay();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      title="Adds +15 minutes buffer to downstream queue and sends push updates"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '12px 18px',
        minHeight: '48px',
        backgroundColor: isConfirming ? '#FEF3C7' : '#DAE2FD',
        border: isConfirming ? '1.5px solid #F59E0B' : '1px solid transparent',
        borderRadius: '12px',
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        fontSize: '14px',
        color: isConfirming ? '#B45309' : '#00685F',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isConfirming ? '0 2px 8px rgba(245, 158, 11, 0.25)' : 'none',
      }}
      className="btn-delay-shift"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 14 14" />
        <path d="M16 12h4" />
      </svg>
      <span>
        {isLoading
          ? 'Broadcasting...'
          : isConfirming
          ? 'Confirm +15m Queue Shift?'
          : '+15m Shift'}
      </span>
    </button>
  );
};
