/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - PUBLIC CUSTOMER BOOKING API
 * ============================================================================
 * Integrates directly with Spring Boot Java Controller:
 * -> com.glowslot.controller.PublicBookingController.java
 *
 * Spring Boot DTOs and Services connected:
 * - Request:  com.glowslot.dto.request.BookingRequestDTO.java
 * - Response: com.glowslot.dto.response.AvailableSlotResponseDTO.java
 * - Response: com.glowslot.dto.response.AppointmentResponseDTO.java
 * - Service:  com.glowslot.service.SlotCalculationService.java (Overlap math & buffer)
 * - Service:  com.glowslot.service.BookingService.java (Atomic transaction + OTP)
 * ============================================================================
 */

import { apiClient } from './client';

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
      // Fallback data reflecting the Figma Design for Classic Cuts Grooming Lab
      return {
        id: 'salon_1',
        name: 'Classic Cuts Grooming Lab',
        tagline: 'Clinical precision hair sculpting, hot-steam beard tailoring, and restorative herbal scalp treatments tuned for Eastern Province humidity.',
        address: 'Main Street, Akkaraipattu, Eastern Province',
        rating: 4.9,
        reviewsCount: 342,
        activeChairsCount: 2,
        totalChairsCount: 2,
        estWaitMinutes: 12,
        openingHours: '09:00 AM - 10:00 PM',
        todaySchedule: '09:00 - 22:00 IST',
        phone: '+94 67 227 8901',
        heroImageUrl: '/src/assets/salon_hero.jpg',
      };
    }
  },

  /**
   * Fetches service menu items
   * Matches the Figma CSS Cards (Cards 1 to 5)
   */
  async getServices(): Promise<ServiceItem[]> {
    return [
      {
        id: 'srv_1',
        name: 'Standard Fade Cut & Wash',
        category: 'haircut',
        durationMinutes: 30,
        priceLkr: 1800,
        description: 'Skin or taper fade sculpted with clipper-over-comb precision, finished with hot lather wash.',
        badge: 'POPULAR',
        isPopular: true,
      },
      {
        id: 'srv_2',
        name: 'Beard Sculpt & Herbal Steam',
        category: 'beard',
        durationMinutes: 25,
        priceLkr: 1200,
        description: 'Razor cheek alignment, hot eucalyptus towel wrap, and deep conditioning argan butter infusion.',
        badge: 'BEST VALUE',
        isPopular: true,
      },
      {
        id: 'srv_3',
        name: 'Ayurvedic Scalp & Oil Massage',
        category: 'massage',
        durationMinutes: 40,
        priceLkr: 2500,
        description: 'Cooling brahmi and coconut herbal elixir treatment designed to counteract coastal humidity heat stress.',
      },
      {
        id: 'srv_4',
        name: 'Kids Clean Scissor Cut',
        category: 'kids',
        durationMinutes: 20,
        priceLkr: 1000,
        description: 'Patient, gentle scissor tailoring with organic tea tree wash for juniors under 12.',
      },
      {
        id: 'srv_5',
        name: 'Royal Grooming Package',
        category: 'package',
        durationMinutes: 75,
        priceLkr: 4500,
        description: 'The master experience: Signature Fade + Hot-Steam Beard Sculpt + Ayurvedic Scalp Pressure Massage & Clay Facial.',
        badge: 'ALL-INCLUSIVE SIGNATURE',
        isPopular: true,
      },
    ];
  },

  /**
   * Fetches stylists / chairs
   * Matches Figma CSS: Chair 1 Rifas & Chair 2 Kannan
   */
  async getStylists(): Promise<StylistChair[]> {
    return [
      {
        id: 'chair_rifas',
        chairNumber: 1,
        name: 'Chair 1: Rifas',
        role: 'Master Barber / Fade Specialist',
        avatarUrl: '/src/assets/barber_rifas.jpg',
        status: 'BUSY',
        nextFreeTime: '14:35',
        currentCustomer: 'David M.',
        queueLength: 2,
      },
      {
        id: 'chair_kannan',
        chairNumber: 2,
        name: 'Chair 2: Kannan',
        role: 'Senior Stylist / Scalp Therapist',
        avatarUrl: '/src/assets/barber_kannan.jpg',
        status: 'ONLINE',
        nextFreeTime: '14:15',
        currentCustomer: 'Imran K.',
        queueLength: 1,
      },
    ];
  },

  /**
   * Calculates available booking slots
   * Connects to Spring Boot:
   * @GetMapping("/api/v1/public/salons/{id}/slots")
   * com.glowslot.service.SlotCalculationService.java handles 5-10m buffer insertion
   */
  async getAvailableSlots(date: string, stylistId?: string): Promise<AvailableSlot[]> {
    try {
      const url = `/api/v1/public/salons/salon_1/slots?date=${date}${stylistId ? `&stylistId=${stylistId}` : ''}`;
      return await apiClient.get<AvailableSlot[]>(url);
    } catch {
      const times = [
        '14:00', '14:15', '14:30', '14:45',
        '15:00', '15:15', '15:30', '15:45',
        '16:00', '16:15', '16:30', '16:45',
        '17:00', '17:15', '17:30', '17:45',
        '18:00', '18:15', '18:30', '19:00',
      ];

      return times.map((t, idx) => ({
        time: t,
        formattedTime: t,
        isAvailable: idx !== 0 && idx !== 3 && idx !== 7, // mock occupied slots
      }));
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
      // Local mock response simulating successful Spring Boot atomic booking
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const randomTicket = `GS-${Math.floor(1000 + Math.random() * 9000)}`;

      const services = await this.getServices();
      const selected = services.filter((s) => request.serviceIds.includes(s.id));
      const totalMin = selected.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      const totalCost = selected.reduce((acc, curr) => acc + curr.priceLkr, 0);

      const pass: AppointmentResponseDTO = {
        appointmentId: `app_${Date.now()}`,
        ticketNumber: randomTicket,
        salonName: 'Classic Cuts Grooming Lab',
        salonAddress: 'Main Street, Akkaraipattu, Eastern Province',
        chairId: request.preferredChairId || 'chair_rifas',
        chairName: request.preferredChairId === 'chair_kannan' ? 'Chair 2: Kannan' : 'Chair 1: Rifas',
        services: selected,
        customerName: request.customerName || 'Kasun Perera',
        customerPhone: request.customerPhone || '077 123 4567',
        scheduledTime: request.timeSlot || '15:15',
        estimatedChairTime: request.timeSlot || '15:15',
        totalDurationMinutes: totalMin || 55,
        totalPriceLkr: totalCost || 3000,
        otp: generatedOtp,
        queuePosition: 2,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for instant tracking view
      localStorage.setItem('glowslot_active_pass', JSON.stringify(pass));
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
      const stored = localStorage.getItem('glowslot_active_pass');
      if (stored) {
        return JSON.parse(stored) as AppointmentResponseDTO;
      }
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
      localStorage.removeItem('glowslot_active_pass');
      return true;
    } catch {
      localStorage.removeItem('glowslot_active_pass');
      return true;
    }
  },
};
