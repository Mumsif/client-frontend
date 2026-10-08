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

export interface SalonSelectViewProps {
  onSelectSalon: (salonId: string) => void;
  onBackToBooking?: () => void;
  onNavigateToBarberStation?: () => void;
}

export const SalonSelectView: React.FC<SalonSelectViewProps> = ({
  onSelectSalon,
  onBackToBooking,
}) => {
  const [filterGender, setFilterGender] = useState<'all' | 'men' | 'unisex'>('all');

  const salons = [
    {
      id: 'salon_1',
      name: 'Classic Cuts Grooming Lab',
      tagline: 'Clinical precision hair sculpting & hot-steam beard tailoring',
      address: 'Main Street, Akkaraipattu',
      rating: 4.9,
      reviewsCount: 342,
      estWait: 12,
      activeChairs: 2,
      type: 'men',
      isFeatured: true,
      image: '/src/assets/salon_hero.jpg',
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
      image: '/src/assets/salon_hero.jpg',
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
      image: '/src/assets/salon_hero.jpg',
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
        backgroundColor: '#F8F9FF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 24px 80px',
      }}
      className="salon-select-view"
    >
      <div style={{ maxWidth: '1000px', width: '100%' }}>
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
              <div style={{ width: '6px', height: '24px', backgroundColor: '#00685F', borderRadius: '9999px' }} />
              <h1
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '26px',
                  color: '#0D1C2F',
                  margin: 0,
                }}
              >
                Salons & Barbershops in Akkaraipattu
              </h1>
            </div>
            <p style={{ margin: '6px 0 0', color: '#5C647A', fontSize: '14px' }}>
              Skip the salon wait. Check live queue velocity and lock your cut with digital OTP.
            </p>
          </div>

          {onBackToBooking && (
            <button
              type="button"
              onClick={onBackToBooking}
              style={{
                padding: '8px 16px',
                backgroundColor: '#EFF4FF',
                color: '#00685F',
                borderRadius: '8px',
                border: '1px solid #D5E3FD',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
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
                border: filterGender === tab.id ? '1.5px solid #00685F' : '1px solid #D5E3FD',
                backgroundColor: filterGender === tab.id ? '#EFF4FF' : '#FFFFFF',
                color: filterGender === tab.id ? '#00685F' : '#3D4947',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
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
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: s.isFeatured ? '0px 0px 0px 2px #00685F, 0px 8px 24px rgba(0, 104, 95, 0.12)' : '0px 2px 8px rgba(0,0,0,0.06)',
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
                  {s.isFeatured && <Badge variant="teal">FEATURED PILOT HUB</Badge>}
                  <Badge variant="mint" isMono>★ {s.rating}</Badge>
                </div>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0D1C2F' }}>
                  {s.name}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#5C647A' }}>{s.tagline}</p>
                <div style={{ fontSize: '12px', color: '#3D4947' }}>📍 {s.address}</div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #EFF4FF',
                    marginTop: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="live-pulse-dot" />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#00685F', fontWeight: 600 }}>
                      ~{s.estWait}m wait
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#00685F' }}>
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
