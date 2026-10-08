/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - STYLIST & CHAIR SELECTOR COMPONENT
 * ============================================================================
 * Matches Figma Layers:
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
              backgroundColor: '#00685F',
              borderRadius: '9999px',
            }}
          />
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '28px',
              color: '#0D1C2F',
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
            color: '#3D4947',
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
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            cursor: 'pointer',
            boxShadow:
              selectedChairId === 'ANY'
                ? '0px 0px 0px 2px #00685F, 0px 4px 12px rgba(0, 104, 95, 0.12)'
                : '0px 1px 2px rgba(0, 0, 0, 0.05)',
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
                  backgroundColor: '#008378',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F4FFFC"
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
                  backgroundColor: '#00685F',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L8.5 1.5"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
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
                    color: '#0D1C2F',
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
                  color: '#3D4947',
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
                    color: '#00685F',
                  }}
                >
                  Est. Wait: ~12m
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
              backgroundColor: selectedChairId === 'ANY' ? '#00685F' : '#E6EEFF',
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
                  stroke="#FFFFFF"
                  strokeWidth="2"
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
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: isSelected
                  ? '0px 0px 0px 2px #00685F, 0px 4px 12px rgba(0, 104, 95, 0.12)'
                  : '0px 1px 2px rgba(0, 0, 0, 0.05)',
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
                      border: '2px solid #E6EEFF',
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
                      backgroundColor: isBusy ? '#F59E0B' : '#00685F',
                      border: '2px solid #FFFFFF',
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
                      color: '#0D1C2F',
                    }}
                  >
                    {chair.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '12px',
                      color: '#3D4947',
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
                        color: isBusy ? '#B45309' : '#00685F',
                      }}
                    >
                      {isBusy
                        ? `Busy (${chair.queueLength} in queue · Free @ ${chair.nextFreeTime})`
                        : `Ready (~8m buffer · Next @ ${chair.nextFreeTime})`}
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
                  backgroundColor: isSelected ? '#00685F' : '#E6EEFF',
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
                      stroke="#FFFFFF"
                      strokeWidth="2"
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
