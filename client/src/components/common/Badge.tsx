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
  variant?: 'teal' | 'blue' | 'indigo' | 'amber' | 'soft' | 'mint' | 'dark';
  isPill?: boolean;
  isMono?: boolean;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'teal',
  isPill = true,
  isMono = false,
  dot = false,
  className = '',
  style = {},
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'teal':
        return {
          backgroundColor: 'rgba(0, 104, 95, 0.1)',
          color: '#00685F',
        };
      case 'blue':
        return {
          backgroundColor: '#DAE2FD',
          color: '#131B2E',
        };
      case 'indigo':
        return {
          backgroundColor: '#6063EE',
          color: '#FFFBFF',
        };
      case 'amber':
        return {
          backgroundColor: '#FEF3C7',
          color: '#B45309',
        };
      case 'mint':
        return {
          backgroundColor: '#F4FFFC',
          color: '#00685F',
        };
      case 'dark':
        return {
          backgroundColor: '#0D1C2F',
          color: '#FFFFFF',
        };
      case 'soft':
      default:
        return {
          backgroundColor: '#E6EEFF',
          color: '#3D4947',
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
