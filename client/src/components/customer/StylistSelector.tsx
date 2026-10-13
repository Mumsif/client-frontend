/**
 * ============================================================================
 * TRIMLY - STYLIST & CHAIR SELECTOR COMPONENT
 * ============================================================================
 * Modern Noir & Champagne Gold Luxury Styling:
 * - Option: Any Available (Selected Default)
 * - Option: Chair 1 Rifas
 * - Option: Chair 2 Kannan
 * - 56px circular avatars with online/busy corner indicators
 * ============================================================================
 */

import React from 'react';
import type { StylistChair } from '../../api/bookingApi';
import { Badge } from '../common/Badge';

export interface StylistSelectorProps {
  stylists: StylistChair[];
  selectedChairId: string; // 'ANY' | 'chair_rifas' | 'chair_kannan'
  onSelectChair: (chairId: string) => void;
}

export const StylistSelector: React.FC<StylistSelectorProps> = ({
  stylists,
  selectedChairId,
  onSelectChair,
}) => {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '6px',
              height: '20px',
              backgroundColor: '#D4AF37',
              borderRadius: '9999px',
            }}
          />
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '28px',
              color: '#F8F6F0',
              letterSpacing: '-0.2px',
              margin: 0,
            }}
          >
            Select Stylist & Chair
          </h2>
        </div>

        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
            fontSize: '11px',
            color: '#8E8A85',
            letterSpacing: '0.22px',
          }}
        >
          Live Dispatch Queue Sync
        </span>
      </div>

      {/* Horizontal Picker Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '12px',
          width: '100%',
        }}
      >
        {/* Option 1: Any Available (Fastest) */}
        <div
          onClick={() => onSelectChair('ANY')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: selectedChairId === 'ANY' ? '#1E1E24' : '#1A1A1E',
            border: selectedChairId === 'ANY' ? '1.5px solid #D4AF37' : '1px solid #2E2C2A',
            borderRadius: '16px',
            cursor: 'pointer',
            boxShadow:
              selectedChairId === 'ANY'
                ? '0px 0px 0px 1px #D4AF37, 0px 8px 24px rgba(212, 175, 55, 0.22)'
                : '0px 4px 16px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            minHeight: '92px',
          }}
          className={`stylist-option ${selectedChairId === 'ANY' ? 'selected' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* 56px Icon Avatar with Check Badge */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#24221F',
                  border: '1px solid #2E2C2A',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.4)',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: '-2px',
                  bottom: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#D4AF37',
                  border: '2px solid #1A1A1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L8.5 1.5"
                    stroke="#111113"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#F8F6F0',
                  }}
                >
                  Any Available
                </span>
                <Badge variant="teal" isMono>
                  FASTEST
                </Badge>
              </div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  color: '#8E8A85',
                }}
              >
                Auto-assigns first free chair
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <span className="live-pulse-dot" />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#D4AF37',
                  }}
                >
                  Est. Wait: 12m
                </span>
              </div>
            </div>
          </div>

          {/* Radio Indicator */}
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: selectedChairId === 'ANY' ? '#D4AF37' : '#222227',
              border: selectedChairId === 'ANY' ? '1px solid #D4AF37' : '1px solid #2E2C2A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
            }}
          >
            {selectedChairId === 'ANY' && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M1.5 5L4.5 8L10.5 2"
                  stroke="#111113"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Dynamic Stylist Chairs (Rifas & Kannan) */}
        {stylists.map((chair) => {
          const isSelected = selectedChairId === chair.id;
          const isBusy = chair.status === 'BUSY';

          return (
            <div
              key={chair.id}
              onClick={() => onSelectChair(chair.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: isSelected ? '#1E1E24' : '#1A1A1E',
                border: isSelected ? '1.5px solid #D4AF37' : '1px solid #2E2C2A',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: isSelected
                  ? '0px 0px 0px 1px #D4AF37, 0px 8px 24px rgba(212, 175, 55, 0.22)'
                  : '0px 4px 16px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                minHeight: '92px',
              }}
              className={`stylist-option ${isSelected ? 'selected' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* 56px Photo Avatar with Corner Status Pill */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={chair.avatarUrl}
                    alt={chair.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '9999px',
                      objectFit: 'cover',
                      display: 'block',
                      border: '2px solid #2E2C2A',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: '0',
                      bottom: '0',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: isBusy ? '#E5A93C' : '#D4AF37',
                      border: '2px solid #1A1A1E',
                    }}
                  />
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '16px',
                      color: '#F8F6F0',
                    }}
                  >
                    {chair.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '12px',
                      color: '#8E8A85',
                    }}
                  >
                    {chair.role}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                    <span className={isBusy ? 'live-pulse-dot-amber' : 'live-pulse-dot'} />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isBusy ? '#E5A93C' : '#D4AF37',
                      }}
                    >
                      {isBusy
                        ? `Busy (${chair.queueLength} in queue · Free @ ${chair.nextFreeTime})`
                        : `Ready (8m buffer · Next @ ${chair.nextFreeTime})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Radio Indicator */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#D4AF37' : '#222227',
                  border: isSelected ? '1px solid #D4AF37' : '1px solid #2E2C2A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {isSelected && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1.5 5L4.5 8L10.5 2"
                      stroke="#111113"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
