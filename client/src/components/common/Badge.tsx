/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - COMMON BADGE COMPONENT
 * ============================================================================
 * Reproduces the badges from the Figma design:
 * - Teal Overlay: rgba(0, 104, 95, 0.1) / #00685F
 * - Blue Pill: #DAE2FD / #131B2E
 * - Indigo Pill: #6063EE / #FFFBFF
 * - Amber Pill: #FEF3C7 / #B45309
 * - JetBrains Mono numbers and timers
 * ============================================================================
 */

import React, { type ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'teal' | 'blue' | 'indigo' | 'amber' | 'soft' | 'mint' | 'dark' | 'gold' | 'slate';
  isPill?: boolean;
  isMono?: boolean;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  isPill = true,
  isMono = false,
  dot = false,
  className = '',
  style = {},
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'gold':
      case 'teal':
        return {
          backgroundColor: 'rgba(212, 175, 55, 0.14)',
          color: '#D4AF37',
          border: '1px solid rgba(212, 175, 55, 0.28)',
        };
      case 'slate':
      case 'blue':
        return {
          backgroundColor: '#222227',
          color: '#8E8A85',
          border: '1px solid #2E2C2A',
        };
      case 'indigo':
        return {
          backgroundColor: 'rgba(197, 168, 128, 0.16)',
          color: '#C5A880',
          border: '1px solid rgba(197, 168, 128, 0.3)',
        };
      case 'amber':
        return {
          backgroundColor: 'rgba(229, 169, 60, 0.15)',
          color: '#E5A93C',
          border: '1px solid rgba(229, 169, 60, 0.3)',
        };
      case 'mint':
        return {
          backgroundColor: 'rgba(212, 175, 55, 0.12)',
          color: '#F8F6F0',
          border: '1px solid rgba(212, 175, 55, 0.22)',
        };
      case 'dark':
        return {
          backgroundColor: '#111113',
          color: '#F8F6F0',
          border: '1px solid #2E2C2A',
        };
      case 'soft':
      default:
        return {
          backgroundColor: '#1E1E24',
          color: '#8E8A85',
          border: '1px solid #2E2C2A',
        };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 8px',
        fontSize: '11px',
        fontWeight: 600,
        lineHeight: '16px',
        letterSpacing: isMono ? '0.22px' : '0.13px',
        borderRadius: isPill ? '9999px' : '4px',
        fontFamily: isMono ? "'JetBrains Mono', monospace" : "'Plus Jakarta Sans', sans-serif",
        whiteSpace: 'nowrap',
        ...getVariantStyles(),
        ...style,
      }}
      className={`badge-component ${className}`}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </span>
  );
};
