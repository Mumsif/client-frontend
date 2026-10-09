/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - CUSTOMER BOOKING & SERVICE MENU VIEW
 * ============================================================================
 * Full implementation translating the Figma CSS Layers:
 * - Header (GlowSlot Logo, nav links, live status)
 * - Section: Sticky Sub-Header Elevation Bar
 * - Section: Salon Identity Spotlight & Live Atmospheric Panel
 * - Quick Operations Diagnostic Card
 * - Section: Stylist & Chair Selector (Any Available, Rifas, Kannan)
 * - Multi-Service Selector Section (Category Filter Tabs + Service Cards Grid)
 * - Slot Grid with 5-10m safe buffer calculations
 * - Section: Hygiene & Hub Guarantees Notice
 * - Aside: Instant Sticky Summary & Flow Trigger Floating Dock
 *
 * Connects with Spring Boot:
 * - com.glowslot.controller.PublicBookingController.java
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  bookingApi,
  type ServiceItem,
  type StylistChair,
  type SalonDetails,
  type AppointmentResponseDTO,
} from '../../api/bookingApi';
import { ServiceCard } from '../../components/customer/ServiceCard';
import { StylistSelector } from '../../components/customer/StylistSelector';
import { SlotGrid } from '../../components/customer/SlotGrid';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAvailableSlots } from '../../hooks/useAvailableSlots';
import { getLocalDateString } from '../../utils/salonStore';
import westernCuttersImg from '../../assets/salon_hero.jpg';
import royalBladeImg from '../../assets/royal_blade.jpg';
import easternGlowImg from '../../assets/eastern_glow.webp';

export interface ServiceBookingViewProps {
  salonId?: string;
  hasActivePass?: boolean;
  onBookingConfirmed: (pass: AppointmentResponseDTO, customerName: string, customerPhone: string, salonName?: string) => void;
  onNavigateToBarberStation?: () => void;
  onNavigateToPassStatus?: () => void;
  onNavigateToSalons?: () => void;
}

export const ServiceBookingView: React.FC<ServiceBookingViewProps> = ({
  salonId = 'salon_1',
  hasActivePass,
  onBookingConfirmed,
  onNavigateToBarberStation,
  onNavigateToPassStatus,
  onNavigateToSalons,
}) => {
  // State
  const [salon, setSalon] = useState<SalonDetails | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [stylists, setStylists] = useState<StylistChair[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['srv_haircut_beard']); // Default to 800.00
  const [selectedChairId, setSelectedChairId] = useState<string>('ANY');
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);

  // Resolved hero image with robust fallback
  const heroImg =
    salon?.heroImageUrl ||
    (salonId === 'salon_2'
      ? royalBladeImg
      : salonId === 'salon_3'
      ? easternGlowImg
      : westernCuttersImg);

  // Slots Hook
  const { slots, isLoading: isSlotsLoading } = useAvailableSlots(selectedDate, selectedChairId === 'ANY' ? undefined : selectedChairId);

  // Auto-select first available upcoming slot when slots load or date changes
  useEffect(() => {
    if (slots && slots.length > 0) {
      const isCurrentSlotValid = slots.some((s) => s.time === selectedSlot && s.isAvailable && s.statusText !== 'Passed');
      if (!isCurrentSlotValid) {
        const firstAvailable = slots.find((s) => s.isAvailable && s.statusText !== 'Passed');
        if (firstAvailable) {
          setSelectedSlot(firstAvailable.time);
        } else {
          setSelectedSlot(null);
        }
      }
    } else {
      setSelectedSlot(null);
    }
  }, [slots, selectedDate]);

  // Load Initial Catalog
  useEffect(() => {
    const loadCatalog = async () => {
      const [salonData, srvData, stylistData] = await Promise.all([
        bookingApi.getSalonDetails(salonId),
        bookingApi.getServices(),
        bookingApi.getStylists(),
      ]);
      setSalon(salonData);
      setServices(srvData);
      setStylists(stylistData);
    };
    loadCatalog();
  }, [salonId]);

  // Toggle Services
  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Selected Services Summary Calculations
  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalDurationMinutes = selectedServices.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalPriceLkr = selectedServices.reduce((acc, curr) => acc + curr.priceLkr, 0);

  // Filter services by category
  const filteredServices = services.filter((s) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'haircut') return s.category === 'haircut';
    if (activeCategory === 'beard') return s.category === 'beard';
    if (activeCategory === 'packages') return s.category === 'package' || s.category === 'massage';
    return true;
  });

  // Booking Flow Trigger
  const handleProceedBooking = () => {
    if (selectedServiceIds.length === 0) {
      alert('Please select at least one grooming service.');
      return;
    }
    if (!selectedSlot) {
      alert('Please select an available upcoming 45-minute booking time slot.');
      return;
    }
    // Validate that selected slot is not in the past for today
    const todayStr = getLocalDateString();
    if (selectedDate === todayStr) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [h, m] = selectedSlot.split(':').map(Number);
      if (h * 60 + m <= currentMinutes) {
        alert('The selected time slot has already passed. Please select an upcoming time slot.');
        return;
      }
    }
    setShowCustomerModal(true);
  };

  const handleFinalBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Please enter your mobile phone number.');
      return;
    }

    setIsBooking(true);
    try {
      const pass = await bookingApi.createBooking({
        salonId: salon?.id || 'salon_1',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        serviceIds: selectedServiceIds,
        preferredChairId: selectedChairId === 'ANY' ? undefined : selectedChairId,
        date: selectedDate,
        timeSlot: selectedSlot || '',
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#00685F', '#008378', '#4648D4', '#E1E0FF'],
        });
      } catch {
        // Confetti fallback
      }

      setShowCustomerModal(false);
      onBookingConfirmed(pass, customerName.trim(), customerPhone.trim(), salon?.name);
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to reserve booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F8F9FF',
        paddingBottom: '120px', // Space for bottom sticky floating dock
      }}
      className="customer-booking-view"
    >
      {/* 1. Header (80px Backdrop blur, GlowSlot branding, Nav) */}
      <header
        style={{
          width: '100%',
          height: '80px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo & Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  backgroundColor: '#00685F',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0, 104, 95, 0.3)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <line x1="20" y1="4" x2="8.12" y2="15.88" />
                  <line x1="14.47" y1="14.48" x2="20" y2="20" />
                  <line x1="8.12" y1="8.12" x2="12" y2="12" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: '18px',
                    color: '#0D1C2F',
                    letterSpacing: '-0.4px',
                  }}
                >
                  Trimly <span style={{ color: '#00685F' }}>GlowSlot</span>
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    color: '#5C647A',
                    letterSpacing: '0.2px',
                  }}
                >
                  Akkaraipattu Pilot Hub
                </span>
              </div>
            </div>

            {/* Atmosphere Badge */}
            <div
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: '#EFF4FF',
                borderRadius: '9999px',
              }}
              className="desktop-only"
            >
              <span className="live-pulse-dot" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#00685F' }}>
                Eastern Province · 09:00 - 22:00 IST
              </span>
            </div>
          </div>

          {/* Customer Navigation Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onNavigateToSalons && (
              <button
                type="button"
                onClick={onNavigateToSalons}
                style={{
                  padding: '7px 12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D5E3FD',
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#0D1C2F',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>📍 Salons</span>
              </button>
            )}

            {(hasActivePass || onNavigateToPassStatus) && (
              <button
                type="button"
                onClick={onNavigateToPassStatus}
                style={{
                  padding: '7px 14px',
                  backgroundColor: hasActivePass ? '#00685F' : '#EFF4FF',
                  border: hasActivePass ? 'none' : '1px solid #DAE2FD',
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  color: hasActivePass ? '#FFFFFF' : '#00685F',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: hasActivePass ? '0 2px 8px rgba(0, 104, 95, 0.25)' : 'none',
                }}
              >
                <span>🎫 {hasActivePass ? 'Active Pass' : 'My Pass'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Section - Sticky Sub-Header Elevation Bar (65.5px) */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EFF4FF',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Salon Elevation Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                border: '1.5px solid #D5E3FD',
                flexShrink: 0,
              }}
            >
              <img
                src={heroImg}
                alt={salon?.name || 'Salon'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#0D1C2F',
                    letterSpacing: '-0.4px',
                  }}
                >
                  {salon?.name || 'Western Cutters'}
                </span>
                <span style={{ color: '#00685F', fontWeight: 600 }}>★ {salon?.rating || 4.9}</span>
                <Badge variant="soft" isMono>
                  {salon?.reviewsCount || 342} Reviews
                </Badge>
              </div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  color: '#3D4947',
                }}
              >
                {salon?.address || 'Main Street, Akkaraipattu'} · Eastern Province
              </span>
            </div>
          </div>

          {/* Salon Elevation Right (Live Availability metrics) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: '#EFF4FF',
                borderRadius: '9999px',
              }}
            >
              <span className="live-pulse-dot" />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#00685F',
                }}
              >
                {salon?.activeChairsCount || 2} Chairs Active Now
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                backgroundColor: '#E6EEFF',
                borderRadius: '9999px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#3D4947',
              }}
            >
              <span>Turnaround:</span>
              <strong style={{ color: '#00685F' }}>~{salon?.estWaitMinutes || 12}m Est. Wait</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Container (Max width 1280px) */}
      <main
        style={{
          maxWidth: '1280px',
          width: '100%',
          padding: '24px 24px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        {/* Salon Identity Spotlight & Live Atmospheric Panel */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            width: '100%',
          }}
        >
          {/* Media Hero Vignette */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              gridColumn: 'span 2',
            }}
          >
            <div style={{ position: 'relative', height: '220px', width: '100%' }}>
              <img
                src={heroImg}
                alt={salon?.name || 'Western Cutters'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(13, 28, 47, 0.2) 0%, rgba(13, 28, 47, 0.8) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <Badge variant="mint" isMono>
                  {salon?.id === 'salon_3' ? 'UNISEX LUXURY LOUNGE' : 'CLINICAL PRECISION LAB'}
                </Badge>
                <Badge variant="teal" isMono>
                  UV STERILIZED
                </Badge>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '20px',
                  right: '20px',
                  color: '#FFFFFF',
                }}
              >
                <h1
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '28px',
                    lineHeight: '34px',
                    margin: 0,
                    color: '#F4FFFC',
                  }}
                >
                  {salon?.name || 'Western Cutters'}
                </h1>
              </div>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '14px',
                  lineHeight: '22px',
                  color: '#3D4947',
                  margin: 0,
                }}
              >
                {salon?.tagline ||
                  'Clinical precision hair sculpting, hot-steam beard tailoring, and restorative herbal scalp treatments tuned for Eastern Province humidity.'}
              </p>

              {/* Atmospheric Metrics Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#EFF4FF',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: '18px',
                      color: '#00685F',
                    }}
                  >
                    {salon?.rating || 4.9} ★
                  </div>
                  <span style={{ fontSize: '11px', color: '#5C647A' }}>Quality Rating</span>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: '18px',
                      color: '#0D1C2F',
                    }}
                  >
                    {salon?.estWaitMinutes || 12} Mins
                  </div>
                  <span style={{ fontSize: '11px', color: '#5C647A' }}>Avg. Turnaround</span>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: '18px',
                      color: '#4648D4',
                    }}
                  >
                    {salon?.activeChairsCount || 2} Chairs
                  </div>
                  <span style={{ fontSize: '11px', color: '#5C647A' }}>Active Stylists</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Operations Diagnostic Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #EFF4FF',
                  paddingBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00685F" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="6" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0D1C2F' }}>
                    Salon Operations
                  </h3>
                </div>
                <Badge variant="mint" isMono>
                  LIVE TELEMETRY
                </Badge>
              </div>

              {/* Status details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#EFF4FF',
                    borderRadius: '10px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: '#0D1C2F', fontWeight: 600 }}>Queue Mode</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00685F', fontWeight: 600 }}>
                    Real-time OTP Guard
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#EFF4FF',
                    borderRadius: '10px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: '#0D1C2F', fontWeight: 600 }}>Opening Hours</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00685F', fontWeight: 500 }}>
                    09:00 - 22:00 IST
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#EFF4FF',
                    borderRadius: '10px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: '#0D1C2F', fontWeight: 600 }}>Buffer Protocol</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0D1C2F', fontWeight: 500 }}>
                    10m Sanitization
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#5C647A' }}>
              <span>Powered by Trimly Queue Engine</span>
              <span>Eastern Province Hub</span>
            </div>
          </div>
        </section>

        {/* 4. Section - Stylist & Chair Selector */}
        <StylistSelector
          stylists={stylists}
          selectedChairId={selectedChairId}
          onSelectChair={setSelectedChairId}
        />

        {/* 5. Multi-Service Selector Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          {/* Header & Category Filter Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '6px',
                  height: '20px',
                  backgroundColor: '#00685F',
                  borderRadius: '9999px',
                }}
              />
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '28px',
                  color: '#0D1C2F',
                  letterSpacing: '-0.2px',
                  margin: 0,
                }}
              >
                Service Menu
              </h2>
              <span style={{ fontSize: '12px', color: '#5C647A' }}>
                (Multi-select allowed)
              </span>
            </div>

            {/* Category Filter Buttons from Figma */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
              }}
            >
              {[
                { id: 'all', label: 'All Services' },
                { id: 'haircut', label: 'Haircuts' },
                { id: 'beard', label: 'Beard & Shave' },
                { id: 'packages', label: 'Packages & Spa' },
              ].map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: isActive ? '#00685F' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#0D1C2F',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.18s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Cards Grid (Matching Figma Cards 1 to 5) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '16px',
              width: '100%',
            }}
          >
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedServiceIds.includes(service.id)}
                onToggle={handleToggleService}
                spansFullWidth={service.category === 'package'}
              />
            ))}
          </div>
        </section>

        {/* 6. Slot Picker Section (Inline SlotGrid) */}
        <SlotGrid
          slots={slots}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          isLoading={isSlotsLoading}
        />

        {/* 7. Customer Contact Information Input */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '20px', backgroundColor: '#00685F', borderRadius: '9999px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0D1C2F' }}>
              Guest Details for Digital OTP Pass
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0D1C2F', marginBottom: '6px' }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Kasun Perera"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #D5E3FD',
                  backgroundColor: '#EFF4FF',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0D1C2F', marginBottom: '6px' }}>
                Phone Number (for SMS & OTP)
              </label>
              <input
                type="tel"
                placeholder="e.g. 077 123 4567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #D5E3FD',
                  backgroundColor: '#EFF4FF',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </section>

        {/* 8. Section - Hygiene & Hub Guarantees Notice */}
        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px',
            backgroundColor: '#EFF4FF',
            borderRadius: '16px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00685F',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0D1C2F', margin: 0 }}>
                100% Hygiene & Queue Precision Guarantee
              </h3>
              <p style={{ fontSize: '12px', color: '#3D4947', margin: '4px 0 0' }}>
                Sterilized clipper guards, fresh disposable neck strips, and guaranteed seat time within 10 minutes.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00685F', fontSize: '13px', fontWeight: 600 }}>
            <span>🔒 Verified Akkaraipattu Hub</span>
          </div>
        </section>

        {/* Customer Portal Footer */}
        <footer
          style={{
            width: '100%',
            maxWidth: '1280px',
            marginTop: '40px',
            padding: '24px 16px 40px',
            borderTop: '1px solid #E1E8F5',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            color: '#707A8A',
            fontSize: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <strong style={{ color: '#0D1C2F', fontSize: '13px' }}>Trimly GlowSlot</strong> · Akkaraipattu Pilot Network
              <p style={{ margin: '3px 0 0', color: '#8893A4', fontSize: '11px' }}>
                Zero-wait salon queue management, real-time OTP tracking & barber telemetry.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {onNavigateToSalons && (
                <button
                  type="button"
                  onClick={onNavigateToSalons}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00685F',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Salon Directory
                </button>
              )}

              {onNavigateToBarberStation && (
                <button
                  type="button"
                  onClick={onNavigateToBarberStation}
                  style={{
                    background: 'none',
                    border: '1px solid #D5E3FD',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    color: '#5C647A',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>🔒 Staff Portal</span>
                </button>
              )}
            </div>
          </div>
          <div
            style={{
              borderTop: '1px solid #EFF4FF',
              paddingTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              fontSize: '11px',
              color: '#8D98AA',
            }}
          >
            <span>© 2026 Trimly GlowSlot. All rights reserved.</span>
            <span>Eastern Province, Sri Lanka</span>
          </div>
        </footer>
      </main>

      {/* 9. Aside - Instant Sticky Summary & Flow Trigger Floating Dock */}
      <aside
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '76px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0px -4px 24px rgba(0, 0, 0, 0.08)',
          borderTop: '1px solid rgba(0, 104, 95, 0.1)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '12px 24px',
        }}
        className="glass-dock"
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Left Metrics Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '16px', color: '#0D1C2F' }}>
                  {selectedServices.length} {selectedServices.length === 1 ? 'Service' : 'Services'} Selected
                </span>
                <span style={{ color: '#3D4947' }}>·</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '14px', color: '#00685F' }}>
                  {totalDurationMinutes} Mins
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#5C647A' }}>
                <span>Selected Slot:</span>
                <strong style={{ color: '#0D1C2F' }}>{selectedSlot || 'Next available'} IST</strong>
                <span>({selectedChairId === 'ANY' ? 'Any Available' : selectedChairId === 'chair_rifas' ? 'Chair 1 Dhanu' : 'Chair 2 Thambi'})</span>
              </div>
            </div>

            {/* Total Price */}
            <div style={{ borderLeft: '1px solid #EFF4FF', paddingLeft: '20px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#5C647A', textTransform: 'uppercase' }}>
                Total Bill
              </span>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '22px', color: '#0D1C2F' }}>
                LKR {totalPriceLkr.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Button (Min 48px height, solid Teal with glow) */}
          <button
            type="button"
            onClick={handleProceedBooking}
            disabled={isBooking || selectedServiceIds.length === 0}
            style={{
              minHeight: '48px',
              padding: '12px 32px',
              backgroundColor: '#00685F',
              color: '#FFFFFF',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0px 4px 16px rgba(0, 104, 95, 0.28)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '16px',
              cursor: isBooking || selectedServiceIds.length === 0 ? 'not-allowed' : 'pointer',
              opacity: selectedServiceIds.length === 0 ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="btn-confirm-dock"
          >
            <span>{isBooking ? 'Securing Slot...' : 'Confirm Booking Pass'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Real Customer Information Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title="Confirm Your Appointment"
        subtitle="Enter your name and phone number — we'll send an OTP to confirm your slot."
        maxWidth="500px"
      >
        <form onSubmit={handleFinalBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Booking Summary Box */}
          <div
            style={{
              padding: '14px',
              backgroundColor: '#EFF4FF',
              borderRadius: '10px',
              border: '1px solid #D5E3FD',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0D1C2F' }}>
              <span><strong>Slot:</strong> {selectedDate} at {selectedSlot} IST (45m block)</span>
              <span style={{ color: '#00685F', fontWeight: 700 }}>
                {selectedChairId === 'ANY' ? 'Any Available' : selectedChairId === 'chair_rifas' ? 'Chair 1: Dhanu' : 'Chair 2: Thambi'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3D4947' }}>
              <span><strong>Services:</strong> {selectedServices.map((s) => s.name).join(', ')}</span>
              <strong style={{ color: '#00685F', fontSize: '13px' }}>LKR {totalPriceLkr.toLocaleString()}</strong>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0D1C2F', marginBottom: '6px' }}>
              Customer Full Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Farhan Mohamed"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #D5E3FD',
                backgroundColor: '#FFFFFF',
                fontSize: '14px',
                color: '#0D1C2F',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0D1C2F', marginBottom: '6px' }}>
              Mobile Phone Number <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#EFF4FF',
                  border: '1px solid #D5E3FD',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0D1C2F',
                }}
              >
                +94
              </div>
              <input
                type="tel"
                required
                placeholder="77 123 4567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #D5E3FD',
                  backgroundColor: '#FFFFFF',
                  fontSize: '14px',
                  color: '#0D1C2F',
                  outline: 'none',
                }}
              />
            </div>
            <span style={{ fontSize: '11px', color: '#5C647A', marginTop: '4px', display: 'block' }}>
              We'll send an OTP to this number to confirm your booking.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => setShowCustomerModal(false)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#EFF4FF',
                border: '1px solid #D5E3FD',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                color: '#3D4947',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBooking}
              style={{
                flex: 2,
                padding: '12px',
                backgroundColor: '#00685F',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                color: '#FFFFFF',
                cursor: isBooking ? 'not-allowed' : 'pointer',
                opacity: isBooking ? 0.7 : 1,
              }}
            >
              {isBooking ? 'Securing Slot...' : 'Book Now →'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
