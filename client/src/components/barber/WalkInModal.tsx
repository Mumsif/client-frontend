/**
 * ============================================================================
 * TRIMLY - WALK-IN REGISTRATION MODAL
 * ============================================================================
 * Modern Noir & Champagne Gold Luxury Styling:
 * Connects with Spring Boot Barber Controller:
 * -> com.glowslot.controller.BarberController.java: registerWalkIn
 * -> com.glowslot.service.QueueManagementService.java
 *
 * Allows barbers to insert immediate physical salon walk-in clients into the
 * live queue while maintaining slot integrity.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { WalkInRequestDTO } from '../../api/barberApi';

export interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  chairId: string;
  chairName: string;
  onConfirmWalkIn: (payload: WalkInRequestDTO) => void;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({
  isOpen,
  onClose,
  chairId,
  chairName,
  onConfirmWalkIn,
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [serviceType, setServiceType] = useState<'QUICK_CUT' | 'BEARD_TRIM' | 'COMBO_EXPRESS'>('QUICK_CUT');
  const [duration, setDuration] = useState<number>(45);
  const [price, setPrice] = useState<number>(400);

  const handleTypeSelect = (type: 'QUICK_CUT' | 'BEARD_TRIM' | 'COMBO_EXPRESS') => {
    setServiceType(type);
    if (type === 'QUICK_CUT') {
      setDuration(45);
      setPrice(400);
    } else if (type === 'BEARD_TRIM') {
      setDuration(20);
      setPrice(300);
    } else {
      setDuration(45);
      setPrice(800);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmWalkIn({
      chairId,
      customerName: customerName.trim() || 'Walk-in Client',
      serviceType,
      customDurationMinutes: duration,
      priceLkr: price,
    });
    setCustomerName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Walk-in Customer"
      subtitle={`Registering immediate walk-in client for ${chairName}`}
      maxWidth="460px"
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit}>
            Dispatch to Chair Queue
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#F8F6F0',
              marginBottom: '6px',
            }}
          >
            Customer Name / Alias (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Walk-in Guest"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #2E2C2A',
              backgroundColor: '#111113',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              color: '#F8F6F0',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#F8F6F0',
              marginBottom: '6px',
            }}
          >
            Select Walk-in Grooming Service
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[
              { id: 'QUICK_CUT' as const, label: 'Haircut Only', dur: '45m', cost: '400' },
              { id: 'BEARD_TRIM' as const, label: 'Beard Trim', dur: '20m', cost: '300' },
              { id: 'COMBO_EXPRESS' as const, label: 'Hair + Beard', dur: '45m', cost: '800' },
            ].map((pkg) => {
              const isSelected = serviceType === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handleTypeSelect(pkg.id)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #D4AF37' : '1px solid #2E2C2A',
                    backgroundColor: isSelected ? '#26241F' : '#161619',
                    color: isSelected ? '#D4AF37' : '#8E8A85',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{pkg.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>
                    {pkg.dur} · Rs {pkg.cost}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration & Price adjustments */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#8E8A85', marginBottom: '4px' }}>
              Duration (Minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={10}
              max={120}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #2E2C2A',
                backgroundColor: '#111113',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '14px',
                color: '#F8F6F0',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#8E8A85', marginBottom: '4px' }}>
              Price (LKR)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={100}
              step={50}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #2E2C2A',
                backgroundColor: '#111113',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '14px',
                color: '#F8F6F0',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
