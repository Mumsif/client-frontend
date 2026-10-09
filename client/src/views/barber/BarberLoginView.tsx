/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - BARBER WORKSTATION LOGIN VIEW
 * ============================================================================
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
        backgroundColor: '#F8F9FF',
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
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '36px 32px',
          boxShadow: '0 10px 30px rgba(0, 104, 95, 0.1)',
          border: '1px solid #D5E3FD',
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
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
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
                background: 'linear-gradient(180deg, rgba(13, 28, 47, 0.1) 0%, rgba(0, 104, 95, 0.88) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: '10px 14px',
              }}
            >
              <span
                style={{
                  color: '#FFFFFF',
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
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, margin: 0, color: '#0D1C2F' }}>
            Barber Station Login
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#5C647A' }}>
            Main Street, Akkaraipattu
          </p>
        </div>

        {/* Chair Selection Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#3D4947' }}>Select Your Station Chair</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setSelectedChair('chair_1')}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: selectedChair === 'chair_1' ? '2px solid #00685F' : '1px solid #D5E3FD',
                backgroundColor: selectedChair === 'chair_1' ? '#EFF4FF' : '#F8F9FF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#0D1C2F' }}>Chair 1: Dhanu</span>
              <span style={{ fontSize: '11px', color: '#00685F' }}>Master Barber</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedChair('chair_2')}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: selectedChair === 'chair_2' ? '2px solid #00685F' : '1px solid #D5E3FD',
                backgroundColor: selectedChair === 'chair_2' ? '#EFF4FF' : '#F8F9FF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#0D1C2F' }}>Chair 2: Thambi</span>
              <span style={{ fontSize: '11px', color: '#00685F' }}>Senior Stylist</span>
            </button>
          </div>
        </div>

        {/* PIN Input Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#3D4947', marginBottom: '6px' }}>
              Station Security PIN
            </label>
            <input
              type="password"
              placeholder="Enter 4-Digit PIN (Demo: 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #D5E3FD',
                backgroundColor: '#EFF4FF',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '18px',
                textAlign: 'center',
                letterSpacing: '4px',
                outline: 'none',
              }}
            />
          </div>

          {error && <span style={{ color: '#EF4444', fontSize: '12px', textAlign: 'center' }}>{error}</span>}

          <Button variant="primary" size="lg" fullWidth isLoading={isLoading}>
            Open Chair Workstation
          </Button>
        </form>

        {/* Quick Demo Access Buttons */}
        <div style={{ borderTop: '1px solid #EFF4FF', paddingTop: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#5C647A' }}>Instant Preview Access:</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <Button variant="secondary" size="sm" fullWidth onClick={() => handleQuickDemoLogin('chair_1')}>
              Launch as Dhanu
            </Button>
            <Button variant="secondary" size="sm" fullWidth onClick={() => handleQuickDemoLogin('chair_2')}>
              Launch as Thambi
            </Button>
          </div>
        </div>

        {onBackToCustomer && (
          <button
            type="button"
            onClick={onBackToCustomer}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#5C647A',
              fontSize: '13px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            ← Back to Customer Menu
          </button>
        )}
      </div>
    </div>
  );
};
