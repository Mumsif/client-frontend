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
import { createPortal } from 'react-dom';
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
import { Icon } from '../../components/common/Icon';
import { useAuth } from '../../hooks/useAuth';
import { AuthView } from '../auth/AuthView';
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
  onNavigateToHome?: () => void;
  onNavigateToLogin?: () => void;
}

export const ServiceBookingView: React.FC<ServiceBookingViewProps> = ({
  salonId = 'salon_1',
  hasActivePass,
  onBookingConfirmed,
  onNavigateToPassStatus,
  onNavigateToSalons,
  onNavigateToHome,
  onNavigateToLogin,
}) => {
  const { customer, isCustomerAuthenticated, logoutCustomer } = useAuth();

  // State
  const [salon, setSalon] = useState<SalonDetails | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [stylists, setStylists] = useState<StylistChair[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['srv_haircut_beard']); // Default to 800.00
  const [selectedChairId, setSelectedChairId] = useState<string>('ANY');
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customerName, setCustomerName] = useState<string>(customer?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(customer?.phone || '');
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Lock background scroll when Auth Modal is open & center over current viewport
  useEffect(() => {
    if (!showAuthModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAuthModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAuthModal]);

  useEffect(() => {
    if (customer) {
      setCustomerName(customer.name);
      setCustomerPhone(customer.phone);
    }
  }, [customer]);

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

  // Core Booking Execution
  const executeBooking = async (nameToUse: string, phoneToUse: string) => {
    setIsBooking(true);
    try {
      const pass = await bookingApi.createBooking({
        salonId: salon?.id || 'salon_1',
        customerName: nameToUse.trim(),
        customerPhone: phoneToUse.trim(),
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
          colors: ['#D4AF37', '#C5A880', '#F8F6F0', '#B8976C'],
        });
      } catch {
        // Confetti fallback
      }

      setShowAuthModal(false);
      onBookingConfirmed(pass, nameToUse.trim(), phoneToUse.trim(), salon?.name);
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to reserve booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  // Booking Flow Trigger (Checks Auth first)
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

    // AUTH CHECK: If customer is not authenticated, show Authentication Page modal!
    if (!isCustomerAuthenticated || !customer) {
      setShowAuthModal(true);
      return;
    }

    // Customer is ALREADY authenticated -> let them book!
    executeBooking(customer.name, customer.phone);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#111113',
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
          backgroundColor: 'rgba(17, 17, 19, 0.95)',
          borderBottom: '1px solid #2E2C2A',
          boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.5)',
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
            <div
              className="trimly-logo-link"
              role="button"
              tabIndex={0}
              onClick={() => {
                if (onNavigateToHome) {
                  onNavigateToHome();
                } else {
                  window.location.hash = '#/';
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (onNavigateToHome) onNavigateToHome();
                  else window.location.hash = '#/';
                }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}
              title="Return to Trimly Home"
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  background: 'linear-gradient(135deg, #C5A880 0%, #D4AF37 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111113',
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.25)',
                  flexShrink: 0,
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
                    color: '#F8F6F0',
                    letterSpacing: '-0.4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Trimly
                </span>
                <span
                  className="trimly-header-tagline"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    color: '#8E8A85',
                    letterSpacing: '0.2px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Smart Salon Booking
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
                backgroundColor: '#1A1A1E',
                border: '1px solid #2E2C2A',
                borderRadius: '9999px',
              }}
              className="desktop-only"
            >
              <span className="live-pulse-dot" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#D4AF37' }}>
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
                  backgroundColor: '#1A1A1E',
                  border: '1px solid #2E2C2A',
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#D4AF37',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>Salons</span>
              </button>
            )}

            {(hasActivePass || onNavigateToPassStatus) && (
              <button
                type="button"
                onClick={onNavigateToPassStatus}
                style={{
                  padding: '7px 14px',
                  backgroundColor: hasActivePass ? '#D4AF37' : '#1A1A1E',
                  border: hasActivePass ? 'none' : '1px solid #2E2C2A',
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  color: hasActivePass ? '#111113' : '#D4AF37',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: hasActivePass ? '0 2px 10px rgba(212, 175, 55, 0.25)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{hasActivePass ? 'Active Pass' : 'My Pass'}</span>
              </button>
            )}

            {isCustomerAuthenticated && customer ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    padding: '6px 11px',
                    backgroundColor: '#26241F',
                    border: '1px solid #3E3A32',
                    borderRadius: '8px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    color: '#D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  title={customer.phone}
                >
                  <Icon name="user" size={13} color="#D4AF37" />
                  <span>{customer.name.split(' ')[0]}</span>
                </span>
                <button
                  type="button"
                  onClick={logoutCustomer}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8E8A85',
                    fontSize: '11px',
                    cursor: 'pointer',
                    padding: '4px',
                    fontWeight: 500,
                    transition: 'color 0.15s ease',
                  }}
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToLogin) onNavigateToLogin();
                  else setShowAuthModal(true);
                }}
                style={{
                  padding: '7px 12px',
                  backgroundColor: '#1A1A1E',
                  border: '1px solid #2E2C2A',
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#D4AF37',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon name="user" size={13} color="#D4AF37" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Section - Sticky Sub-Header Elevation Bar (65.5px) */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#161619',
          borderBottom: '1px solid #2E2C2A',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.4)',
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
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                border: '1.5px solid #2E2C2A',
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
                    color: '#F8F6F0',
                    letterSpacing: '-0.4px',
                  }}
                >
                  {salon?.name || 'Western Cutters'}
                </span>
                <span style={{ color: '#D4AF37', fontWeight: 600 }}>{salon?.rating || 4.9} / 5.0</span>
                <Badge variant="slate" isMono>
                  {salon?.reviewsCount || 342} Reviews
                </Badge>
              </div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  color: '#8E8A85',
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
                backgroundColor: '#26241F',
                border: '1px solid #3E3A32',
                borderRadius: '9999px',
              }}
            >
              <span className="live-pulse-dot" />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#D4AF37',
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
                backgroundColor: '#1A1A1E',
                border: '1px solid #2E2C2A',
                borderRadius: '9999px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#8E8A85',
              }}
            >
              <span>Turnaround:</span>
              <strong style={{ color: '#D4AF37' }}>{salon?.estWaitMinutes || 12}m Est. Wait</strong>
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
              backgroundColor: '#1A1A1E',
              border: '1px solid #2E2C2A',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4)',
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
                  background: 'linear-gradient(180deg, rgba(17, 17, 19, 0.3) 0%, rgba(17, 17, 19, 0.85) 100%)',
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
                <Badge variant="gold" isMono>
                  {salon?.id === 'salon_3' ? 'UNISEX LUXURY LOUNGE' : 'CLINICAL PRECISION LAB'}
                </Badge>
                <Badge variant="slate" isMono>
                  UV STERILIZED
                </Badge>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '20px',
                  right: '20px',
                  color: '#F8F6F0',
                }}
              >
                <h1
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '28px',
                    lineHeight: '34px',
                    margin: 0,
                    color: '#F8F6F0',
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
                  color: '#8E8A85',
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
                  backgroundColor: '#161619',
                  border: '1px solid #2E2C2A',
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
                      color: '#D4AF37',
                    }}
                  >
                    {salon?.rating || 4.9} / 5.0
                  </div>
                  <span style={{ fontSize: '11px', color: '#8E8A85' }}>Quality Rating</span>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: '18px',
                      color: '#F8F6F0',
                    }}
                  >
                    {salon?.estWaitMinutes || 12} Mins
                  </div>
                  <span style={{ fontSize: '11px', color: '#8E8A85' }}>Avg. Turnaround</span>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: '18px',
                      color: '#D4AF37',
                    }}
                  >
                    {salon?.activeChairsCount || 2} Chairs
                  </div>
                  <span style={{ fontSize: '11px', color: '#8E8A85' }}>Active Stylists</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Operations Diagnostic Card */}
          <div
            style={{
              backgroundColor: '#1A1A1E',
              border: '1px solid #2E2C2A',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4)',
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
                  borderBottom: '1px solid #2E2C2A',
                  paddingBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="6" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#F8F6F0' }}>
                    Salon Operations
                  </h3>
                </div>
                <Badge variant="slate" isMono>
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
                    backgroundColor: '#161619',
                    border: '1px solid #2E2C2A',
                    borderRadius: '10px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: '#F8F6F0', fontWeight: 600 }}>Queue Mode</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#D4AF37', fontWeight: 600 }}>
                    Live Queue Sync
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#161619',
                    border: '1px solid #2E2C2A',
                    borderRadius: '10px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: '#F8F6F0', fontWeight: 600 }}>Opening Hours</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#D4AF37', fontWeight: 500 }}>
                    09:00 - 22:00 IST
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#161619',
                    border: '1px solid #2E2C2A',
                    borderRadius: '10px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: '#F8F6F0', fontWeight: 600 }}>Buffer Protocol</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#8E8A85', fontWeight: 500 }}>
                    10m Sanitization
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8E8A85' }}>
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
                  backgroundColor: '#D4AF37',
                  borderRadius: '9999px',
                }}
              />
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '28px',
                  color: '#F8F6F0',
                  letterSpacing: '-0.2px',
                  margin: 0,
                }}
              >
                Service Menu
              </h2>
              <span style={{ fontSize: '12px', color: '#8E8A85' }}>
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
                      border: isActive ? '1px solid #D4AF37' : '1px solid #2E2C2A',
                      backgroundColor: isActive ? '#D4AF37' : '#1A1A1E',
                      color: isActive ? '#111113' : '#8E8A85',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0px 2px 10px rgba(212, 175, 55, 0.25)' : 'none',
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
            backgroundColor: '#1A1A1E',
            border: '1px solid #2E2C2A',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '20px', backgroundColor: '#D4AF37', borderRadius: '9999px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#F8F6F0' }}>
              Guest Details for Booking Pass
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F0', marginBottom: '6px' }}>
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
                  border: '1px solid #2E2C2A',
                  backgroundColor: '#141416',
                  color: '#F8F6F0',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#F8F6F0', marginBottom: '6px' }}>
                Mobile Phone Number (for SMS Pass)
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
                  border: '1px solid #2E2C2A',
                  backgroundColor: '#141416',
                  color: '#F8F6F0',
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
            backgroundColor: '#1A1A1E',
            border: '1px solid #2E2C2A',
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
                backgroundColor: '#26241F',
                border: '1px solid #3E3A32',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F8F6F0', margin: 0 }}>
                100% Hygiene & Queue Precision Guarantee
              </h3>
              <p style={{ fontSize: '12px', color: '#8E8A85', margin: '4px 0 0' }}>
                Sterilized clipper guards, fresh disposable neck strips, and guaranteed seat time within 10 minutes.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', fontSize: '13px', fontWeight: 600 }}>
            <span>Verified Salon</span>
          </div>
        </section>

        {/* Customer Portal Footer */}
        <footer
          style={{
            width: '100%',
            maxWidth: '1280px',
            marginTop: '40px',
            padding: '24px 16px 40px',
            borderTop: '1px solid #2E2C2A',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            color: '#8E8A85',
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
              <strong style={{ color: '#F8F6F0', fontSize: '13px' }}>Trimly</strong> · Smart Salon Network
              <p style={{ margin: '3px 0 0', color: '#8E8A85', fontSize: '11px' }}>
                Zero-wait salon queue management, real-time chair tracking & digital pass verification.
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
                    color: '#D4AF37',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Salon Directory
                </button>
              )}
            </div>
          </div>
          <div
            style={{
              borderTop: '1px solid #2E2C2A',
              paddingTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              fontSize: '11px',
              color: '#8E8A85',
            }}
          >
            <span>© 2026 Trimly. All rights reserved.</span>
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
          backgroundColor: 'rgba(22, 22, 25, 0.96)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.6)',
          borderTop: '1px solid #2E2C2A',
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
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '16px', color: '#F8F6F0' }}>
                  {selectedServices.length} {selectedServices.length === 1 ? 'Service' : 'Services'} Selected
                </span>
                <span style={{ color: '#8E8A85' }}>·</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '14px', color: '#D4AF37' }}>
                  {totalDurationMinutes} Mins
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8E8A85' }}>
                <span>Selected Slot:</span>
                <strong style={{ color: '#F8F6F0' }}>{selectedSlot || 'Next available'} IST</strong>
                <span>({selectedChairId === 'ANY' ? 'Any Available' : selectedChairId === 'chair_rifas' ? 'Chair 1 Dhanu' : 'Chair 2 Thambi'})</span>
              </div>
            </div>

            {/* Total Price */}
            <div style={{ borderLeft: '1px solid #2E2C2A', paddingLeft: '20px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8E8A85', textTransform: 'uppercase' }}>
                Total Bill
              </span>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '22px', color: '#D4AF37' }}>
                LKR {totalPriceLkr.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Button (Min 48px height, Champagne Gold with dark text) */}
          <button
            type="button"
            onClick={handleProceedBooking}
            disabled={isBooking || selectedServiceIds.length === 0}
            style={{
              minHeight: '48px',
              padding: '12px 32px',
              backgroundColor: '#D4AF37',
              color: '#111113',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0px 4px 18px rgba(212, 175, 55, 0.3)',
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
            onMouseEnter={(e) => {
              if (!isBooking && selectedServiceIds.length > 0) {
                e.currentTarget.style.backgroundColor = '#B8976C';
              }
            }}
            onMouseLeave={(e) => {
              if (!isBooking && selectedServiceIds.length > 0) {
                e.currentTarget.style.backgroundColor = '#D4AF37';
              }
            }}
          >
            <span>{isBooking ? 'Securing Slot...' : 'Confirm Booking Pass'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Authentication Modal / Overlay for Booking Confirmation & Sign In (Portaled directly to Body) */}
      {showAuthModal &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.82)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              boxSizing: 'border-box',
              overflowY: 'auto',
              animation: 'fadeIn 0.2s ease-out',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAuthModal(false);
              }
            }}
          >
            <div
              style={{
                maxWidth: '440px',
                width: '100%',
                maxHeight: 'calc(100vh - 32px)',
                overflowY: 'auto',
                borderRadius: '20px',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.65)',
                animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <AuthView
                initialMode="login"
                bookingContext={{
                  salonName: salon?.name || 'Selected Salon',
                  timeSlot: selectedSlot || undefined,
                  date: selectedDate,
                  totalPrice: totalPriceLkr,
                  chairLabel:
                    selectedChairId === 'ANY'
                      ? 'Any Available Stylist'
                      : selectedChairId === 'chair_rifas'
                      ? 'Chair 1: Master Dhanu'
                      : 'Chair 2: Senior Thambi',
                  servicesLabel: selectedServices.map((s) => s.name).join(', '),
                }}
                onSuccess={(role) => {
                  if (role === 'staff') {
                    window.location.hash = '#/barber';
                  } else {
                    try {
                      const saved = localStorage.getItem('trimly_customer_user');
                      const loggedInCustomer = saved ? JSON.parse(saved) : null;
                      if (loggedInCustomer) {
                        setShowAuthModal(false);
                        executeBooking(loggedInCustomer.name, loggedInCustomer.phone);
                        return;
                      }
                    } catch {
                      // Fallback
                    }
                    setShowAuthModal(false);
                    if (customer) {
                      executeBooking(customer.name, customer.phone);
                    }
                  }
                }}
                onBack={() => setShowAuthModal(false)}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

