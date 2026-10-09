/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - PUBLIC BOOKING & SERVICE CATALOG API
 * ============================================================================
 * Connects with the Spring Boot Java Backend:
 * -> com.glowslot.controller.PublicBookingController.java
 *
 * Spring Boot DTOs and Services connected:
 * - Request:  com.glowslot.dto.request.BookingRequestDTO.java
 * - Response: com.glowslot.dto.response.AppointmentResponseDTO.java
 * - Service:  com.glowslot.service.SlotCalculationService.java (45m slot calculation)
 * - Service:  com.glowslot.service.BookingService.java (Atomic slot locking)
 * ============================================================================
 */

import { apiClient } from './client';
import { salonStore, SALON_SERVICES } from '../utils/salonStore';
import westernCuttersImg from '../assets/salon_hero.jpg';
import royalBladeImg from '../assets/royal_blade.jpg';
import easternGlowImg from '../assets/eastern_glow.webp';
import barberRifasImg from '../assets/barber_rifas.jpg';
import barberKannanImg from '../assets/barber_kannan.jpg';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'haircut' | 'beard' | 'massage' | 'kids' | 'package';
  durationMinutes: number;
  priceLkr: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
}

export interface StylistChair {
  id: string;
  chairNumber: number;
  name: string;
  avatarUrl: string;
  role: string;
  status: 'ONLINE' | 'BUSY' | 'ON_BREAK' | 'OFFLINE';
  nextFreeTime: string;
  currentCustomer?: string;
  queueLength: number;
}

export interface SalonDetails {
  id: string;
  name: string;
  tagline: string;
  address: string;
  rating: number;
  reviewsCount: number;
  activeChairsCount: number;
  totalChairsCount: number;
  estWaitMinutes: number;
  openingHours: string;
  todaySchedule: string;
  phone: string;
  heroImageUrl: string;
}

export interface AvailableSlot {
  time: string;
  formattedTime: string;
  isAvailable: boolean;
  statusText?: 'Open' | 'Booked' | 'Break' | 'Passed';
  chairId?: string;
}

/**
 * Maps to com.glowslot.dto.request.BookingRequestDTO.java
 */
export interface BookingRequestDTO {
  salonId: string;
  customerName: string;
  customerPhone: string;
  serviceIds: string[];
  preferredChairId?: string; // Optional: specific chair or "ANY"
  date: string;              // Format: YYYY-MM-DD
  timeSlot: string;          // Format: HH:mm
}

/**
 * Maps to com.glowslot.dto.response.AppointmentResponseDTO.java
 */
export interface AppointmentResponseDTO {
  appointmentId: string;
  ticketNumber: string;      // e.g. "GS-1042"
  salonName: string;
  salonAddress: string;
  salonImageUrl?: string;
  chairId: string;
  chairName: string;
  services: ServiceItem[];
  customerName: string;
  customerPhone: string;
  scheduledTime: string;
  estimatedChairTime: string;
  totalDurationMinutes: number;
  totalPriceLkr: number;
  otp: string;               // 4-digit verification code (tamper-resistant)
  queuePosition: number;
  status: 'PENDING' | 'SEATED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  createdAt: string;
}

export const SALON_DIRECTORY: Record<string, SalonDetails> = {
  salon_1: {
    id: 'salon_1',
    name: 'Western Cutters',
    tagline: 'Clinical precision hair sculpting, hot-steam beard tailoring, and restorative herbal scalp treatments tuned for Eastern Province humidity.',
    address: 'Main Street, Akkaraipattu',
    rating: 4.9,
    reviewsCount: 342,
    activeChairsCount: 2,
    totalChairsCount: 2,
    estWaitMinutes: 10,
    openingHours: '09:00 AM - 09:00 PM',
    todaySchedule: '09:00 - 21:00 IST',
    phone: '+94 67 227 8901',
    heroImageUrl: westernCuttersImg,
  },
  salon_2: {
    id: 'salon_2',
    name: 'Royal Blades Barbershop',
    tagline: 'Modern fades, beard styling, hot towels and revitalizing head washes for the contemporary gentleman.',
    address: 'Clock Tower Junction, Akkaraipattu',
    rating: 4.7,
    reviewsCount: 189,
    activeChairsCount: 3,
    totalChairsCount: 3,
    estWaitMinutes: 20,
    openingHours: '09:00 AM - 09:30 PM',
    todaySchedule: '09:00 - 21:30 IST',
    phone: '+94 67 227 4512',
    heroImageUrl: royalBladeImg,
  },
  salon_3: {
    id: 'salon_3',
    name: 'Eastern Glow Unisex Lounge',
    tagline: 'Premium styling, facial treatments, hair spa and family grooming in a relaxed sanctuary.',
    address: 'Hospital Road, Akkaraipattu',
    rating: 4.8,
    reviewsCount: 220,
    activeChairsCount: 4,
    totalChairsCount: 4,
    estWaitMinutes: 15,
    openingHours: '08:30 AM - 10:00 PM',
    todaySchedule: '08:30 - 22:00 IST',
    phone: '+94 67 227 9123',
    heroImageUrl: easternGlowImg,
  },
};

export const bookingApi = {
  /**
   * Fetches salon identity & services catalog
   * Connects to Spring Boot:
   * @GetMapping("/api/v1/public/salons/{id}")
   */
  async getSalonDetails(salonId: string = 'salon_1'): Promise<SalonDetails> {
    try {
      return await apiClient.get<SalonDetails>(`/api/v1/public/salons/${salonId}`);
    } catch {
      return SALON_DIRECTORY[salonId] || SALON_DIRECTORY['salon_1'];
    }
  },

  /**
   * Fetches service menu items with realistic pricing:
   * - Normal Haircut with beard cut: 800.00
   * - Haircut Only: 400.00
   * - Realistic rates for other grooming items
   */
  async getServices(): Promise<ServiceItem[]> {
    return SALON_SERVICES;
  },

  /**
   * Fetches stylists / chairs (Chair 1 Dhanu & Chair 2 Thambi)
   */
  async getStylists(): Promise<StylistChair[]> {
    const chairs = salonStore.getWorkstationChairs();
    const chair1 = chairs[0];
    const chair2 = chairs[1];

    return [
      {
        id: 'chair_dhanu',
        chairNumber: 1,
        name: 'Chair 1: Dhanu',
        role: 'Master Barber / Fade Specialist',
        avatarUrl: barberRifasImg,
        status: chair1.status,
        nextFreeTime: chair1.status === 'ON_BREAK' ? 'On Break' : chair1.activeInChair ? 'Next 45m' : 'Ready Now',
        currentCustomer: chair1.activeInChair?.customerName,
        queueLength: chair1.upcomingQueue.length,
      },
      {
        id: 'chair_thambi',
        chairNumber: 2,
        name: 'Chair 2: Thambi',
        role: 'Senior Stylist / Scalp Therapist',
        avatarUrl: barberKannanImg,
        status: chair2.status,
        nextFreeTime: chair2.status === 'ON_BREAK' ? 'On Break' : chair2.activeInChair ? 'Next 45m' : 'Ready Now',
        currentCustomer: chair2.activeInChair?.customerName,
        queueLength: chair2.upcomingQueue.length,
      },
    ];
  },

  /**
   * Calculates realistic 45-minute booking slots (09:00 to 20:15)
   * Connects to Spring Boot:
   * @GetMapping("/api/v1/public/salons/{id}/slots")
   * com.glowslot.service.SlotCalculationService.java
   *
   * Only slots genuinely booked or marked as a Barber Break are unavailable.
   */
  async getAvailableSlots(date: string, stylistId?: string): Promise<AvailableSlot[]> {
    try {
      const url = `/api/v1/public/salons/salon_1/slots?date=${date}${stylistId ? `&stylistId=${stylistId}` : ''}`;
      return await apiClient.get<AvailableSlot[]>(url);
    } catch {
      return salonStore.calculateSlots(date, stylistId);
    }
  },

  /**
   * Creates an appointment booking and receives digital pass with 4-digit OTP
   * Connects to Spring Boot:
   * @PostMapping("/api/v1/public/bookings")
   * com.glowslot.service.BookingService.java
   */
  async createBooking(request: BookingRequestDTO): Promise<AppointmentResponseDTO> {
    try {
      return await apiClient.post<AppointmentResponseDTO>('/api/v1/public/bookings', request);
    } catch {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const randomTicket = `GS-${Math.floor(1000 + Math.random() * 9000)}`;

      const services = await this.getServices();
      const selected = services.filter((s) => request.serviceIds.includes(s.id));
      const totalMin = selected.reduce((acc, curr) => acc + curr.durationMinutes, 0) || 45;
      const totalCost = selected.reduce((acc, curr) => acc + curr.priceLkr, 0);

      const chairId = request.preferredChairId || 'chair_rifas';
      const chairName = chairId === 'chair_kannan' || chairId === 'chair_2' ? 'Chair 2: Thambi' : 'Chair 1: Dhanu';
      const salonInfo = SALON_DIRECTORY[request.salonId || 'salon_1'] || SALON_DIRECTORY['salon_1'];

      const pass: AppointmentResponseDTO = {
        appointmentId: `app_${Date.now()}`,
        ticketNumber: randomTicket,
        salonName: salonInfo.name,
        salonAddress: salonInfo.address,
        salonImageUrl: salonInfo.heroImageUrl,
        chairId,
        chairName,
        services: selected.length > 0 ? selected : [SALON_SERVICES[0]],
        customerName: request.customerName,
        customerPhone: request.customerPhone,
        scheduledTime: request.timeSlot || 'Upcoming',
        estimatedChairTime: request.timeSlot || 'Upcoming',
        totalDurationMinutes: totalMin,
        totalPriceLkr: totalCost,
        otp: generatedOtp,
        queuePosition: 1,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      // Persist into salonStore so the Barber Workstation receives it in real-time
      salonStore.saveAppointment(pass);
      return pass;
    }
  },

  /**
   * Retrieves active live pass by ID
   * Connects to Spring Boot:
   * @GetMapping("/api/v1/public/bookings/{id}/pass")
   */
  async getBookingPass(appointmentId: string): Promise<AppointmentResponseDTO | null> {
    try {
      return await apiClient.get<AppointmentResponseDTO>(`/api/v1/public/bookings/${appointmentId}/pass`);
    } catch {
      const stored = salonStore.getAppointments().find((a) => a.appointmentId === appointmentId);
      if (stored) return stored;

      const fallback = localStorage.getItem('glowslot_active_pass');
      if (fallback) return JSON.parse(fallback);
      return null;
    }
  },

  /**
   * Customer cancels booking (free of charge up to 30 mins before appointment)
   * Connects to Spring Boot:
   * @PostMapping("/api/v1/public/bookings/{id}/cancel")
   */
  async cancelBooking(appointmentId: string): Promise<boolean> {
    try {
      await apiClient.post(`/api/v1/public/bookings/${appointmentId}/cancel`);
    } catch {
      // local store update
    }
    salonStore.updateAppointmentStatus(appointmentId, 'CANCELLED');
    localStorage.removeItem('glowslot_active_pass');
    return true;
  },
};
