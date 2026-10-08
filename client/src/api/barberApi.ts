/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - BARBER WORKSTATION OPERATIONAL API
 * ============================================================================
 * Connects with the Spring Boot Java Backend:
 * -> com.glowslot.controller.BarberController.java
 *
 * Spring Boot DTOs and Services connected:
 * - Request:  com.glowslot.dto.request.OtpVerifyRequestDTO.java
 * - Request:  com.glowslot.dto.request.WalkInRequestDTO.java
 * - Request:  com.glowslot.dto.request.DelayShiftRequestDTO.java
 * - Response: com.glowslot.dto.response.WalletBalanceDTO.java
 * - Service:  com.glowslot.service.QueueManagementService.java (Walk-in & cascading delays)
 * - Service:  com.glowslot.service.WalletService.java (LKR 50 commission deduction on completion)
 * ============================================================================
 */

import { apiClient } from './client';
import type { AppointmentResponseDTO } from './bookingApi';

export interface BarberStationChair {
  chairId: string;
  chairNumber: number;
  barberName: string;
  barberAvatar: string;
  specialization: string;
  status: 'ONLINE' | 'BUSY' | 'ON_BREAK';
  activeInChair?: {
    appointmentId: string;
    ticketNumber: string;
    customerName: string;
    serviceNames: string;
    startedAt: string;
    totalDurationMinutes: number;
    remainingMinutes: number;
    remainingSeconds: number;
  };
  upcomingQueue: Array<{
    appointmentId: string;
    ticketNumber: string;
    customerName: string;
    serviceNames: string;
    scheduledTime: string;
    status: 'NEXT_IN_LINE' | 'RESERVED_WINDOW';
    otp?: string;
  }>;
}

export interface SalonTelemetryStats {
  dailyRevenueLkr: number;
  completedAppointmentsCount: number;
  avgTurnaroundMinutes: number;
  queueVelocityScore: number;
  activeChairsCount: number;
  totalChairsCount: number;
}

export interface WalletBalanceDTO {
  balanceLkr: number;
  currency: string;
  commissionPerCutLkr: number;
  lastUpdated: string;
}

export interface OtpVerifyRequestDTO {
  chairId: string;
  appointmentId: string;
  otp: string;
}

export interface WalkInRequestDTO {
  chairId: string;
  customerName?: string;
  serviceType: 'QUICK_CUT' | 'BEARD_TRIM' | 'COMBO_EXPRESS';
  customDurationMinutes?: number;
  priceLkr?: number;
}

export interface DelayShiftRequestDTO {
  chairId: string;
  delayMinutes: number; // e.g. 15
  reason?: string;
}

export const barberApi = {
  /**
   * Fetches full workstation board data for all active chairs
   * Connects to Spring Boot:
   * @GetMapping("/api/v1/barber/workstation/{salonId}")
   */
  async getWorkstationState(salonId: string = 'salon_1'): Promise<{
    chairs: BarberStationChair[];
    stats: SalonTelemetryStats;
    wallet: WalletBalanceDTO;
  }> {
    try {
      return await apiClient.get(`/api/v1/barber/workstation/${salonId}`);
    } catch {
      // Mock data strictly matching the Figma CSS layers for Chair 1 (Rifas) & Chair 2 (Kannan)
      return {
        chairs: [
          {
            chairId: 'chair_1',
            chairNumber: 1,
            barberName: 'Rifas',
            barberAvatar: '/src/assets/barber_rifas.jpg',
            specialization: 'Master Barber / Fade Specialist',
            status: 'ONLINE',
            activeInChair: {
              appointmentId: 'app_1042',
              ticketNumber: 'GS-1042',
              customerName: 'David M.',
              serviceNames: 'Skin Fade + Hot Lather Wash',
              startedAt: '14:05',
              totalDurationMinutes: 30,
              remainingMinutes: 14,
              remainingSeconds: 20,
            },
            upcomingQueue: [
              {
                appointmentId: 'app_1043',
                ticketNumber: 'GS-1043',
                customerName: 'Tharindu P.',
                serviceNames: 'Standard Fade Cut & Beard Sculpt',
                scheduledTime: '14:45',
                status: 'NEXT_IN_LINE',
                otp: '8492',
              },
              {
                appointmentId: 'app_1044',
                ticketNumber: 'GS-1044',
                customerName: 'Kasun R.',
                serviceNames: 'Ayurvedic Scalp & Oil Massage',
                scheduledTime: '15:30',
                status: 'RESERVED_WINDOW',
              },
            ],
          },
          {
            chairId: 'chair_2',
            chairNumber: 2,
            barberName: 'Kannan',
            barberAvatar: '/src/assets/barber_kannan.jpg',
            specialization: 'Senior Stylist / Scalp Therapist',
            status: 'ONLINE',
            activeInChair: {
              appointmentId: 'app_1040',
              ticketNumber: 'GS-1040',
              customerName: 'Imran K.',
              serviceNames: 'Ayurvedic Scalp Treatment & Beard Trim',
              startedAt: '14:00',
              totalDurationMinutes: 40,
              remainingMinutes: 8,
              remainingSeconds: 45,
            },
            upcomingQueue: [
              {
                appointmentId: 'app_1045',
                ticketNumber: 'GS-1045',
                customerName: 'Imran K. (Followup)',
                serviceNames: 'Kids Scissor Cut',
                scheduledTime: '14:50',
                status: 'NEXT_IN_LINE',
                otp: '4190',
              },
              {
                appointmentId: 'app_1046',
                ticketNumber: 'GS-1046',
                customerName: 'Dinesh S.',
                serviceNames: 'Standard Haircut',
                scheduledTime: '15:25',
                status: 'RESERVED_WINDOW',
              },
            ],
          },
        ],
        stats: {
          dailyRevenueLkr: 28400,
          completedAppointmentsCount: 16,
          avgTurnaroundMinutes: 24,
          queueVelocityScore: 98,
          activeChairsCount: 2,
          totalChairsCount: 2,
        },
        wallet: {
          balanceLkr: 4250,
          currency: 'LKR',
          commissionPerCutLkr: 50,
          lastUpdated: '14:20 IST',
        },
      };
    }
  },

  /**
   * Verifies customer OTP to start haircut/service
   * Connects to Spring Boot:
   * @PostMapping("/api/v1/barber/verify-otp")
   * Handled by com.glowslot.service.QueueManagementService.java
   */
  async verifyOtp(payload: OtpVerifyRequestDTO): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.post<{ success: boolean; message: string }>('/api/v1/barber/verify-otp', payload);
    } catch {
      // Simulate verification validation
      if (payload.otp.trim().length >= 4) {
        return { success: true, message: 'OTP verified successfully! Customer seated in chair.' };
      }
      throw new Error('Invalid OTP. Please verify with customer.');
    }
  },

  /**
   * Completes the current service and releases chair
   * Connects to Spring Boot:
   * @PostMapping("/api/v1/barber/complete-service/{appointmentId}")
   * Automatically triggers com.glowslot.service.WalletService.java
   * to deduct Rs. 50 platform commission and advance the queue in Firestore
   */
  async completeService(appointmentId: string): Promise<{ success: boolean; commissionDeductedLkr: number }> {
    try {
      return await apiClient.post(`/api/v1/barber/complete-service/${appointmentId}`);
    } catch {
      return { success: true, commissionDeductedLkr: 50 };
    }
  },

  /**
   * Emergency Delay Shift (+15 minutes cascading delay)
   * Connects to Spring Boot:
   * @PostMapping("/api/v1/barber/delay-shift")
   * com.glowslot.service.QueueManagementService.java
   * Cascades estimated arrival notifications to all downstream booked customers
   */
  async applyDelayShift(payload: DelayShiftRequestDTO): Promise<{ success: boolean; shiftedCount: number }> {
    try {
      return await apiClient.post('/api/v1/barber/delay-shift', payload);
    } catch {
      return { success: true, shiftedCount: 4 };
    }
  },

  /**
   * Quick Walk-in dispatch from workstation tray chips
   * Connects to Spring Boot:
   * @PostMapping("/api/v1/barber/walk-in")
   * com.glowslot.service.QueueManagementService.java
   */
  async registerWalkIn(payload: WalkInRequestDTO): Promise<AppointmentResponseDTO> {
    try {
      return await apiClient.post('/api/v1/barber/walk-in', payload);
    } catch {
      const ticket = `WI-${Math.floor(100 + Math.random() * 900)}`;
      return {
        appointmentId: `app_${Date.now()}`,
        ticketNumber: ticket,
        salonName: 'Classic Cuts Grooming Lab',
        salonAddress: 'Akkaraipattu',
        chairId: payload.chairId,
        chairName: payload.chairId === 'chair_2' ? 'Chair 2: Kannan' : 'Chair 1: Rifas',
        services: [
          {
            id: 'srv_walkin',
            name: payload.serviceType === 'QUICK_CUT' ? 'Express Haircut' : payload.serviceType === 'BEARD_TRIM' ? 'Quick Beard Trim' : 'Express Cut & Shave',
            category: 'haircut',
            durationMinutes: payload.customDurationMinutes || 20,
            priceLkr: payload.priceLkr || 1200,
            description: 'Direct walk-in customer queued from workstation tray',
          },
        ],
        customerName: payload.customerName || 'Walk-in Client',
        customerPhone: 'N/A',
        scheduledTime: 'Immediate',
        estimatedChairTime: 'Immediate',
        totalDurationMinutes: payload.customDurationMinutes || 20,
        totalPriceLkr: payload.priceLkr || 1200,
        otp: '----',
        queuePosition: 1,
        status: 'SEATED',
        createdAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Toggle chair state (Online vs On Break)
   * Connects to Spring Boot:
   * @PostMapping("/api/v1/barber/chair/{chairId}/toggle-status")
   */
  async toggleChairStatus(chairId: string, currentStatus: string): Promise<'ONLINE' | 'ON_BREAK'> {
    try {
      return await apiClient.post(`/api/v1/barber/chair/${chairId}/toggle-status`, { chairId });
    } catch {
      return currentStatus === 'ONLINE' ? 'ON_BREAK' : 'ONLINE';
    }
  },
};
