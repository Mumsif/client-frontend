/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - useAvailableSlots Hook
 * ============================================================================
 * Connects with Spring Boot Slot Calculation Service:
 * -> com.glowslot.service.SlotCalculationService.java
 *
 * Implements buffer calculation (5-10 min intervals between cuts) and
 * checks availability dynamically against existing appointments.
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

  return { slots, isLoading, error, refreshSlots: fetchSlots };
};
