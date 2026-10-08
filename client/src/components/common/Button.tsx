/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - COMMON BUTTON COMPONENT
 * ============================================================================
 * Matches Figma button layers:
 * - 48px minimum touch target for accessibility and mobile flow
 * - Teal glow shadow: 0px 4px 16px rgba(0, 104, 95, 0.25)
 * - Micro-animations on hover and active click
 * ============================================================================
 */

import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'indigo' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#00685F',
          color: '#FFFFFF',
          boxShadow: '0px 4px 16px rgba(0, 104, 95, 0.25)',
          border: 'none',
        };
      case 'emerald':
        return {
          backgroundColor: '#008378',
          color: '#F4FFFC',
          boxShadow: '0px 2px 8px rgba(0, 131, 120, 0.25)',
          border: 'none',
        };
      case 'indigo':
        return {
          backgroundColor: '#4648D4',
          color: '#FFFFFF',
          boxShadow: '0px 4px 12px rgba(70, 72, 212, 0.25)',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: '#EFF4FF',
          color: '#0D1C2F',
          border: '1px solid #D5E3FD',
        };
      case 'white':
        return {
          backgroundColor: '#FFFFFF',
          color: '#00685F',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 104, 95, 0.15)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: '#00685F',
          border: '1.5px solid #00685F',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#3D4947',
          border: 'none',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 14px',
          minHeight: '34px',
          fontSize: '13px',
          borderRadius: '8px',
        };
      case 'lg':
        return {
          padding: '12px 28px',
          minHeight: '48px',
          fontSize: '16px',
          borderRadius: '12px',
        };
      case 'md':
      default:
        return {
          padding: '10px 20px',
          minHeight: '42px',
          fontSize: '14px',
          borderRadius: '10px',
        };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        width: fullWidth ? '100%' : 'auto',
        outline: 'none',
        ...getVariantStyles(),
        ...getSizeStyles(),
      }}
      className={`btn-interactive ${className}`}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: '#FFFFFF',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span style={{ display: 'flex' }}>{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span style={{ display: 'flex' }}>{icon}</span>}
        </>
      )}
    </button>
  );
};
