/**
 * ============================================================================
 * TRIMLY - CHAIR COLUMN COMPONENT
 * ============================================================================
 * Modern Noir & Champagne Gold Luxury Styling:
 * - Stylist Header / State Toggle (Avatar, Online/On Break segmented control)
 * - Break Scheduler (Barber allocates 45m break to block customer booking)
 * - Active In-Chair Card in Champagne Gold
 * - Upcoming Queue (Real customer bookings with inline OTP verification)
 * - Walk-in Quick Dispatch Action Tray
 * ============================================================================
 */

import React, { useState } from 'react';
import type { BarberStationChair, OtpVerifyRequestDTO, WalkInRequestDTO } from '../../api/barberApi';
import { ActiveInChairCard } from './ActiveInChairCard';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { STANDARD_45M_SLOTS } from '../../utils/salonStore';

export interface ChairColumnProps {
  chair: BarberStationChair;
  onVerifyOtp: (payload: OtpVerifyRequestDTO) => Promise<boolean>;
  onCompleteService: (chairId: string, appointmentId: string) => void;
  onRegisterWalkIn: (payload: WalkInRequestDTO) => void;
  onToggleStatus: (chairId: string) => void;
  onOpenWalkInModal: (chairId: string) => void;
  onScheduleBreak?: (chairId: string, timeSlot: string, reason: string) => void;
  onEndBreak?: (chairId: string) => void;
}

export const ChairColumn: React.FC<ChairColumnProps> = ({
  chair,
  onVerifyOtp,
  onCompleteService,
  onRegisterWalkIn,
  onToggleStatus,
  onOpenWalkInModal,
  onScheduleBreak,
  onEndBreak,
}) => {
  const [otpInput, setOtpInput] = useState<string>('');
  const [selectedWalkInPreset, setSelectedWalkInPreset] = useState<'QUICK_CUT' | 'BEARD_TRIM' | 'COMBO_EXPRESS'>('QUICK_CUT');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showBreakModal, setShowBreakModal] = useState<boolean>(false);
  const [selectedBreakSlot, setSelectedBreakSlot] = useState<string>('13:30');
  const [breakReason, setBreakReason] = useState<string>('Lunch Break');

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
    const duration = type === 'QUICK_CUT' ? 45 : type === 'BEARD_TRIM' ? 20 : 45;
    const price = type === 'QUICK_CUT' ? 400 : type === 'BEARD_TRIM' ? 300 : 800;

    onRegisterWalkIn({
      chairId: chair.chairId,
      customerName: `Walk-in Guest (${type === 'QUICK_CUT' ? 'Haircut' : type === 'BEARD_TRIM' ? 'Beard' : 'Combo'})`,
      serviceType: type,
      customDurationMinutes: duration,
      priceLkr: price,
    });
  };

  const handleConfirmBreak = (e: React.FormEvent) => {
    e.preventDefault();
    if (onScheduleBreak) {
      onScheduleBreak(chair.chairId, selectedBreakSlot, breakReason);
    } else {
      onToggleStatus(chair.chairId);
    }
    setShowBreakModal(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '24px',
        gap: '16px',
        backgroundColor: '#1A1A1E',
        borderRadius: '16px',
        border: '1px solid #2E2C2A',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.6)',
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
          backgroundColor: '#161619',
          border: '1px solid #2E2C2A',
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
                backgroundColor: isOnline ? '#D4AF37' : '#E5A93C',
                border: '2px solid #161619',
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
                  color: '#F8F6F0',
                }}
              >
                {chair.barberName}
              </span>
              <span
                style={{
                  backgroundColor: '#26241F',
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.5px',
                }}
              >
                CHAIR {chair.chairNumber}
              </span>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#8E8A85',
                marginTop: '2px',
              }}
            >
              {chair.specialization}
            </span>
          </div>
        </div>

        {/* Toggle Online / Break (Segmented Pill) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#222227',
            border: '1px solid #2E2C2A',
            borderRadius: '10px',
            padding: '3px',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (!isOnline) {
                if (onEndBreak) onEndBreak(chair.chairId);
                else onToggleStatus(chair.chairId);
              }
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: isOnline ? '#D4AF37' : 'transparent',
              color: isOnline ? '#111113' : '#8E8A85',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
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
                backgroundColor: isOnline ? '#111113' : '#D4AF37',
              }}
            />
            Online
          </button>
          <button
            type="button"
            onClick={() => setShowBreakModal(true)}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: !isOnline ? '#E5A93C' : 'transparent',
              color: !isOnline ? '#111113' : '#8E8A85',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            Break
          </button>
        </div>
      </div>

      {/* Break Active Notification Banner */}
      {!isOnline && (
        <div
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: 'rgba(229, 169, 60, 0.12)',
            border: '1px solid rgba(229, 169, 60, 0.35)',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E5A93C', fontSize: '13px', fontWeight: 600 }}>
            <Icon name="coffee" size={16} color="#E5A93C" />
            <span>Chair {chair.chairNumber} ({chair.barberName}) is ON BREAK. Customers cannot book this slot.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onEndBreak) onEndBreak(chair.chairId);
              else onToggleStatus(chair.chairId);
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#D4AF37',
              color: '#111113',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Resume Online
          </button>
        </div>
      )}

      {/* 2. Active In-Chair Card */}
      <ActiveInChairCard
        chairId={chair.chairId}
        chairNumber={chair.chairNumber}
        barberName={chair.barberName}
        activeData={chair.activeInChair}
        onCompleteService={onCompleteService}
        onOpenWalkIn={() => onOpenWalkInModal(chair.chairId)}
      />

      {/* 3. Upcoming Queue for Chair (Real Customers Only) */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: '#8E8A85',
            }}
          >
            UPCOMING QUEUE FOR CHAIR {chair.chairNumber}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#D4AF37',
            }}
          >
            {chair.upcomingQueue.length} Bookings Queued
          </span>
        </div>

        {/* Immediate Next Card with OTP Form */}
        {immediateNext ? (
          <div
            style={{
              backgroundColor: '#161619',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
              border: '1px solid #2E2C2A',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#D4AF37',
                  }}
                >
                  {immediateNext.ticketNumber}
                </span>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#F8F6F0',
                  }}
                >
                  {immediateNext.customerName}
                </span>
              </div>
              <Badge variant="blue">NEXT IN LINE</Badge>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#8E8A85' }}>{immediateNext.serviceNames}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: '#D4AF37' }}>
                Slot: {immediateNext.scheduledTime}
              </span>
            </div>

            {/* OTP Verification Inline Form */}
            <form
              onSubmit={handleInlineOtpSubmit}
              style={{
                display: 'flex',
                gap: '8px',
                backgroundColor: '#1A1A1E',
                border: '1px solid #2E2C2A',
                padding: '8px',
                borderRadius: '10px',
                marginTop: '4px',
              }}
            >
              <input
                type="text"
                placeholder="Enter 4-Digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #2E2C2A',
                  backgroundColor: '#111113',
                  color: '#F8F6F0',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: '15px',
                  letterSpacing: '2px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={isVerifying || otpInput.trim().length === 0}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#D4AF37',
                  color: '#111113',
                  border: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: isVerifying || otpInput.trim().length === 0 ? 'not-allowed' : 'pointer',
                  opacity: isVerifying || otpInput.trim().length === 0 ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {isVerifying ? 'Verifying...' : 'Verify & Seat'}
              </button>
            </form>
          </div>
        ) : (
          <div
            style={{
              padding: '24px 16px',
              backgroundColor: '#161619',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '13px',
              color: '#8E8A85',
              border: '1px dashed #2E2C2A',
            }}
          >
            <p style={{ margin: 0, fontWeight: 600, color: '#F8F6F0' }}>No upcoming bookings in queue.</p>
            <p style={{ margin: '4px 0 0', fontSize: '12px' }}>Chair is ready for customer booking or walk-in dispatch.</p>
          </div>
        )}

        {/* Secondary Later Queue Items */}
        {laterQueue.map((item) => (
          <div
            key={item.appointmentId}
            style={{
              backgroundColor: '#161619',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #2E2C2A',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#8E8A85',
                  }}
                >
                  {item.ticketNumber}
                </span>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#F8F6F0',
                  }}
                >
                  {item.customerName}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#8E8A85' }}>{item.serviceNames}</span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#D4AF37',
                  display: 'block',
                }}
              >
                {item.scheduledTime}
              </span>
              <span style={{ fontSize: '11px', color: '#8E8A85' }}>Reserved</span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Walk-in Quick Dispatch Action Tray */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#161619',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: 'auto',
          border: '1px solid #2E2C2A',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
              color: '#8E8A85',
            }}
          >
            WALK-IN QUICK DISPATCH TRAY
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#D4AF37',
              fontWeight: 600,
            }}
          >
            Instant Chair Push
          </span>
        </div>

        {/* Preset Chips with Real Pricing */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          {[
            { id: 'QUICK_CUT' as const, label: 'Haircut Only', time: '45m · Rs 400' },
            { id: 'BEARD_TRIM' as const, label: 'Beard Trim', time: '20m · Rs 300' },
            { id: 'COMBO_EXPRESS' as const, label: 'Hair + Beard', time: '45m · Rs 800' },
          ].map((preset) => {
            const isSelected = selectedWalkInPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleWalkInPresetClick(preset.id)}
                style={{
                  backgroundColor: isSelected ? '#26241F' : '#1A1A1E',
                  border: isSelected ? '1.5px solid #D4AF37' : '1px solid #2E2C2A',
                  borderRadius: '8px',
                  padding: '8px 4px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  transition: 'all 0.16s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(212, 175, 55, 0.2)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '12px',
                    color: isSelected ? '#D4AF37' : '#F8F6F0',
                  }}
                >
                  {preset.label}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    color: '#8E8A85',
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
            backgroundColor: '#D4AF37',
            color: '#111113',
            borderRadius: '8px',
            border: 'none',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)',
            transition: 'all 0.18s ease',
          }}
        >
          <span>+ Custom Walk-in Registration</span>
        </button>
      </div>

      {/* Barber Break Scheduler Modal */}
      <Modal
        isOpen={showBreakModal}
        onClose={() => setShowBreakModal(false)}
        title={`Schedule Break — Chair ${chair.chairNumber} (${chair.barberName})`}
        subtitle="Select a 45-minute booking slot to allocate as your break. Customers will not be able to book this slot."
        maxWidth="460px"
      >
        <form onSubmit={handleConfirmBreak} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F0', marginBottom: '6px' }}>
              Select 45-Minute Break Slot
            </label>
            <select
              value={selectedBreakSlot}
              onChange={(e) => setSelectedBreakSlot(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #2E2C2A',
                backgroundColor: '#111113',
                fontSize: '14px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                color: '#F8F6F0',
                outline: 'none',
              }}
            >
              <option value="Current">Current Slot (Immediate 45-Min Break)</option>
              {STANDARD_45M_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t} IST (45 Minutes)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F0', marginBottom: '6px' }}>
              Break Reason
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {['Lunch Break', 'Tea Break', 'Prayer / Rest'].map((r) => {
                const isSelected = breakReason === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setBreakReason(r)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #D4AF37' : '1px solid #2E2C2A',
                      backgroundColor: isSelected ? '#26241F' : '#161619',
                      color: isSelected ? '#D4AF37' : '#8E8A85',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => setShowBreakModal(false)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#222227',
                border: '1px solid #2E2C2A',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                color: '#8E8A85',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: '12px',
                backgroundColor: '#E5A93C',
                color: '#111113',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Block Slot & Take Break
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
