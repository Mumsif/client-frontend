/**
 * ============================================================================
 * TRIMLY - UNIFIED AUTHENTICATION VIEW
 * ============================================================================
 * Modern Noir & Champagne Gold Luxury Styling:
 * ONE single login page for both Customers and Staff:
 * - Credentials automatically separate the page view:
 *   * Staff username & password (e.g., dhanu, thambi, admin) -> routes to Staff Portal (#/barber)
 *   * Customer phone/email & password -> authenticates customer & proceeds to booking (#/book)
 * - New Customers can toggle to "Create Account / Register"
 * - Self-registration is strictly disabled for staff (manual provisioning)
 * ============================================================================
 */

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '../../components/common/Icon';

export interface BookingContextInfo {
  salonName?: string;
  timeSlot?: string;
  date?: string;
  chairLabel?: string;
  servicesLabel?: string;
  totalPrice?: number;
}

export interface AuthViewProps {
  initialTab?: string;
  initialMode?: 'login' | 'register';
  bookingContext?: BookingContextInfo | null;
  onSuccess?: (role: 'customer' | 'staff') => void;
  onBack?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  bookingContext,
  onSuccess,
  onBack,
}) => {
  const { loginCustomer, registerCustomer, loginStaff } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const identifier = loginIdentifier.trim();
    if (!identifier) {
      setErrorMessage('Please enter your username, mobile number, or email.');
      return;
    }

    setIsLoading(true);

    // 1. Staff check
    const staffRes = await loginStaff(identifier, loginPassword);
    if (staffRes.success) {
      setIsLoading(false);
      setSuccessMessage('Staff verified! Redirecting to workstation...');
      setTimeout(() => {
        if (onSuccess) {
          onSuccess('staff');
        } else {
          window.location.hash = '#/barber';
        }
      }, 450);
      return;
    }

    // 2. Customer check
    const custRes = await loginCustomer(identifier, loginPassword);
    setIsLoading(false);

    if (custRes.success) {
      setSuccessMessage(`Welcome back, ${custRes.customer?.name}!`);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess('customer');
        } else {
          window.location.hash = bookingContext ? '#/book' : '#/';
        }
      }, 450);
      return;
    }

    setErrorMessage('Account not found. If you are a new customer, click "Create Account" below.');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMessage('Please enter your mobile phone number.');
      return;
    }

    setIsLoading(true);
    const res = await registerCustomer({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      password: regPassword,
    });
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(`Account created! Welcome, ${res.customer?.name}.`);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess('customer');
        } else {
          window.location.hash = bookingContext ? '#/book' : '#/';
        }
      }, 450);
    } else {
      setErrorMessage(res.error || 'Failed to create account.');
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        backgroundColor: '#1A1A1E',
        borderRadius: '20px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 0 1px #2E2C2A',
        border: '1px solid #2E2C2A',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* 1. Header Bar with Brand & Close */}
      <div
        style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #2E2C2A',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#1A1A1E',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#D4AF37',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111113',
              boxShadow: '0 2px 10px rgba(212, 175, 55, 0.35)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '17px', color: '#F8F6F0', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              Trimly
            </div>
            <div style={{ fontSize: '11px', color: '#8E8A85', fontFamily: "'JetBrains Mono', monospace" }}>
              Luxury Salon Booking
            </div>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              background: '#24242A',
              border: '1px solid #2E2C2A',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#8E8A85',
              transition: 'all 0.15s ease',
            }}
            title="Close"
          >
            <Icon name="x" size={16} />
          </button>
        )}
      </div>

      {/* 2. Optional Booking Context Banner */}
      {bookingContext && (
        <div
          style={{
            margin: '16px 20px 0',
            padding: '12px 16px',
            backgroundColor: '#161619',
            borderRadius: '12px',
            border: '1px solid #2E2C2A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: '#F8F6F0' }}>Confirming Appointment</div>
            <div style={{ color: '#8E8A85', fontSize: '11px', marginTop: '2px' }}>
              {bookingContext.salonName || 'Salon'} · {bookingContext.timeSlot} ({bookingContext.date})
            </div>
          </div>
          {bookingContext.totalPrice && (
            <span style={{ fontWeight: 800, color: '#D4AF37', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>
              LKR {bookingContext.totalPrice.toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* 3. Sub-toggle: Sign In vs Create Account */}
      <div style={{ padding: '20px 24px 0' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#161619',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #2E2C2A',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage(null);
            }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '7px',
              border: authMode === 'login' ? '1px solid rgba(212, 175, 55, 0.35)' : 'none',
              backgroundColor: authMode === 'login' ? '#26241F' : 'transparent',
              color: authMode === 'login' ? '#D4AF37' : '#8E8A85',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: authMode === 'login' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage(null);
            }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '7px',
              border: authMode === 'register' ? '1px solid rgba(212, 175, 55, 0.35)' : 'none',
              backgroundColor: authMode === 'register' ? '#26241F' : 'transparent',
              color: authMode === 'register' ? '#D4AF37' : '#8E8A85',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: authMode === 'register' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* 4. Main Form Container */}
      <div style={{ padding: '20px 24px 24px' }}>
        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#EF4444',
              fontSize: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 500,
            }}
          >
            <span style={{ fontWeight: 800 }}>!</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              color: '#10B981',
              fontSize: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* VIEW A: UNIFIED SIGN IN FORM */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#F8F6F0', marginBottom: '6px' }}>
                Username, Mobile or Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. 77 123 4567 or username"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    paddingLeft: '38px',
                    borderRadius: '9px',
                    border: '1px solid #2E2C2A',
                    fontSize: '14px',
                    color: '#F8F6F0',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#111113',
                  }}
                />
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E8A85' }}>
                  <Icon name="user" size={15} color="currentColor" />
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#F8F6F0' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '11px',
                    color: '#D4AF37',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    paddingLeft: '38px',
                    borderRadius: '9px',
                    border: '1px solid #2E2C2A',
                    fontSize: '14px',
                    color: '#F8F6F0',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#111113',
                  }}
                />
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E8A85' }}>
                  <Icon name="lock" size={15} color="currentColor" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '6px',
                padding: '12px',
                backgroundColor: '#D4AF37',
                color: '#111113',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              {isLoading
                ? 'Verifying...'
                : bookingContext
                ? 'Sign In & Confirm Booking'
                : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <span style={{ fontSize: '12px', color: '#8E8A85' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D4AF37',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '12px',
                  }}
                >
                  Create Account
                </button>
              </span>
            </div>
          </form>
        ) : (
          /* VIEW B: CUSTOMER REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#F8F6F0', marginBottom: '5px' }}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Farhan Mohamed"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 13px',
                  borderRadius: '9px',
                  border: '1px solid #2E2C2A',
                  backgroundColor: '#111113',
                  fontSize: '14px',
                  color: '#F8F6F0',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#F8F6F0', marginBottom: '5px' }}>
                Mobile Phone Number <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#161619',
                    border: '1px solid #2E2C2A',
                    borderRadius: '9px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#8E8A85',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  +94
                </div>
                <input
                  type="tel"
                  required
                  placeholder="77 123 4567"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 13px',
                    borderRadius: '9px',
                    border: '1px solid #2E2C2A',
                    backgroundColor: '#111113',
                    fontSize: '14px',
                    color: '#F8F6F0',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#F8F6F0', marginBottom: '5px' }}>
                Email Address <span style={{ fontSize: '11px', color: '#8E8A85', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 13px',
                  borderRadius: '9px',
                  border: '1px solid #2E2C2A',
                  backgroundColor: '#111113',
                  fontSize: '14px',
                  color: '#F8F6F0',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#F8F6F0', marginBottom: '5px' }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Create a password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 13px',
                  borderRadius: '9px',
                  border: '1px solid #2E2C2A',
                  backgroundColor: '#111113',
                  fontSize: '14px',
                  color: '#F8F6F0',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '6px',
                padding: '12px',
                backgroundColor: '#D4AF37',
                color: '#111113',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              {isLoading
                ? 'Creating Account...'
                : bookingContext
                ? 'Create Account & Book'
                : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '12px', color: '#8E8A85' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D4AF37',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '12px',
                  }}
                >
                  Sign In
                </button>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
