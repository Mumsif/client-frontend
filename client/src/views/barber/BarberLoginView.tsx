/**
 * ============================================================================
 * TRIMLY - BARBER WORKSTATION LOGIN VIEW
 * ============================================================================
 * Modern Noir & Champagne Gold Luxury Styling:
 * Connects with Spring Boot Security:
 * -> com.glowslot.security.FirebaseAuthenticationFilter.java
 * ============================================================================
 */

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import westernCuttersImg from '../../assets/salon_hero.jpg';

export interface BarberLoginViewProps {
  onLoginSuccess: () => void;
  onBackToCustomer?: () => void;
}

export const BarberLoginView: React.FC<BarberLoginViewProps> = ({
  onLoginSuccess,
  onBackToCustomer,
}) => {
  const { loginWithPin } = useAuth();
  const [selectedChair, setSelectedChair] = useState<'chair_1' | 'chair_2'>('chair_1');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError('Please enter your 4-digit workstation PIN.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const success = await loginWithPin(pin, selectedChair);
    setIsLoading(false);

    if (success) {
      onLoginSuccess();
    } else {
      setError('Invalid PIN code. (Demo PIN: 1234 or 0000)');
    }
  };

  const handleQuickDemoLogin = async (chairId: 'chair_1' | 'chair_2') => {
    setIsLoading(true);
    await loginWithPin('1234', chairId);
    setIsLoading(false);
    onLoginSuccess();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#111113',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#1A1A1E',
          borderRadius: '20px',
          padding: '36px 32px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 0 1px #2E2C2A',
          border: '1px solid #2E2C2A',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          animation: 'scaleIn 0.3s ease-out',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              position: 'relative',
              height: '120px',
              borderRadius: '14px',
              overflow: 'hidden',
              marginBottom: '16px',
              border: '1px solid #2E2C2A',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
            }}
          >
            <img
              src={westernCuttersImg}
              alt="Western Cutters Barbershop"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(17, 17, 19, 0.2) 0%, rgba(17, 17, 19, 0.95) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: '10px 14px',
              }}
            >
              <span
                style={{
                  color: '#D4AF37',
                  fontWeight: 700,
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.6px',
                }}
              >
                STATION TERMINAL · WESTERN CUTTERS
              </span>
            </div>
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, margin: 0, color: '#F8F6F0' }}>
            Barber Station Login
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#8E8A85' }}>
            Main Street, Akkaraipattu
          </p>
        </div>

        {/* Chair Selection Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#F8F6F0' }}>Select Your Station Chair</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setSelectedChair('chair_1')}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: selectedChair === 'chair_1' ? '2px solid #D4AF37' : '1px solid #2E2C2A',
                backgroundColor: selectedChair === 'chair_1' ? '#26241F' : '#161619',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '14px', color: selectedChair === 'chair_1' ? '#F8F6F0' : '#8E8A85' }}>Chair 1: Dhanu</span>
              <span style={{ fontSize: '11px', color: '#D4AF37' }}>Master Barber</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedChair('chair_2')}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: selectedChair === 'chair_2' ? '2px solid #D4AF37' : '1px solid #2E2C2A',
                backgroundColor: selectedChair === 'chair_2' ? '#26241F' : '#161619',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '14px', color: selectedChair === 'chair_2' ? '#F8F6F0' : '#8E8A85' }}>Chair 2: Thambi</span>
              <span style={{ fontSize: '11px', color: '#D4AF37' }}>Senior Stylist</span>
            </button>
          </div>
        </div>

        {/* PIN Input Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#F8F6F0', marginBottom: '6px' }}>
              Enter 4-Digit Station PIN
            </label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #2E2C2A',
                backgroundColor: '#111113',
                fontSize: '28px',
                textAlign: 'center',
                letterSpacing: '8px',
                fontFamily: "'JetBrains Mono', monospace",
                color: '#D4AF37',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && <span style={{ color: '#EF4444', fontSize: '12px', textAlign: 'center' }}>{error}</span>}

          <Button variant="primary" size="lg" fullWidth isLoading={isLoading} type="submit">
            Unlock Station Workboard
          </Button>
        </form>

        {/* Demo Fast Logins */}
        <div style={{ borderTop: '1px solid #2E2C2A', paddingTop: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#8E8A85' }}>Instant Preview Access:</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => handleQuickDemoLogin('chair_1')}
            >
              Dhanu (Chair 1)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => handleQuickDemoLogin('chair_2')}
            >
              Thambi (Chair 2)
            </Button>
          </div>
        </div>

        {onBackToCustomer && (
          <button
            type="button"
            onClick={onBackToCustomer}
            style={{
              background: 'none',
              border: 'none',
              color: '#8E8A85',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
              textAlign: 'center',
            }}
          >
            ← Back to Customer Booking
          </button>
        )}
      </div>
    </div>
  );
};
