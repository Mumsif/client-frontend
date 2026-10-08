/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - CHAIR COLUMN COMPONENT
 * ============================================================================
 * Matches Figma Structure:
 * - Stylist Header / State Toggle (Avatar, Online/On Break segmented control)
 * - Active In-Chair Emerald Card
 * - Upcoming Queue (Immediate Next with inline OTP verification)
 * - Walk-in Quick Dispatch Action Tray (Preset chips: Quick Cut, Beard Trim, Combo)
 * ============================================================================
 */

import React, { useState } from 'react';
import type { BarberStationChair, OtpVerifyRequestDTO, WalkInRequestDTO } from '../../api/barberApi';
import { ActiveInChairCard } from './ActiveInChairCard';
import { Badge } from '../common/Badge';

export interface ChairColumnProps {
  chair: BarberStationChair;
  onVerifyOtp: (payload: OtpVerifyRequestDTO) => Promise<boolean>;
  onCompleteService: (chairId: string, appointmentId: string) => void;
  onRegisterWalkIn: (payload: WalkInRequestDTO) => void;
  onToggleStatus: (chairId: string) => void;
  onOpenWalkInModal: (chairId: string) => void;
}

export const ChairColumn: React.FC<ChairColumnProps> = ({
  chair,
  onVerifyOtp,
  onCompleteService,
  onRegisterWalkIn,
  onToggleStatus,
  onOpenWalkInModal,
}) => {
  const [otpInput, setOtpInput] = useState<string>('');
  const [selectedWalkInPreset, setSelectedWalkInPreset] = useState<'QUICK_CUT' | 'BEARD_TRIM' | 'COMBO_EXPRESS'>('QUICK_CUT');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const isOnline = chair.status === 'ONLINE' || chair.status === 'BUSY';
  const immediateNext = chair.upcomingQueue[0];
  const laterQueue = chair.upcomingQueue.slice(1);

  const handleInlineOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!immediateNext || !otpInput.trim()) return;

    setIsVerifying(true);
    const success = await onVerifyOtp({
      chairId: chair.chairId,
      appointmentId: immediateNext.appointmentId,
      otp: otpInput.trim(),
    });
    setIsVerifying(false);

    if (success) {
      setOtpInput('');
    }
  };

  const handleWalkInPresetClick = (type: 'QUICK_CUT' | 'BEARD_TRIM' | 'COMBO_EXPRESS') => {
    setSelectedWalkInPreset(type);
    const duration = type === 'QUICK_CUT' ? 20 : type === 'BEARD_TRIM' ? 15 : 35;
    const price = type === 'QUICK_CUT' ? 1200 : type === 'BEARD_TRIM' ? 800 : 1800;

    onRegisterWalkIn({
      chairId: chair.chairId,
      customerName: `Walk-in (${type.replace('_', ' ')})`,
      serviceType: type,
      customDurationMinutes: duration,
      priceLkr: price,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '24px',
        gap: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.08), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '470px',
        flex: 1,
        transition: 'box-shadow 0.2s ease',
      }}
      className="chair-station-column"
    >
      {/* 1. Stylist Header / State Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          width: '100%',
          backgroundColor: '#EFF4FF',
          borderRadius: '12px',
          gap: '12px',
        }}
      >
        {/* Barber Avatar & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={chair.barberAvatar}
              alt={chair.barberName}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
                border: '2px solid #FFFFFF',
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
                backgroundColor: isOnline ? '#008378' : '#F59E0B',
                border: '2px solid #FFFFFF',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#0D1C2F',
                }}
              >
                {chair.barberName}
              </span>
              <span
                style={{
                  backgroundColor: '#008378',
                  color: '#F4FFFC',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                CHAIR {chair.chairNumber}
              </span>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#3D4947',
                marginTop: '2px',
              }}
            >
              {chair.specialization}
            </span>
          </div>
        </div>

        {/* Toggle Online / On Break (Segmented Pill) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#E6EEFF',
            borderRadius: '10px',
            padding: '3px',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (!isOnline) onToggleStatus(chair.chairId);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: isOnline ? '#00685F' : 'transparent',
              color: isOnline ? '#FFFFFF' : '#3D4947',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.18s ease',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isOnline ? '#FFFFFF' : '#00685F',
              }}
            />
            Online
          </button>
          <button
            type="button"
            onClick={() => {
              if (isOnline) onToggleStatus(chair.chairId);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: !isOnline ? '#B45309' : 'transparent',
              color: !isOnline ? '#FFFFFF' : '#3D4947',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            Break
          </button>
        </div>
      </div>

      {/* 2. Active In-Chair Emerald Card */}
      <ActiveInChairCard
        chairId={chair.chairId}
        chairNumber={chair.chairNumber}
        barberName={chair.barberName}
        activeData={chair.activeInChair}
        onCompleteService={onCompleteService}
        onOpenWalkIn={() => onOpenWalkInModal(chair.chairId)}
      />

      {/* 3. Upcoming Queue for Chair */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
              color: '#3D4947',
            }}
          >
            UPCOMING QUEUE FOR CHAIR {chair.chairNumber}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#5C647A',
            }}
          >
            {chair.upcomingQueue.length} Bookings Queued
          </span>
        </div>

        {/* Immediate Next Card with OTP Form */}
        {immediateNext ? (
          <div
            style={{
              backgroundColor: '#EFF4FF',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #DAE2FD',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#00685F',
                  }}
                >
                  {immediateNext.ticketNumber}
                </span>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#0D1C2F',
                  }}
                >
                  {immediateNext.customerName}
                </span>
              </div>
              <Badge variant="blue">NEXT IN LINE</Badge>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#3D4947' }}>{immediateNext.serviceNames}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: '#00685F' }}>
                Slot: {immediateNext.scheduledTime}
              </span>
            </div>

            {/* OTP Verification Inline Form */}
            <form
              onSubmit={handleInlineOtpSubmit}
              style={{
                display: 'flex',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                padding: '8px',
                borderRadius: '10px',
                marginTop: '4px',
              }}
            >
              <input
                type="text"
                placeholder={immediateNext.otp ? `Enter OTP (${immediateNext.otp})` : 'Enter 4-Digit OTP'}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #DAE2FD',
                  backgroundColor: '#EFF4FF',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  fontSize: '14px',
                  letterSpacing: '2px',
                  textAlign: 'center',
                  outline: 'none',
                  color: '#0D1C2F',
                }}
              />
              <button
                type="submit"
                disabled={isVerifying || !otpInput.trim()}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#00685F',
                  color: '#FFFFFF',
                  border: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: isVerifying || !otpInput.trim() ? 'not-allowed' : 'pointer',
                  opacity: !otpInput.trim() ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s ease',
                }}
              >
                {isVerifying ? 'Verifying...' : 'Verify & Seat'}
              </button>
            </form>
          </div>
        ) : (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#EFF4FF',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '13px',
              color: '#5C647A',
            }}
          >
            No customers waiting in line.
          </div>
        )}

        {/* Secondary Later Queue Items */}
        {laterQueue.map((item) => (
          <div
            key={item.appointmentId}
            style={{
              backgroundColor: '#F8F9FF',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #EFF4FF',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#5C647A',
                  }}
                >
                  {item.ticketNumber}
                </span>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#0D1C2F',
                  }}
                >
                  {item.customerName}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#5C647A' }}>{item.serviceNames}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Badge variant="soft" isMono>
                {item.scheduledTime}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Walk-in Quick Dispatch Action Tray (Purple / Indigo) */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#E1E0FF',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
              color: '#07006C',
            }}
          >
            ⚡ WALK-IN QUICK DISPATCH
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              color: '#07006C',
            }}
          >
            Instant Chair Push
          </span>
        </div>

        {/* Preset Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          {[
            { id: 'QUICK_CUT' as const, label: 'Quick Cut', time: '20m · Rs 1,200' },
            { id: 'BEARD_TRIM' as const, label: 'Beard Trim', time: '15m · Rs 800' },
            { id: 'COMBO_EXPRESS' as const, label: 'Express Combo', time: '35m · Rs 1,800' },
          ].map((preset) => {
            const isSelected = selectedWalkInPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleWalkInPresetClick(preset.id)}
                style={{
                  backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                  border: isSelected ? '1.5px solid #4648D4' : '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '8px',
                  padding: '8px 4px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  transition: 'all 0.16s ease',
                  boxShadow: isSelected ? '0 2px 4px rgba(70, 72, 212, 0.15)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#0D1C2F',
                  }}
                >
                  {preset.label}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    color: '#5C647A',
                  }}
                >
                  {preset.time}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Walk-In Button */}
        <button
          type="button"
          onClick={() => onOpenWalkInModal(chair.chairId)}
          style={{
            width: '100%',
            minHeight: '44px',
            backgroundColor: '#4648D4',
            color: '#FFFFFF',
            borderRadius: '8px',
            border: 'none',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(70, 72, 212, 0.25)',
            transition: 'all 0.18s ease',
          }}
        >
          <span>+ Custom Walk-in Registration</span>
        </button>
      </div>
    </div>
  );
};
