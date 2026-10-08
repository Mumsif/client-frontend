/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - SERVICE CARD COMPONENT
 * ============================================================================
 * Derived from Figma Layers:
 * - Label - Card 1: Standard Fade Cut & Wash (Default Selected)
 * - Active border: 0px 0px 0px 2px #00685F, 0px 1px 2px rgba(0, 0, 0, 0.05)
 * - 48px checkbox touch frame
 * - Monospace duration and currency tags in lower pill tray
 * ============================================================================
 */

import React from 'react';
import type { ServiceItem } from '../../api/bookingApi';
import { Badge } from '../common/Badge';

export interface ServiceCardProps {
  service: ServiceItem;
  isSelected: boolean;
  onToggle: (serviceId: string) => void;
  spansFullWidth?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  onToggle,
  spansFullWidth = false,
}) => {
  return (
    <div
      onClick={() => onToggle(service.id)}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle(service.id);
        }
      }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        cursor: 'pointer',
        gridColumn: spansFullWidth ? '1 / -1' : undefined,
        boxShadow: isSelected
          ? '0px 0px 0px 2px #00685F, 0px 4px 12px rgba(0, 104, 95, 0.12)'
          : '0px 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        minHeight: '171px',
        userSelect: 'none',
      }}
      className={`service-card-item ${isSelected ? 'selected' : ''}`}
    >
      {/* Upper Content: Title, Badges, Description, and 48px Checkbox */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#0D1C2F',
                margin: 0,
              }}
            >
              {service.name}
            </h3>
            {service.badge && (
              <Badge
                variant={
                  service.category === 'package'
                    ? 'indigo'
                    : isSelected
                    ? 'teal'
                    : 'blue'
                }
                isMono
              >
                {service.badge}
              </Badge>
            )}
          </div>

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '20px',
              color: '#3D4947',
              margin: 0,
            }}
          >
            {service.description}
          </p>
        </div>

        {/* 48px Accessible Touch Frame for Checkbox */}
        <div
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: isSelected ? '#00685F' : '#FFFFFF',
              border: isSelected ? '2px solid #00685F' : '2px solid #C4D3EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.18s ease-in-out',
              transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isSelected ? '0 2px 6px rgba(0, 104, 95, 0.3)' : 'none',
            }}
          >
            {isSelected && (
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 5L5 8.5L12.5 1"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Lower Metrics Tray (Duration & Price) */}
      <div
        style={{
          marginTop: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 14px',
          backgroundColor: isSelected ? 'rgba(0, 104, 95, 0.05)' : 'rgba(239, 244, 255, 0.65)',
          borderRadius: '12px',
          border: isSelected ? '1px solid rgba(0, 104, 95, 0.12)' : '1px solid transparent',
        }}
      >
        {/* Duration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00685F"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: '11px',
              color: '#0D1C2F',
              letterSpacing: '0.22px',
            }}
          >
            {service.durationMinutes} Mins
          </span>
        </div>

        {/* Price in LKR */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 500,
              fontSize: '11px',
              color: '#3D4947',
              letterSpacing: '0.22px',
            }}
          >
            LKR
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '18px',
              color: '#0D1C2F',
              letterSpacing: '-0.4px',
            }}
          >
            {service.priceLkr.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
