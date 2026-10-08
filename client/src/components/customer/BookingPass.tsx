/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - DIGITAL BOOKING PASS (CUSTOMER PASS)
 * ============================================================================
 * Documented in Business Plan & Spring Boot Specs:
 * - Monospace 4-digit OTP card for verification upon arrival
 * - Real-time queue counter & estimated chair arrival time
 * - Free cancellation up to 30 minutes before appointment
 * ============================================================================
 */

import React from 'react';
import type { AppointmentResponseDTO } from '../../api/bookingApi';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export interface BookingPassProps {
  pass: AppointmentResponseDTO;
  onCancel?: (appointmentId: string) => void;
  onRefresh?: () => void;
}

export const BookingPass: React.FC<BookingPassProps> = ({ pass, onCancel, onRefresh }) => {
  return (
    <div
      style={{
        maxWidth: '480px',
        width: '100%',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0px 10px 30px rgba(0, 104, 95, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #D5E3FD',
        animation: 'slideUpFade 0.4s ease-out',
      }}
    >
      {/* Upper Ticket Header */}
      <div
        style={{
          backgroundColor: '#008378',
          padding: '24px',
          color: '#F4FFFC',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                opacity: 0.85,
              }}
            >
              GlowSlot Digital Pass
            </span>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '22px',
                fontWeight: 700,
                margin: '4px 0 0',
              }}
            >
              {pass.ticketNumber}
            </h2>
          </div>

          <Badge variant="mint" isMono>
            {pass.status}
          </Badge>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', opacity: 0.75 }}>Salon</span>
            <p style={{ fontWeight: 600, fontSize: '14px', margin: '2px 0 0' }}>{pass.salonName}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', opacity: 0.75 }}>Assigned Chair</span>
            <p style={{ fontWeight: 600, fontSize: '14px', margin: '2px 0 0' }}>{pass.chairName}</p>
          </div>
        </div>
      </div>

      {/* Decorative Ticket Perforation Line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#F8F9FF',
          padding: '0 8px',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '16px',
            height: '24px',
            backgroundColor: '#F8F9FF',
            borderRadius: '0 12px 12px 0',
            marginLeft: '-8px',
            borderRight: '1px solid #D5E3FD',
          }}
        />
        <div
          style={{
            flex: 1,
            borderBottom: '2px dashed #D5E3FD',
            margin: '0 8px',
          }}
        />
        <div
          style={{
            width: '16px',
            height: '24px',
            backgroundColor: '#F8F9FF',
            borderRadius: '12px 0 0 12px',
            marginRight: '-8px',
            borderLeft: '1px solid #D5E3FD',
          }}
        />
      </div>

      {/* Main Pass Body with 4-Digit OTP Box */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* OTP High-Contrast Verification Card */}
        <div
          style={{
            backgroundColor: '#EFF4FF',
            border: '2px dashed #00685F',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              color: '#3D4947',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Show this 4-Digit OTP to your Barber
          </span>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginTop: '4px',
            }}
          >
            {pass.otp.split('').map((digit, idx) => (
              <div
                key={idx}
                style={{
                  width: '52px',
                  height: '60px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 2px 6px rgba(0, 104, 95, 0.15)',
                  border: '1.5px solid #00685F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: '28px',
                  color: '#00685F',
                }}
              >
                {digit}
              </div>
            ))}
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#5C647A',
              marginTop: '4px',
            }}
          >
            Tamper-resistant validation protects fair commission
          </span>
        </div>

        {/* Live Queue Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            backgroundColor: '#F8F9FF',
            padding: '16px',
            borderRadius: '12px',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: '#5C647A' }}>Your Queue Position</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span className="live-pulse-dot" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#0D1C2F',
                }}
              >
                #{pass.queuePosition} in line
              </span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#5C647A' }}>Estimated Chair Time</span>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '18px',
                color: '#00685F',
                margin: '4px 0 0',
              }}
            >
              {pass.estimatedChairTime} IST
            </p>
          </div>
        </div>

        {/* Services Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#3D4947' }}>Selected Services</span>
          {pass.services.map((s) => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: '#0D1C2F',
              }}
            >
              <span>{s.name} ({s.durationMinutes}m)</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                LKR {s.priceLkr.toLocaleString()}
              </span>
            </div>
          ))}

          <div
            style={{
              borderTop: '1px solid #EFF4FF',
              paddingTop: '8px',
              marginTop: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            <span>Total Bill Amount</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00685F' }}>
              LKR {pass.totalPriceLkr.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          {onRefresh && (
            <Button variant="secondary" size="md" fullWidth onClick={onRefresh}>
              Sync Live Queue
            </Button>
          )}
          {onCancel && (
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => onCancel(pass.appointmentId)}
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
