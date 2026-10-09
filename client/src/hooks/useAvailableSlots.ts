/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - useAvailableSlots Hook
 * ============================================================================
 * Connects with Spring Boot Slot Calculation Service:
 * -> com.glowslot.service.SlotCalculationService.java
 *
 * Implements 45-minute booking slots and checks real availability
 * against actual customer appointments and barber breaks.
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { bookingApi, type AvailableSlot } from '../api/bookingApi';

export const useAvailableSlots = (date: string, stylistId?: string) => {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getAvailableSlots(date, stylistId);
      setSlots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch slots');
    } finally {
      setIsLoading(false);
    }
  }, [date, stylistId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Listen for real-time barber break or booking changes
  useEffect(() => {
    const handleUpdate = () => {
      fetchSlots();
    };
    window.addEventListener('trimly_store_updated', handleUpdate);
    return () => window.removeEventListener('trimly_store_updated', handleUpdate);
  }, [fetchSlots]);

  return { slots, isLoading, error, refreshSlots: fetchSlots };
};
