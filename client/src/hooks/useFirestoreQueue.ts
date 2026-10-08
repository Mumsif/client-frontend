/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - useFirestoreQueue Hook
 * ============================================================================
 * Real-time synchronization layer for Barber Station & Customer Queue Pass.
 *
 * Spring Boot Integration:
 * - Triggers com.glowslot.service.QueueManagementService.java for queue mutations
 * - Triggers com.glowslot.service.WalletService.java for commission updates
 * - Provides live seconds countdown timer for active chairs
 * ============================================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  barberApi,
  type BarberStationChair,
  type SalonTelemetryStats,
  type WalletBalanceDTO,
  type OtpVerifyRequestDTO,
  type WalkInRequestDTO,
} from '../api/barberApi';

export const useFirestoreQueue = (salonId: string = 'salon_1') => {
  const [chairs, setChairs] = useState<BarberStationChair[]>([]);
  const [stats, setStats] = useState<SalonTelemetryStats | null>(null);
  const [wallet, setWallet] = useState<WalletBalanceDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const timerRef = useRef<number | null>(null);

  // Show transient toast
  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initial load
  const loadState = useCallback(async () => {
    try {
      const data = await barberApi.getWorkstationState(salonId);
      setChairs(data.chairs);
      setStats(data.stats);
      setWallet(data.wallet);
    } catch (error) {
      console.error('Failed to load workstation state:', error);
    } finally {
      setIsLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  // Live Second-by-Second Countdown Tick for In-Chair services
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setChairs((prevChairs) =>
        prevChairs.map((chair) => {
          if (!chair.activeInChair) return chair;

          let { remainingMinutes, remainingSeconds } = chair.activeInChair;
          if (remainingSeconds > 0) {
            remainingSeconds -= 1;
          } else if (remainingMinutes > 0) {
            remainingMinutes -= 1;
            remainingSeconds = 59;
          }

          return {
            ...chair,
            activeInChair: {
              ...chair.activeInChair,
              remainingMinutes,
              remainingSeconds,
            },
          };
        })
      );
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Action: Verify OTP and seat customer
  const verifyOtp = async (payload: OtpVerifyRequestDTO): Promise<boolean> => {
    try {
      const res = await barberApi.verifyOtp(payload);
      if (res.success) {
        setChairs((prev) =>
          prev.map((c) => {
            if (c.chairId !== payload.chairId) return c;

            // Find matching upcoming appointment
            const seatedAppointment = c.upcomingQueue.find((q) => q.appointmentId === payload.appointmentId) || c.upcomingQueue[0];
            const remainingUpcoming = c.upcomingQueue.filter((q) => q.appointmentId !== seatedAppointment?.appointmentId);

            return {
              ...c,
              status: 'BUSY',
              activeInChair: seatedAppointment ? {
                appointmentId: seatedAppointment.appointmentId,
                ticketNumber: seatedAppointment.ticketNumber,
                customerName: seatedAppointment.customerName,
                serviceNames: seatedAppointment.serviceNames,
                startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                totalDurationMinutes: 30,
                remainingMinutes: 29,
                remainingSeconds: 59,
              } : c.activeInChair,
              upcomingQueue: remainingUpcoming,
            };
          })
        );
        showToast(`OTP Verified! Customer is seated.`, 'success');
        return true;
      }
      return false;
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'OTP verification failed', 'warning');
      return false;
    }
  };

  // Action: Complete service and release chair (triggers Rs. 50 deduction in WalletService)
  const completeService = async (chairId: string, appointmentId: string) => {
    try {
      await barberApi.completeService(appointmentId);

      setChairs((prev) =>
        prev.map((c) => {
          if (c.chairId !== chairId) return c;
          return {
            ...c,
            status: 'ONLINE',
            activeInChair: undefined, // Chair is now free
          };
        })
      );

      // Deduct Rs. 50 platform commission and bump stats
      if (wallet) {
        setWallet((w) => (w ? { ...w, balanceLkr: w.balanceLkr - 50 } : null));
      }
      if (stats) {
        setStats((s) => (s ? { ...s, completedAppointmentsCount: s.completedAppointmentsCount + 1, dailyRevenueLkr: s.dailyRevenueLkr + 1800 } : null));
      }

      showToast(`Service Completed! Chair released. Rs. 50 commission recorded.`, 'success');
    } catch {
      showToast('Error completing service.', 'warning');
    }
  };

  // Action: Delay Shift (+15 minutes)
  const applyDelayShift = async (chairId: string) => {
    try {
      await barberApi.applyDelayShift({ chairId, delayMinutes: 15 });
      setChairs((prev) =>
        prev.map((c) => {
          if (c.chairId !== chairId || !c.activeInChair) return c;
          return {
            ...c,
            activeInChair: {
              ...c.activeInChair,
              remainingMinutes: c.activeInChair.remainingMinutes + 15,
            },
          };
        })
      );
      showToast(`+15m Shift applied! Downstream customers notified in real-time.`, 'info');
    } catch {
      showToast('Failed to apply delay shift.', 'warning');
    }
  };

  // Action: Walk-in Quick Dispatch
  const registerWalkIn = async (payload: WalkInRequestDTO) => {
    try {
      const newBooking = await barberApi.registerWalkIn(payload);
      setChairs((prev) =>
        prev.map((c) => {
          if (c.chairId !== payload.chairId) return c;
          // If chair is free, seat immediately; else push to top of queue
          if (!c.activeInChair) {
            return {
              ...c,
              status: 'BUSY',
              activeInChair: {
                appointmentId: newBooking.appointmentId,
                ticketNumber: newBooking.ticketNumber,
                customerName: newBooking.customerName,
                serviceNames: newBooking.services.map((s) => s.name).join(', '),
                startedAt: 'Just now',
                totalDurationMinutes: newBooking.totalDurationMinutes,
                remainingMinutes: newBooking.totalDurationMinutes,
                remainingSeconds: 0,
              },
            };
          } else {
            return {
              ...c,
              upcomingQueue: [
                {
                  appointmentId: newBooking.appointmentId,
                  ticketNumber: newBooking.ticketNumber,
                  customerName: newBooking.customerName,
                  serviceNames: newBooking.services.map((s) => s.name).join(', '),
                  scheduledTime: 'Walk-in Next',
                  status: 'NEXT_IN_LINE',
                },
                ...c.upcomingQueue,
              ],
            };
          }
        })
      );
      showToast(`Walk-in ${newBooking.ticketNumber} registered to Chair!`, 'success');
    } catch {
      showToast('Failed to register walk-in.', 'warning');
    }
  };

  // Action: Toggle Chair Online / On Break
  const toggleChairStatus = async (chairId: string) => {
    const chair = chairs.find((c) => c.chairId === chairId);
    if (!chair) return;
    const nextStatus = chair.status === 'ONLINE' ? 'ON_BREAK' : 'ONLINE';
    setChairs((prev) =>
      prev.map((c) => (c.chairId === chairId ? { ...c, status: nextStatus } : c))
    );
    showToast(`Chair ${chair.chairNumber} is now ${nextStatus === 'ONLINE' ? 'Online' : 'On Break'}.`, 'info');
  };

  return {
    chairs,
    stats,
    wallet,
    isLoading,
    toastMessage,
    verifyOtp,
    completeService,
    applyDelayShift,
    registerWalkIn,
    toggleChairStatus,
    refreshQueue: loadState,
  };
};
