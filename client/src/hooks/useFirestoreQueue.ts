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
 * - Synchronizes breaks and real customer bookings
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

  // Listen for real-time store updates across tabs / components
  useEffect(() => {
    const handleStoreUpdate = () => {
      loadState();
    };
    window.addEventListener('trimly_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('trimly_store_updated', handleStoreUpdate);
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
        await loadState();
        showToast(res.message, 'success');
        return true;
      }
      return false;
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'OTP verification failed', 'warning');
      return false;
    }
  };

  // Action: Complete service and release chair (triggers Rs. 50 deduction in WalletService)
  const completeService = async (_chairId: string, appointmentId: string) => {
    try {
      await barberApi.completeService(appointmentId);
      await loadState();
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
      await loadState();
      showToast(`Walk-in customer ${newBooking.ticketNumber} registered to Chair!`, 'success');
    } catch {
      showToast('Failed to register walk-in.', 'warning');
    }
  };

  // Action: Toggle Chair Online / On Break
  const toggleChairStatus = async (chairId: string) => {
    const chair = chairs.find((c) => c.chairId === chairId);
    if (!chair) return;
    const nextStatus = chair.status === 'ONLINE' ? 'ON_BREAK' : 'ONLINE';
    if (nextStatus === 'ON_BREAK') {
      await barberApi.scheduleBreak(chairId, 'Current', 'Immediate Break');
    } else {
      await barberApi.endBreak(chairId);
    }
    await loadState();
    showToast(`Chair ${chair.chairNumber} (${chair.barberName}) is now ${nextStatus === 'ONLINE' ? 'Online' : 'On Break'}.`, 'info');
  };

  // Action: Schedule a specific break slot (blocks slot from customer booking)
  const scheduleBreak = async (chairId: string, timeSlot: string, reason: string) => {
    try {
      await barberApi.scheduleBreak(chairId, timeSlot, reason);
      await loadState();
      showToast(`Break booked for ${timeSlot} (${reason}). Customer booking blocked!`, 'info');
    } catch {
      showToast('Failed to schedule break.', 'warning');
    }
  };

  // Action: End Break
  const endBreak = async (chairId: string) => {
    try {
      await barberApi.endBreak(chairId);
      await loadState();
      showToast('Break ended! Chair is back Online for bookings.', 'success');
    } catch {
      showToast('Failed to end break.', 'warning');
    }
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
    scheduleBreak,
    endBreak,
    refreshQueue: loadState,
  };
};
