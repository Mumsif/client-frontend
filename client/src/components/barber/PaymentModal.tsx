/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - PAYMENT & SERVICE SETTLEMENT MODAL
 * ============================================================================
 * Handles the final step in the haircut lifecycle:
 * Flow: Barber completes haircut -> Payment Settlement -> Chair Released
 *
 * Features:
 * - Customer & Chair summary
 * - Bill breakdown (Service cost, Platform commission, Net barber payout)
 * - Payment methods: Cash (with change calculator), LankaQR / UPI, Card
 * - Confetti celebration upon payment completion
 * - Digital receipt generation with "PAID" badge
 * ============================================================================
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  chairId: string;
  chairNumber: number;
  barberName: string;
  customerData: {
    appointmentId: string;
    ticketNumber: string;
    customerName: string;
    serviceNames: string;
    totalAmountLkr?: number;
    startedAt?: string;
  };
  onConfirmPayment: (chairId: string, appointmentId: string, paymentMethod: string, amount: number) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  chairId,
  chairNumber,
  barberName,
  customerData,
  onConfirmPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QR' | 'CARD'>('CASH');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // Estimate bill amount based on services or default
  const billAmount = customerData.totalAmountLkr || (customerData.serviceNames.toLowerCase().includes('beard') ? 800 : 400);
  const platformCommission = 50;
  const barberNetPayout = billAmount - platformCommission;

  const cashReceivedNumber = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, cashReceivedNumber - billAmount);

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    try {
      await onConfirmPayment(chairId, customerData.appointmentId, paymentMethod, billAmount);
      
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00685F', '#008378', '#10B981', '#F59E0B'],
        });
      } catch {
        // Confetti fallback
      }

      setIsPaid(true);
    } catch (err) {
      console.error('Payment processing failed:', err);
      alert('Failed to settle payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishAndClose = () => {
    setIsPaid(false);
    setCashTendered('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isPaid ? handleFinishAndClose : onClose}
      title={isPaid ? "Payment Settled & Receipt Issued" : "Complete Haircut & Collect Payment"}
      subtitle={
        isPaid
          ? `Haircut service completed for ${customerData.customerName}`
          : `Chair ${chairNumber} (${barberName}) · Customer: ${customerData.customerName} (${customerData.ticketNumber})`
      }
      maxWidth="500px"
      footer={
        isPaid ? (
          <Button variant="emerald" size="md" fullWidth onClick={handleFinishAndClose}>
            Release Chair for Next Customer
          </Button>
        ) : (
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <Button variant="ghost" size="md" onClick={onClose} disabled={isProcessing}>
              Back to Station
            </Button>
            <Button
              variant="emerald"
              size="md"
              fullWidth
              onClick={handleProcessPayment}
              isLoading={isProcessing}
            >
              Confirm LKR {billAmount.toLocaleString()} Received
            </Button>
          </div>
        )
      }
    >
      {isPaid ? (
        /* Digital Receipt View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#E6F4F3',
              color: '#00685F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="check" size={32} color="#00685F" />
          </div>

          <div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#00685F',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              TRANSACTION COMPLETED · PAID
            </span>
            <h3 style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 800, color: '#0D1C2F' }}>
              LKR {billAmount.toLocaleString()}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#5C647A' }}>
              Paid via {paymentMethod === 'CASH' ? 'Cash' : paymentMethod === 'QR' ? 'LankaQR / Transfer' : 'Credit/Debit Card'}
            </p>
          </div>

          <div
            style={{
              width: '100%',
              backgroundColor: '#F8F9FF',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #D5E3FD',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '13px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5C647A' }}>Ticket No:</span>
              <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>{customerData.ticketNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5C647A' }}>Customer:</span>
              <strong>{customerData.customerName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5C647A' }}>Services:</span>
              <strong>{customerData.serviceNames}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5C647A' }}>Stylist:</span>
              <strong>{barberName} (Chair {chairNumber})</strong>
            </div>
            <div style={{ borderTop: '1px dashed #D5E3FD', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', color: '#00685F', fontWeight: 700 }}>
              <span>Barber Net Payout:</span>
              <span>LKR {barberNetPayout.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5C647A', fontSize: '11px' }}>
              <span>Platform Commission:</span>
              <span>LKR {platformCommission.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Bill Settlement Form */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Bill Summary Banner */}
          <div
            style={{
              backgroundColor: '#EFF4FF',
              borderRadius: '14px',
              padding: '16px 20px',
              border: '1px solid #DAE2FD',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', color: '#5C647A', fontWeight: 600 }}>Total Bill Amount</span>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '26px',
                  fontWeight: 800,
                  color: '#00685F',
                  marginTop: '2px',
                }}
              >
                LKR {billAmount.toLocaleString()}
              </div>
              <span style={{ fontSize: '12px', color: '#3D4947' }}>{customerData.serviceNames}</span>
            </div>

            <div
              style={{
                textAlign: 'right',
                backgroundColor: '#FFFFFF',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid #D5E3FD',
              }}
            >
              <div style={{ fontSize: '10px', color: '#5C647A', fontWeight: 700, textTransform: 'uppercase' }}>
                Barber Cut
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '14px', color: '#0D1C2F' }}>
                LKR {barberNetPayout}
              </div>
              <div style={{ fontSize: '10px', color: '#00685F' }}>Fee: LKR 50</div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0D1C2F', marginBottom: '8px' }}>
              Select Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { id: 'CASH' as const, label: 'Cash', sub: 'In-person', icon: 'cash' },
                { id: 'QR' as const, label: 'LankaQR', sub: 'Instant Bank', icon: 'qr' },
                { id: 'CARD' as const, label: 'Card', sub: 'POS Terminal', icon: 'credit-card' },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #00685F' : '1.5px solid #DAE2FD',
                      backgroundColor: isSelected ? '#F4FFFC' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon name={m.icon} size={18} color={isSelected ? '#00685F' : '#5C647A'} />
                    <span style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? '#00685F' : '#0D1C2F' }}>
                      {m.label}
                    </span>
                    <span style={{ fontSize: '10px', color: '#5C647A' }}>{m.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Change Calculator */}
          {paymentMethod === 'CASH' && (
            <div
              style={{
                backgroundColor: '#F8F9FF',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #D5E3FD',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#3D4947' }}>
                  Cash Tendered by Customer (LKR):
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[billAmount, 1000, 2000, 5000].map((quickAmt) => (
                    <button
                      key={quickAmt}
                      type="button"
                      onClick={() => setCashTendered(quickAmt.toString())}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #D5E3FD',
                        backgroundColor: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#00685F',
                      }}
                    >
                      {quickAmt}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="number"
                placeholder={`e.g. ${billAmount}`}
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #D5E3FD',
                  backgroundColor: '#FFFFFF',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0D1C2F',
                  outline: 'none',
                }}
              />

              {cashReceivedNumber > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: changeDue > 0 ? '#FEF3C7' : '#EFF4FF',
                    color: changeDue > 0 ? '#B45309' : '#00685F',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  <span>Change to Return to Customer:</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px' }}>
                    LKR {changeDue.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {paymentMethod === 'QR' && (
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#EFF4FF',
                border: '1px solid #DAE2FD',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #00685F',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: '#00685F',
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                [LankaQR]
              </div>
              <span style={{ fontSize: '12px', color: '#5C647A' }}>
                Customer scans the salon QR code with Commercial Bank / BOC / FriMi app.
              </span>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
