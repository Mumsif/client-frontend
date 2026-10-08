/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - SLOT GRID COMPONENT
 * ============================================================================
 * Connects with Spring Boot Slot Calculation Service:
 * -> com.glowslot.service.SlotCalculationService.java
 *
 * Implements buffer calculation (5-10m between services),
 * displays real-time slot state, and validates customer selections.
 * ============================================================================
 */

import React from 'react';
import type { AvailableSlot } from '../../api/bookingApi';
import { Badge } from '../common/Badge';

export interface SlotGridProps {
  slots: AvailableSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotTime: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  isLoading?: boolean;
}

export const SlotGrid: React.FC<SlotGridProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  selectedDate,
  onSelectDate,
  isLoading = false,
}) => {
  const todayIso = new Date().toISOString().split('T')[0];
  const tomorrowIso = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Header and Date Pills */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
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
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '18px',
              color: '#0D1C2F',
              margin: 0,
            }}
          >
            Select Booking Time Slot
          </h3>
          <Badge variant="teal" isMono>
            5-10m Safe Buffer
          </Badge>
        </div>

        {/* Quick Date Switcher */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => onSelectDate(todayIso)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: selectedDate === todayIso ? '1.5px solid #00685F' : '1px solid #E6EEFF',
              backgroundColor: selectedDate === todayIso ? '#EFF4FF' : '#FFFFFF',
              color: selectedDate === todayIso ? '#00685F' : '#3D4947',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Today (IST)
          </button>
          <button
            type="button"
            onClick={() => onSelectDate(tomorrowIso)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: selectedDate === tomorrowIso ? '1.5px solid #00685F' : '1px solid #E6EEFF',
              backgroundColor: selectedDate === tomorrowIso ? '#EFF4FF' : '#FFFFFF',
              color: selectedDate === tomorrowIso ? '#00685F' : '#3D4947',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Tomorrow
          </button>
        </div>
      </div>

      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '13px',
          color: '#5C647A',
          margin: 0,
        }}
      >
        Slots are calculated using live chair speed, with 10-minute hygiene buffers between appointments.
      </p>

      {/* Slots Matrix */}
      {isLoading ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#5C647A' }}>
          Recalculating chair availability...
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
            gap: '10px',
            marginTop: '8px',
          }}
        >
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.time;
            const isAvailable = slot.isAvailable;

            return (
              <button
                key={slot.time}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectSlot(slot.time)}
                style={{
                  padding: '12px 6px',
                  borderRadius: '10px',
                  border: isSelected
                    ? '2px solid #00685F'
                    : isAvailable
                    ? '1px solid #DAE2FD'
                    : '1px dashed #E2E8F0',
                  backgroundColor: isSelected
                    ? '#00685F'
                    : isAvailable
                    ? '#EFF4FF'
                    : '#F8F9FF',
                  color: isSelected
                    ? '#FFFFFF'
                    : isAvailable
                    ? '#0D1C2F'
                    : '#A0AEC0',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.18s ease-in-out',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 12px rgba(0, 104, 95, 0.25)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    fontSize: '13px',
                    letterSpacing: '-0.2px',
                  }}
                >
                  {slot.time}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 500,
                    opacity: 0.85,
                  }}
                >
                  {isSelected ? 'Selected' : isAvailable ? 'Open' : 'Booked'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
