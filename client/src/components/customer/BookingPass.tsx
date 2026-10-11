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
import { Icon } from '../common/Icon';
import westernCuttersImg from '../../assets/salon_hero.jpg';
import royalBladeImg from '../../assets/royal_blade.jpg';
import easternGlowImg from '../../assets/eastern_glow.webp';

export interface BookingPassProps {
  pass: AppointmentResponseDTO;
  onCancel?: (appointmentId: string) => void;
  onRefresh?: () => void;
}

export const BookingPass: React.FC<BookingPassProps> = ({
  pass,
  onCancel,
  onRefresh,
}) => {
  const getSalonImage = () => {
    if (pass.salonImageUrl) return pass.salonImageUrl;
    const nameLower = (pass.salonName || '').toLowerCase();
    if (nameLower.includes('royal')) return royalBladeImg;
    if (nameLower.includes('eastern')) return easternGlowImg;
    return westernCuttersImg;
  };
  const salonImg = getSalonImage();

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
      {/* Salon Photo Banner */}
      <div style={{ position: 'relative', height: '140px', width: '100%', overflow: 'hidden' }}>
        <img
          src={salonImg}
          alt={pass.salonName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(13, 28, 47, 0.25) 0%, rgba(0, 104, 95, 0.92) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
          }}
        >
          <Badge variant="mint" isMono>
            {pass.status}
          </Badge>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '18px',
            right: '18px',
            color: '#FFFFFF',
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              color: '#B2EBF2',
              display: 'block',
            }}
          >
            Confirmed Booking Hub
          </span>
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '18px',
              fontWeight: 800,
              margin: '2px 0 0',
              color: '#F4FFFC',
            }}
          >
            {pass.salonName}
          </h3>
          <span style={{ fontSize: '11px', opacity: 0.85, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <Icon name="map-pin" size={12} color="#B2EBF2" />
            <span>{pass.salonAddress}</span>
          </span>
        </div>
      </div>

      {/* Upper Ticket Header */}
      <div
        style={{
          backgroundColor: '#008378',
          padding: '18px 24px 20px',
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

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', opacity: 0.75 }}>Assigned Chair</span>
            <p style={{ fontWeight: 700, fontSize: '15px', margin: '2px 0 0' }}>{pass.chairName}</p>
          </div>
        </div>

        <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', opacity: 0.75 }}>Guest / Client</span>
            <p style={{ fontWeight: 700, fontSize: '15px', margin: '2px 0 0' }}>{pass.customerName}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', opacity: 0.75 }}>Contact</span>
            <p style={{ fontWeight: 600, fontSize: '13px', margin: '2px 0 0', fontFamily: "'JetBrains Mono', monospace" }}>
              {pass.customerPhone}
            </p>
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

      {/* Main Pass Body */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Live Queue Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            backgroundColor: '#F8F9FF',
            padding: '16px 20px',
            borderRadius: '14px',
            border: '1px solid #D5E3FD',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: '#5C647A', fontWeight: 600 }}>Your Queue Position</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span className="live-pulse-dot" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: '20px',
                  color: '#0D1C2F',
                }}
              >
                #{pass.queuePosition} in line
              </span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#5C647A', fontWeight: 600 }}>Estimated Chair Time</span>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '20px',
                color: '#00685F',
                margin: '4px 0 0',
              }}
            >
              {pass.estimatedChairTime} IST
            </p>
          </div>
        </div>

        {/* Check-in Security Verification PIN */}
        <div
          style={{
            backgroundColor: '#F4FFFC',
            borderRadius: '14px',
            padding: '16px 20px',
            border: '1.5px solid #B2DDD9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#E0F2F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="shield" size={18} color="#00685F" />
            </div>
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#5C647A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                Check-in Verification PIN
              </span>
              <span style={{ fontSize: '12px', color: '#3D4947' }}>
                Present to barber upon arrival to start timer
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '6px 14px',
              backgroundColor: '#00685F',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
              fontSize: '16px',
              letterSpacing: '2px',
              boxShadow: '0 2px 8px rgba(0, 104, 95, 0.25)',
              flexShrink: 0,
            }}
          >
            {pass.otp || '8492'}
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
