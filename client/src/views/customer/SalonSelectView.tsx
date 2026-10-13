/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - SALON SELECTION VIEW
 * ============================================================================
 * Documented in Business Plan:
 * - Salon discovery: list with ratings, wait times, distance, gender filter
 * - Pilot Launch: 10-15 salons in Akkaraipattu, Eastern Province
 * ============================================================================
 */

import React, { useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { Icon } from '../../components/common/Icon';
import westernCuttersImg from '../../assets/salon_hero.jpg';
import royalBladeImg from '../../assets/royal_blade.jpg';
import easternGlowImg from '../../assets/eastern_glow.webp';

export interface SalonSelectViewProps {
  onSelectSalon: (salonId: string) => void;
  onBackToBooking?: () => void;
  onNavigateToBarberStation?: () => void;
  onNavigateToHome?: () => void;
}

export const SalonSelectView: React.FC<SalonSelectViewProps> = ({
  onSelectSalon,
  onBackToBooking,
  onNavigateToHome,
}) => {
  const [filterGender, setFilterGender] = useState<'all' | 'men' | 'unisex'>('all');

  const salons = [
    {
      id: 'salon_1',
      name: 'Western Cutters',
      tagline: 'Clinical precision hair sculpting & hot-steam beard tailoring',
      address: 'Main Street, Akkaraipattu',
      rating: 4.9,
      reviewsCount: 342,
      estWait: 12,
      activeChairs: 2,
      type: 'men',
      isFeatured: true,
      image: westernCuttersImg,
    },
    {
      id: 'salon_2',
      name: 'Royal Blades Barbershop',
      tagline: 'Modern fades, beard styling and herbal head washes',
      address: 'Clock Tower Junction, Akkaraipattu',
      rating: 4.7,
      reviewsCount: 189,
      estWait: 20,
      activeChairs: 3,
      type: 'men',
      isFeatured: false,
      image: royalBladeImg,
    },
    {
      id: 'salon_3',
      name: 'Eastern Glow Unisex Lounge',
      tagline: 'Premium styling, facial treatments and family grooming',
      address: 'Hospital Road, Akkaraipattu',
      rating: 4.8,
      reviewsCount: 220,
      estWait: 15,
      activeChairs: 4,
      type: 'unisex',
      isFeatured: false,
      image: easternGlowImg,
    },
  ];

  const filtered = salons.filter((s) => {
    if (filterGender === 'all') return true;
    return s.type === filterGender;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#111113',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 24px 80px',
      }}
      className="salon-select-view"
    >
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        {/* Top Trimly Brand Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div
            className="trimly-logo-link"
            role="button"
            tabIndex={0}
            onClick={() => {
              if (onNavigateToHome) onNavigateToHome();
              else window.location.hash = '#/';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (onNavigateToHome) onNavigateToHome();
                else window.location.hash = '#/';
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            title="Return to Trimly Home"
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #C5A880 0%, #D4AF37 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111113',
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.25)',
              }}
            >
              <Icon name="scissors" size={17} color="#111113" />
            </div>
            <div>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: '#F8F6F0' }}>
                Trimly
              </span>
              <span className="trimly-header-tagline" style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8E8A85' }}>
                Smart Salon Booking
              </span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '24px', backgroundColor: '#D4AF37', borderRadius: '9999px' }} />
              <h1
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '26px',
                  color: '#F8F6F0',
                  margin: 0,
                }}
              >
                Salons & Barbershops
              </h1>
            </div>
            <p style={{ margin: '6px 0 0', color: '#8E8A85', fontSize: '14px' }}>
              Skip the bench queues. Check live chair availability and reserve your appointment with a verified pass.
            </p>
          </div>

          {onBackToBooking && (
            <button
              type="button"
              onClick={onBackToBooking}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1A1A1E',
                color: '#D4AF37',
                borderRadius: '8px',
                border: '1px solid #2E2C2A',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              ← Back to Booking
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'all' as const, label: 'All Salons' },
            { id: 'men' as const, label: "Men's Barbershops" },
            { id: 'unisex' as const, label: 'Unisex Salons' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterGender(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: filterGender === tab.id ? '1.5px solid #D4AF37' : '1px solid #2E2C2A',
                backgroundColor: filterGender === tab.id ? '#26241F' : '#1A1A1E',
                color: filterGender === tab.id ? '#D4AF37' : '#8E8A85',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Salons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
          {filtered.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectSalon(s.id)}
              style={{
                backgroundColor: '#1A1A1E',
                borderRadius: '16px',
                overflow: 'hidden',
                border: s.isFeatured ? '1px solid #D4AF37' : '1px solid #2E2C2A',
                boxShadow: s.isFeatured ? '0px 0px 0px 1px #D4AF37, 0px 8px 32px rgba(212, 175, 55, 0.15)' : '0px 4px 20px rgba(0,0,0,0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="salon-card-hover"
            >
              <div style={{ position: 'relative', height: '180px' }}>
                <img
                  src={s.image}
                  alt={s.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '6px',
                  }}
                >
                  {s.isFeatured && <Badge variant="gold">FEATURED PILOT HUB</Badge>}
                  <Badge variant="slate" isMono>{s.rating} / 5</Badge>
                </div>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#F8F6F0' }}>
                  {s.name}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#8E8A85' }}>{s.tagline}</p>
                <div style={{ fontSize: '12px', color: '#8E8A85' }}>{s.address}</div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #2E2C2A',
                    marginTop: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="live-pulse-dot" />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#D4AF37', fontWeight: 600 }}>
                      {s.estWait}m wait
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#D4AF37' }}>
                    View Services →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
