/**
 * ============================================================================
 * TRIMLY - DIGITAL BOOKING PASS (CUSTOMER PASS)
 * ============================================================================
 * Modern Noir & Champagne Gold Luxury Styling:
 * - Documented in Business Plan & Spring Boot Specs
 * - Real-time queue counter & estimated chair arrival time
 * - Private SMS OTP security notice
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
        backgroundColor: '#1A1A1E',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0px 16px 48px rgba(0, 0, 0, 0.75), 0px 0px 0px 1px #2E2C2A',
        border: '1px solid #2E2C2A',
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
            background: 'linear-gradient(180deg, rgba(17, 17, 19, 0.3) 0%, rgba(17, 17, 19, 0.95) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
          }}
        >
          <Badge variant="teal" isMono>
            {pass.status}
          </Badge>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '18px',
            right: '18px',
            color: '#F8F6F0',
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              color: '#D4AF37',
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
              color: '#F8F6F0',
            }}
          >
            {pass.salonName}
          </h3>
          <span style={{ fontSize: '11px', color: '#8E8A85', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <Icon name="map-pin" size={12} color="#D4AF37" />
            <span>{pass.salonAddress}</span>
          </span>
        </div>
      </div>

      {/* Upper Ticket Header */}
      <div
        style={{
          backgroundColor: '#22201C',
          padding: '18px 24px 20px',
          color: '#F8F6F0',
          position: 'relative',
          borderBottom: '1px solid #2E2C2A',
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
                color: '#8E8A85',
              }}
            >
              Trimly Digital Pass
            </span>
            <h2
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '22px',
                fontWeight: 700,
                color: '#D4AF37',
                margin: '4px 0 0',
              }}
            >
              {pass.ticketNumber}
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#8E8A85' }}>Assigned Chair</span>
            <p style={{ fontWeight: 700, fontSize: '15px', color: '#F8F6F0', margin: '2px 0 0' }}>{pass.chairName}</p>
          </div>
        </div>

        <div style={{ marginTop: '12px', borderTop: '1px solid #2E2C2A', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#8E8A85' }}>Guest / Client</span>
            <p style={{ fontWeight: 700, fontSize: '15px', color: '#F8F6F0', margin: '2px 0 0' }}>{pass.customerName}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#8E8A85' }}>Contact</span>
            <p style={{ fontWeight: 600, fontSize: '13px', margin: '2px 0 0', color: '#D4AF37', fontFamily: "'JetBrains Mono', monospace" }}>
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
          backgroundColor: '#1A1A1E',
          padding: '0 8px',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '16px',
            height: '24px',
            backgroundColor: '#111113',
            borderRadius: '0 12px 12px 0',
            marginLeft: '-8px',
            borderRight: '1px solid #2E2C2A',
          }}
        />
        <div
          style={{
            flex: 1,
            borderBottom: '2px dashed #2E2C2A',
            margin: '0 8px',
          }}
        />
        <div
          style={{
            width: '16px',
            height: '24px',
            backgroundColor: '#111113',
            borderRadius: '12px 0 0 12px',
            marginRight: '-8px',
            borderLeft: '1px solid #2E2C2A',
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
            backgroundColor: '#161619',
            padding: '16px 20px',
            borderRadius: '14px',
            border: '1px solid #2E2C2A',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: '#8E8A85', fontWeight: 600 }}>Your Queue Position</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span className="live-pulse-dot" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: '20px',
                  color: '#F8F6F0',
                }}
              >
                #{pass.queuePosition} in line
              </span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#8E8A85', fontWeight: 600 }}>Estimated Chair Time</span>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '20px',
                color: '#D4AF37',
                margin: '4px 0 0',
              }}
            >
              {pass.estimatedChairTime} IST
            </p>
          </div>
        </div>

        {/* Check-in Security Notice (OTP is kept private to SMS) */}
        <div
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            borderRadius: '14px',
            padding: '16px 20px',
            border: '1.5px solid rgba(212, 175, 55, 0.28)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#26241F',
              border: '1px solid #2E2C2A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name="shield" size={20} color="#D4AF37" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#F8F6F0' }}>
                Private Verification Code Sent via SMS
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#8E8A85', lineHeight: 1.45 }}>
              Check your mobile messages. Provide the 4-digit code to your barber upon arrival to commence your service.
            </p>
          </div>
        </div>

        {/* Services Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#8E8A85' }}>Selected Services</span>
          {pass.services.map((s) => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: '#F8F6F0',
              }}
            >
              <span>{s.name} ({s.durationMinutes}m)</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: '#D4AF37' }}>
                LKR {s.priceLkr.toLocaleString()}
              </span>
            </div>
          ))}

          <div
            style={{
              borderTop: '1px solid #2E2C2A',
              paddingTop: '8px',
              marginTop: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            <span style={{ color: '#F8F6F0' }}>Total Bill Amount</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#D4AF37', fontSize: '16px' }}>
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
