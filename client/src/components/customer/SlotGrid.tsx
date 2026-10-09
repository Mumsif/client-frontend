/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - SLOT GRID COMPONENT
 * ============================================================================
 * Connects with Spring Boot Slot Calculation Service:
 * -> com.glowslot.service.SlotCalculationService.java
 *
 * Implements buffer calculation (5-10m between services),
 * displays real-time slot state, and ensures ONLY upcoming times
 * from current time are selectable for booking.
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import type { AvailableSlot } from '../../api/bookingApi';
import { Badge } from '../common/Badge';
import { getLocalDateString } from '../../utils/salonStore';

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
  const [showAllPastSlots, setShowAllPastSlots] = useState<boolean>(false);

  // Local calendar dates (avoids UTC timezone mismatch)
  const todayIso = useMemo(() => getLocalDateString(), []);
  const tomorrowIso = useMemo(() => {
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    return getLocalDateString(tm);
  }, []);

  const isToday = selectedDate === todayIso;

  // Split slots into upcoming vs passed
  const { upcomingSlots, passedSlots } = useMemo(() => {
    const upcoming: AvailableSlot[] = [];
    const passed: AvailableSlot[] = [];
    slots.forEach((s) => {
      if (s.statusText === 'Passed') {
        passed.push(s);
      } else {
        upcoming.push(s);
      }
    });
    return { upcomingSlots: upcoming, passedSlots: passed };
  }, [slots]);

  // When viewing today, default to showing only upcoming slots unless user toggles
  const displayedSlots = isToday && !showAllPastSlots ? upcomingSlots : slots;

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
            45-Min Service Slots
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '13px',
            color: '#5C647A',
            margin: 0,
          }}
        >
          {isToday ? (
            <span>
              Showing <strong>upcoming times</strong> from current time. Past time slots cannot be booked.
            </span>
          ) : (
            <span>
              All booking slots available for tomorrow. Dedicated 45-minute chair reservations.
            </span>
          )}
        </p>

        {/* Past slots toggle for today */}
        {isToday && passedSlots.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAllPastSlots((prev) => !prev)}
            style={{
              background: 'none',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#64748B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
            }}
          >
            {showAllPastSlots ? 'Hide Earlier Passed Times' : `Show Passed Times (${passedSlots.length})`}
          </button>
        )}
      </div>

      {/* Slots Matrix */}
      {isLoading ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#5C647A' }}>
          Checking barber schedule...
        </div>
      ) : isToday && upcomingSlots.length === 0 ? (
        <div
          style={{
            padding: '24px 16px',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            border: '1px dashed #CBD5E1',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '24px' }}>🌙</span>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#0D1C2F' }}>
            All booking time slots for today have ended
          </div>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0, maxWidth: '400px' }}>
            The salon is closed for new appointments today. Reserve your dedicated chair slot for tomorrow!
          </p>
          <button
            type="button"
            onClick={() => onSelectDate(tomorrowIso)}
            style={{
              marginTop: '4px',
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: '#00685F',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 104, 95, 0.25)',
            }}
          >
            Book For Tomorrow ➜
          </button>
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
          {displayedSlots.map((slot) => {
            const isSelected = selectedSlot === slot.time;
            const isPassed = slot.statusText === 'Passed';
            const isBreak = slot.statusText === 'Break';
            const isAvailable = slot.isAvailable && !isPassed;

            return (
              <button
                key={slot.time}
                type="button"
                disabled={!isAvailable}
                onClick={() => isAvailable && onSelectSlot(slot.time)}
                title={isPassed ? 'This time slot has already passed' : isBreak ? 'Barber break' : undefined}
                style={{
                  padding: '12px 6px',
                  borderRadius: '10px',
                  border: isSelected
                    ? '2px solid #00685F'
                    : isBreak
                    ? '1px dashed #F59E0B'
                    : isPassed
                    ? '1px solid #E2E8F0'
                    : isAvailable
                    ? '1px solid #DAE2FD'
                    : '1px dashed #E2E8F0',
                  backgroundColor: isSelected
                    ? '#00685F'
                    : isBreak
                    ? '#FFFBEB'
                    : isPassed
                    ? '#F8FAFC'
                    : isAvailable
                    ? '#EFF4FF'
                    : '#F8F9FF',
                  color: isSelected
                    ? '#FFFFFF'
                    : isBreak
                    ? '#B45309'
                    : isPassed
                    ? '#94A3B8'
                    : isAvailable
                    ? '#0D1C2F'
                    : '#A0AEC0',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  opacity: isPassed ? 0.6 : 1,
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
                    textDecoration: isPassed ? 'line-through' : 'none',
                  }}
                >
                  {slot.time}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    opacity: 0.9,
                  }}
                >
                  {isSelected
                    ? 'Selected'
                    : isPassed
                    ? 'Passed'
                    : isBreak
                    ? 'On Break'
                    : isAvailable
                    ? 'Open'
                    : 'Booked'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
