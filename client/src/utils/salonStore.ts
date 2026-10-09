/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - REAL SALON STORE & STATE SYNCHRONIZATION
 * ============================================================================
 * Provides realistic, shared, persistent data for:
 * 1. Services & exact realistic pricing:
 *    - Normal Haircut Only: LKR 400.00 (45 mins)
 *    - Normal Haircut with Beard Cut: LKR 800.00 (45 mins)
 *    - Other realistic services: Beard Sculpt (300), Massage (350), etc.
 * 2. 45-minute booking slots (09:00 to 20:15) with zero fake "booked" slots.
 * 3. Barber break allocation: blocks specific 45m slots from customer booking.
 * 4. Real customer queues: no hardcoded fake customer names.
 * ============================================================================
 */

import type { ServiceItem, AppointmentResponseDTO, AvailableSlot } from '../api/bookingApi';
import type { BarberStationChair, WalletBalanceDTO } from '../api/barberApi';
import barberRifasImg from '../assets/barber_rifas.jpg';
import barberKannanImg from '../assets/barber_kannan.jpg';

export interface BarberBreak {
  id: string;
  chairId: string; // 'chair_1' | 'chair_2'
  barberName: string;
  date: string;     // YYYY-MM-DD
  timeSlot: string; // e.g. '13:30'
  reason: string;   // 'Lunch Break', 'Tea Break', 'Prayer / Personal'
  createdAt: string;
}

// Helper to get local date in YYYY-MM-DD format (avoids UTC timezone shift)
export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 45-Minute Standard Salon Time Slots (Opening: 09:00 AM, Closing: 09:00 PM)
export const STANDARD_45M_SLOTS = [
  '08:15',
  '09:00',
  '09:45',
  '10:30',
  '11:15',
  '12:00',
  '12:45',
  '13:30',
  '14:15',
  '15:00',
  '15:45',
  '16:30',
  '17:15',
  '18:00',
  '18:45',
  '19:30',
  '20:15',
  '21:00',
  '21:45',
  '22:30'
];

// 1. Realistic Services Menu
export const SALON_SERVICES: ServiceItem[] = [
  {
    id: 'srv_haircut_only',
    name: 'Normal Haircut Only',
    category: 'haircut',
    durationMinutes: 45,
    priceLkr: 400,
    description: 'Classic scissor & clipper tailoring, clean side taper, and razor back-neckline cleanup.',
    badge: 'EVERYDAY ESSENTIAL',
    isPopular: true,
  },
  {
    id: 'srv_haircut_beard',
    name: 'Normal Haircut with Beard Cut',
    category: 'package',
    durationMinutes: 45,
    priceLkr: 800,
    description: 'Complete grooming combo: Signature haircut, beard trim & sculpting, cheek razor alignment, and hot towel.',
    badge: 'BEST VALUE COMBO',
    isPopular: true,
  },
  {
    id: 'srv_beard_trim',
    name: 'Beard Trim & Razor Sculpt',
    category: 'beard',
    durationMinutes: 20,
    priceLkr: 300,
    description: 'Precision mustache & beard line sculpting with argan conditioning beard oil.',
    badge: 'QUICK GROOM',
  },
  {
    id: 'srv_haircut_wash',
    name: 'Haircut with Herbal Wash & Blowdry',
    category: 'haircut',
    durationMinutes: 45,
    priceLkr: 550,
    description: 'Tailored haircut followed by cooling menthol tea tree shampoo and styling finish.',
  },
  {
    id: 'srv_scalp_massage',
    name: 'Ayurvedic Scalp & Head Massage',
    category: 'massage',
    durationMinutes: 25,
    priceLkr: 350,
    description: 'Traditional cooling brahmi & coconut oil pressure point therapy for heat stress relief.',
  },
  {
    id: 'srv_kids_cut',
    name: 'Kids Clean Scissor Cut',
    category: 'kids',
    durationMinutes: 30,
    priceLkr: 300,
    description: 'Gentle, patient haircut for boys and students under 12 years.',
  },
  {
    id: 'srv_black_dye',
    name: 'Herbal Black Hair Dye / Beard Color',
    category: 'haircut',
    durationMinutes: 35,
    priceLkr: 500,
    description: 'Natural ammonia-free black tint coverage with thorough cleansing rinse.',
  },
  {
    id: 'srv_steam_facial',
    name: 'Hot Steam Facial & Clay Clean-up',
    category: 'package',
    durationMinutes: 30,
    priceLkr: 600,
    description: 'Deep pore unclogging steam, walnut scrub exfoliation, and cooling aloe vera pack.',
  },
  {
    id: 'srv_royal_vip',
    name: 'Royal VIP Full Grooming Package',
    category: 'package',
    durationMinutes: 60,
    priceLkr: 1500,
    description: 'Haircut + Beard Cut + Scalp Massage + Hot Steam Facial + Tea Tree Wash.',
    badge: 'ALL-INCLUSIVE',
    isPopular: true,
  },
];

// Helper: Local Storage wrapper
class SalonStore {
  private appointmentsKey = 'trimly_real_appointments';
  private breaksKey = 'trimly_real_barber_breaks';
  private walletKey = 'trimly_real_wallet';

  // Dispatch global custom event for instant cross-component updates
  private notifyChange() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trimly_store_updated'));
    }
  }

  // --- APPOINTMENTS ---
  public getAppointments(date?: string): AppointmentResponseDTO[] {
    try {
      const data = localStorage.getItem(this.appointmentsKey);
      const list: AppointmentResponseDTO[] = data ? JSON.parse(data) : [];
      if (date) {
        return list.filter((a) => a.scheduledTime?.startsWith(date) || (a as any).date === date);
      }
      return list;
    } catch {
      return [];
    }
  }

  public saveAppointment(appointment: AppointmentResponseDTO): void {
    const list = this.getAppointments();
    list.push(appointment);
    try {
      localStorage.setItem(this.appointmentsKey, JSON.stringify(list));
      localStorage.setItem('glowslot_active_pass', JSON.stringify(appointment));
    } catch {
      // storage quota fallback
    }
    this.notifyChange();
  }

  public updateAppointmentStatus(appointmentId: string, status: AppointmentResponseDTO['status']): void {
    const list = this.getAppointments();
    const updated = list.map((a) => (a.appointmentId === appointmentId ? { ...a, status } : a));
    try {
      localStorage.setItem(this.appointmentsKey, JSON.stringify(updated));
    } catch {}
    this.notifyChange();
  }

  // --- BARBER BREAKS ---
  public getBarberBreaks(date?: string): BarberBreak[] {
    try {
      const data = localStorage.getItem(this.breaksKey);
      const list: BarberBreak[] = data ? JSON.parse(data) : [];
      if (date) {
        return list.filter((b) => b.date === date);
      }
      return list;
    } catch {
      return [];
    }
  }

  public scheduleBreak(chairId: string, timeSlot: string, reason: string = 'Tea Break', date?: string): BarberBreak {
    const today = date || new Date().toISOString().split('T')[0];
    const barberName = chairId === 'chair_1' ? 'Dhanu' : 'Thambi';
    const newBreak: BarberBreak = {
      id: `brk_${Date.now()}`,
      chairId,
      barberName,
      date: today,
      timeSlot,
      reason,
      createdAt: new Date().toISOString(),
    };

    const list = this.getBarberBreaks();
    // Prevent duplicate break for same chair & slot
    const filtered = list.filter((b) => !(b.chairId === chairId && b.date === today && b.timeSlot === timeSlot));
    filtered.push(newBreak);

    try {
      localStorage.setItem(this.breaksKey, JSON.stringify(filtered));
    } catch {}

    this.notifyChange();
    return newBreak;
  }

  public removeBreak(breakId: string): void {
    const list = this.getBarberBreaks();
    const updated = list.filter((b) => b.id !== breakId);
    try {
      localStorage.setItem(this.breaksKey, JSON.stringify(updated));
    } catch {}
    this.notifyChange();
  }

  public clearBreaksForChair(chairId: string, date?: string): void {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const list = this.getBarberBreaks();
    const updated = list.filter((b) => !(b.chairId === chairId && b.date === targetDate));
    try {
      localStorage.setItem(this.breaksKey, JSON.stringify(updated));
    } catch {}
    this.notifyChange();
  }

  // --- 45-MINUTE SLOTS AVAILABILITY CALCULATION ---
  public calculateSlots(date: string, chairId?: string): AvailableSlot[] {
    const todayStr = getLocalDateString();
    const targetDate = date || todayStr;
    const isToday = targetDate === todayStr;
    const isPastDate = targetDate < todayStr;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const appointments = this.getAppointments(targetDate).filter((a) => a.status !== 'CANCELLED');
    const breaks = this.getBarberBreaks(targetDate);

    return STANDARD_45M_SLOTS.map((slotTime) => {
      const [slotH, slotM] = slotTime.split(':').map(Number);
      const slotMinutes = slotH * 60 + slotM;
      // Slot is in the past if selected date is past, or if today and slot time is earlier or equal to current time
      const isPastSlot = isPastDate || (isToday && slotMinutes <= currentMinutes);

      // If slot has already passed, it is strictly non-bookable
      if (isPastSlot) {
        return {
          time: slotTime,
          formattedTime: slotTime,
          isAvailable: false,
          statusText: 'Passed',
          chairId,
        };
      }

      // Check if Chair 1 is occupied / break
      const chair1Booked = appointments.some(
        (a) => (a.chairId === 'chair_1' || a.chairId === 'chair_rifas') && a.scheduledTime === slotTime
      );
      const chair1Break = breaks.some((b) => b.chairId === 'chair_1' && b.timeSlot === slotTime);

      // Check if Chair 2 is occupied / break
      const chair2Booked = appointments.some(
        (a) => (a.chairId === 'chair_2' || a.chairId === 'chair_kannan') && a.scheduledTime === slotTime
      );
      const chair2Break = breaks.some((b) => b.chairId === 'chair_2' && b.timeSlot === slotTime);

      let isAvailable = true;
      let statusText: 'Open' | 'Booked' | 'Break' | 'Passed' = 'Open';

      if (chairId === 'chair_rifas' || chairId === 'chair_1') {
        if (chair1Booked) {
          isAvailable = false;
          statusText = 'Booked';
        } else if (chair1Break) {
          isAvailable = false;
          statusText = 'Break';
        }
      } else if (chairId === 'chair_kannan' || chairId === 'chair_2') {
        if (chair2Booked) {
          isAvailable = false;
          statusText = 'Booked';
        } else if (chair2Break) {
          isAvailable = false;
          statusText = 'Break';
        }
      } else {
        // "ANY" Available: Available if at least ONE chair is free from booking & break
        const chair1Free = !chair1Booked && !chair1Break;
        const chair2Free = !chair2Booked && !chair2Break;

        if (!chair1Free && !chair2Free) {
          isAvailable = false;
          statusText = chair1Break && chair2Break ? 'Break' : 'Booked';
        }
      }

      return {
        time: slotTime,
        formattedTime: slotTime,
        isAvailable,
        statusText,
        chairId,
      };
    });
  }

  // --- WORKSTATION QUEUE BUILDER (NO FAKE NAMES) ---
  public getWorkstationChairs(targetDate?: string): BarberStationChair[] {
    const today = targetDate || new Date().toISOString().split('T')[0];
    const appointments = this.getAppointments(today).filter((a) => a.status !== 'CANCELLED');
    const breaks = this.getBarberBreaks(today);

    // Chair 1: Dhanu
    const chair1Appts = appointments.filter((a) => a.chairId === 'chair_1' || a.chairId === 'chair_rifas');
    const chair1ActiveAppt = chair1Appts.find((a) => a.status === 'SEATED' || a.status === 'IN_SERVICE');
    const chair1Upcoming = chair1Appts.filter((a) => a.status === 'PENDING');
    const chair1HasActiveBreak = breaks.some((b) => b.chairId === 'chair_1');

    // Chair 2: Thambi
    const chair2Appts = appointments.filter((a) => a.chairId === 'chair_2' || a.chairId === 'chair_kannan');
    const chair2ActiveAppt = chair2Appts.find((a) => a.status === 'SEATED' || a.status === 'IN_SERVICE');
    const chair2Upcoming = chair2Appts.filter((a) => a.status === 'PENDING');
    const chair2HasActiveBreak = breaks.some((b) => b.chairId === 'chair_2');

    return [
      {
        chairId: 'chair_1',
        chairNumber: 1,
        barberName: 'Dhanu',
        barberAvatar: barberRifasImg,
        specialization: 'Master Barber / Fade Specialist',
        status: chair1HasActiveBreak ? 'ON_BREAK' : chair1ActiveAppt ? 'BUSY' : 'ONLINE',
        activeInChair: chair1ActiveAppt
          ? {
              appointmentId: chair1ActiveAppt.appointmentId,
              ticketNumber: chair1ActiveAppt.ticketNumber,
              customerName: chair1ActiveAppt.customerName,
              serviceNames: chair1ActiveAppt.services.map((s) => s.name).join(', '),
              startedAt: chair1ActiveAppt.scheduledTime,
              totalDurationMinutes: chair1ActiveAppt.totalDurationMinutes || 45,
              remainingMinutes: 35,
              remainingSeconds: 0,
            }
          : undefined,
        upcomingQueue: chair1Upcoming.map((a, idx) => ({
          appointmentId: a.appointmentId,
          ticketNumber: a.ticketNumber,
          customerName: a.customerName,
          serviceNames: a.services.map((s) => s.name).join(', '),
          scheduledTime: a.scheduledTime,
          status: idx === 0 ? 'NEXT_IN_LINE' : 'RESERVED_WINDOW',
          otp: a.otp,
        })),
      },
      {
        chairId: 'chair_2',
        chairNumber: 2,
        barberName: 'Thambi',
        barberAvatar: barberKannanImg,
        specialization: 'Senior Stylist / Scalp Therapist',
        status: chair2HasActiveBreak ? 'ON_BREAK' : chair2ActiveAppt ? 'BUSY' : 'ONLINE',
        activeInChair: chair2ActiveAppt
          ? {
              appointmentId: chair2ActiveAppt.appointmentId,
              ticketNumber: chair2ActiveAppt.ticketNumber,
              customerName: chair2ActiveAppt.customerName,
              serviceNames: chair2ActiveAppt.services.map((s) => s.name).join(', '),
              startedAt: chair2ActiveAppt.scheduledTime,
              totalDurationMinutes: chair2ActiveAppt.totalDurationMinutes || 45,
              remainingMinutes: 28,
              remainingSeconds: 30,
            }
          : undefined,
        upcomingQueue: chair2Upcoming.map((a, idx) => ({
          appointmentId: a.appointmentId,
          ticketNumber: a.ticketNumber,
          customerName: a.customerName,
          serviceNames: a.services.map((s) => s.name).join(', '),
          scheduledTime: a.scheduledTime,
          status: idx === 0 ? 'NEXT_IN_LINE' : 'RESERVED_WINDOW',
          otp: a.otp,
        })),
      },
    ];
  }

  // --- WALLET TELEMETRY ---
  public getWallet(): WalletBalanceDTO {
    try {
      const data = localStorage.getItem(this.walletKey);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      balanceLkr: 2450,
      currency: 'LKR',
      commissionPerCutLkr: 50,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  public deductCommission(amountLkr: number = 50): WalletBalanceDTO {
    const current = this.getWallet();
    const updated = {
      ...current,
      balanceLkr: Math.max(0, current.balanceLkr - amountLkr),
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    try {
      localStorage.setItem(this.walletKey, JSON.stringify(updated));
    } catch {}
    this.notifyChange();
    return updated;
  }
}

export const salonStore = new SalonStore();
