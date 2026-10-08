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
import { useAvailableSlots } from '../../hooks/useAvailableSlots';

export interface ServiceBookingViewProps {
  hasActivePass?: boolean;
  onBookingConfirmed: (pass: AppointmentResponseDTO) => void;
  onNavigateToBarberStation?: () => void;
  onNavigateToPassStatus?: () => void;
  onNavigateToSalons?: () => void;
}

export const ServiceBookingView: React.FC<ServiceBookingViewProps> = ({
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
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['srv_1', 'srv_2']); // Default Cards 1 & 2 selected in Figma
  const [selectedChairId, setSelectedChairId] = useState<string>('ANY');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('15:15');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [showSlotPickerModal, setShowSlotPickerModal] = useState<boolean>(false);

  // Slots Hook
  const { slots, isLoading: isSlotsLoading } = useAvailableSlots(selectedDate, selectedChairId === 'ANY' ? undefined : selectedChairId);

  // Load Initial Catalog
  useEffect(() => {
    const loadCatalog = async () => {
      const [salonData, srvData, stylistData] = await Promise.all([
        bookingApi.getSalonDetails(),
        bookingApi.getServices(),
        bookingApi.getStylists(),
      ]);
      setSalon(salonData);
      setServices(srvData);
      setStylists(stylistData);
    };
    loadCatalog();
  }, []);

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
  const handleProceedBooking = async () => {
    if (selectedServiceIds.length === 0) {
      alert('Please select at least one grooming service.');
      return;
    }

    if (!showSlotPickerModal && !selectedSlot) {
      setShowSlotPickerModal(true);
      return;
    }

    setIsBooking(true);
    try {
      const pass = await bookingApi.createBooking({
        salonId: salon?.id || 'salon_1',
        customerName: customerName.trim() || 'Akkaraipattu Guest',
        customerPhone: customerPhone.trim() || '077 123 4567',
        serviceIds: selectedServiceIds,
        preferredChairId: selectedChairId === 'ANY' ? undefined : selectedChairId,
        date: selectedDate,
        timeSlot: selectedSlot || '15:15',
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

      onBookingConfirmed(pass);
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

          {/* Quick Actions (Switch to Barber Workstation / Live Pass) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onNavigateToPassStatus && (
              <button
                type="button"
                onClick={onNavigateToPassStatus}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#EFF4FF',
                  border: '1px solid #DAE2FD',
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#00685F',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🎫 My Booking Pass</span>
              </button>
            )}

            {onNavigateToBarberStation && (
              <button
                type="button"
                onClick={onNavigateToBarberStation}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#00685F',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(0, 104, 95, 0.25)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>Barber Workstation Board</span>
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
                width: '40px',
                height: '40px',
                backgroundColor: '#008378',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F4FFFC',
                boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
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
                  Classic Cuts
                </span>
                <span style={{ color: '#00685F' }}>★ 4.9</span>
                <Badge variant="soft" isMono>
                  342 Reviews
                </Badge>
              </div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  color: '#3D4947',
                }}
              >
                Main Street, Akkaraipattu · Eastern Province
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
                2 Chairs Active Now
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
              <strong style={{ color: '#00685F' }}>~12m Est. Wait</strong>
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
                src={salon?.heroImageUrl || '/src/assets/salon_hero.jpg'}
                alt="Classic Cuts Grooming Lab"
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
                  CLINICAL PRECISION LAB
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
                  Classic Cuts Grooming Lab
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
                    4.9 ★
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
                    12 Mins
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
                    2 Chairs
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
                <span>({selectedChairId === 'ANY' ? 'Any Available' : selectedChairId === 'chair_rifas' ? 'Chair 1 Rifas' : 'Chair 2 Kannan'})</span>
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
    </div>
  );
};
