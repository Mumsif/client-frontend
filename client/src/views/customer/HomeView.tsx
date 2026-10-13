/**
 * ============================================================================
 * TRIMLY - PREMIUM HOMEPAGE
 * ============================================================================
 * Clean, professional salon booking homepage with:
 * 1. Background video hero showing salon craftsmanship
 * 2. Three salon cards with location details
 * 3. How-it-works flow section
 * 4. Trust/feature highlights
 * ============================================================================
 */

import React, { useState, useRef } from 'react';
import { Icon } from '../../components/common/Icon';
import westernCuttersImg from '../../assets/salon_hero.jpg';
import royalBladeImg from '../../assets/royal_blade.jpg';
import easternGlowImg from '../../assets/eastern_glow.webp';
import barberRifasImg from '../../assets/barber_rifas.jpg';
import barberKannanImg from '../../assets/barber_kannan.jpg';
import { useAuth } from '../../hooks/useAuth';

export interface HomeViewProps {
  onSelectSalon: (salonId: string) => void;
  onNavigateToBooking: () => void;
  onNavigateToSalons: () => void;
  onNavigateToPass: () => void;
  onNavigateToBarber?: () => void;
  onNavigateToLogin?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectSalon,
  onNavigateToBooking,
  onNavigateToSalons,
  onNavigateToPass,
  onNavigateToBarber: _onNavigateToBarber,
  onNavigateToLogin,
}) => {
  const { customer, isCustomerAuthenticated, logoutCustomer } = useAuth();
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [filterGender, setFilterGender] = useState<'all' | 'men' | 'unisex'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const salonsSectionRef = useRef<HTMLDivElement>(null);

  const navigateToHome = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash !== '#/' && window.location.hash !== '') {
      window.location.hash = '#/';
    }
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const scrollToSalons = () => {
    if (salonsSectionRef.current) {
      salonsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigateToSalons();
    }
  };

  const salons = [
    {
      id: 'salon_1',
      name: 'Western Cutters',
      tagline: 'Precision hair sculpting, hot-steam beard tailoring & herbal scalp treatments',
      address: 'Main Street, Akkaraipattu',
      phone: '+94 67 227 8901',
      rating: 4.9,
      reviewsCount: 342,
      estWaitMinutes: 10,
      activeChairs: 2,
      totalChairs: 2,
      type: 'men',
      popularService: 'Normal Haircut with Beard Cut (LKR 800)',
      barbers: [
        { name: 'Dhanu', role: 'Chair 1 · Master Barber', img: barberRifasImg },
        { name: 'Thambi', role: 'Chair 2 · Senior Stylist', img: barberKannanImg },
      ],
      isFeatured: true,
      image: westernCuttersImg,
      hours: '09:00 AM - 09:00 PM',
    },
    {
      id: 'salon_2',
      name: 'Royal Blades Barbershop',
      tagline: 'Modern razor fades, beard sculpting, hot towel service & cooling mint head washes',
      address: 'Clock Tower Junction, Akkaraipattu',
      phone: '+94 67 227 7540',
      rating: 4.7,
      reviewsCount: 189,
      estWaitMinutes: 20,
      activeChairs: 3,
      totalChairs: 3,
      type: 'men',
      popularService: 'Signature Skin Fade & Hot Towel (LKR 650)',
      barbers: [
        { name: 'Sameer', role: 'Chair 1 · Fade Specialist' },
        { name: 'Farhan', role: 'Chair 2 · Beard Sculptor' },
      ],
      isFeatured: false,
      image: royalBladeImg,
      hours: '09:00 AM - 09:30 PM',
    },
    {
      id: 'salon_3',
      name: 'Eastern Glow Unisex Lounge',
      tagline: 'Premium styling, facial treatments, hair restructuring & family grooming lounge',
      address: 'Hospital Road, Akkaraipattu',
      phone: '+94 67 227 9120',
      rating: 4.8,
      reviewsCount: 220,
      estWaitMinutes: 15,
      activeChairs: 4,
      totalChairs: 4,
      type: 'unisex',
      popularService: 'Keratin Nourish & Cut Package (LKR 1,400)',
      barbers: [
        { name: 'Aadhil', role: 'Station 1 · Colorist' },
        { name: 'Fathima', role: 'Station 2 · Hair Therapist' },
      ],
      isFeatured: false,
      image: easternGlowImg,
      hours: '09:30 AM - 08:30 PM',
    },
  ];

  const filteredSalons = salons.filter((s) => {
    if (filterGender === 'all') return true;
    return s.type === filterGender;
  });

  const flowSteps = [
    {
      step: 1,
      title: 'Browse Salons',
      desc: 'View verified salons near you with live chair availability and real-time wait estimates.',
      iconName: 'search',
    },
    {
      step: 2,
      title: 'Choose Your Salon',
      desc: 'Pick from top-rated barbershops or unisex lounges. Compare stylists, services, and pricing.',
      iconName: 'layout',
    },
    {
      step: 3,
      title: 'Book & Get Your Pass',
      desc: 'Select your preferred time slot and services. Receive a secure digital booking pass instantly.',
      iconName: 'ticket',
    },
    {
      step: 4,
      title: 'Walk In & Get Seated',
      desc: 'Show your pass at the salon. Your barber verifies your booking and begins the service timer.',
      iconName: 'clock',
    },
    {
      step: 5,
      title: 'Pay & Go',
      desc: 'Once your haircut is complete, settle via Cash, QR, or Card. Quick, transparent, and hassle-free.',
      iconName: 'credit-card',
    },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#111113', color: '#F8F6F0' }}>
      {/* ───────── Navigation Bar ───────── */}
      <header
        className="trimly-header-padding"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(17, 17, 19, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #2E2C2A',
          height: '68px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Logo (Clicking navigates to Home page) */}
          <div
            className="trimly-logo-link"
            role="button"
            tabIndex={0}
            onClick={navigateToHome}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigateToHome();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
            }}
            title="Trimly Home"
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #C5A880 0%, #D4AF37 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.3)',
                flexShrink: 0,
              }}
            >
              <Icon name="scissors" size={18} color="#111113" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '19px',
                  color: '#F8F6F0',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                Trimly
              </span>
              <span
                className="trimly-header-tagline"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: '#8E8A85',
                  whiteSpace: 'nowrap',
                }}
              >
                Smart Salon Booking
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="desktop-nav" style={{ alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={scrollToSalons}
              style={{
                backgroundColor: 'transparent',
                color: '#8E8A85',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#F8F6F0';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8E8A85';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon name="map-pin" size={14} color="currentColor" />
              Salons
            </button>

            <button
              type="button"
              onClick={onNavigateToBooking}
              style={{
                backgroundColor: 'transparent',
                color: '#8E8A85',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#F8F6F0';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8E8A85';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon name="calendar" size={14} color="currentColor" />
              Services
            </button>

            <button
              type="button"
              onClick={onNavigateToPass}
              style={{
                backgroundColor: '#1A1A1E',
                color: '#D4AF37',
                border: '1px solid #2E2C2A',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                padding: '8px 14px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D4AF37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2E2C2A';
              }}
            >
              <Icon name="ticket" size={14} color="#D4AF37" />
              My Booking
            </button>

            {isCustomerAuthenticated && customer ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    padding: '7px 12px',
                    backgroundColor: '#26241F',
                    border: '1px solid #3E3A32',
                    borderRadius: '8px',
                    color: '#D4AF37',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  title={customer.phone}
                >
                  <Icon name="user" size={14} color="#D4AF37" />
                  <span>{customer.name.split(' ')[0]}</span>
                </span>
                <button
                  type="button"
                  onClick={logoutCustomer}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8E8A85',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    padding: '4px',
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
                  else window.location.hash = '#/login';
                }}
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#111113',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B8976C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4AF37';
                }}
              >
                <Icon name="user" size={14} color="#111113" />
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Right Quick Action & Hamburger Button */}
          <div className="mobile-menu-btn" style={{ alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigateToPass();
              }}
              style={{
                backgroundColor: '#1A1A1E',
                color: '#D4AF37',
                border: '1px solid #2E2C2A',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="ticket" size={13} color="#D4AF37" />
              <span>Pass</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: isMobileMenuOpen ? '#26241F' : '#1A1A1E',
                border: '1px solid #2E2C2A',
                borderRadius: '8px',
                color: '#F8F6F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Icon name={isMobileMenuOpen ? 'x' : 'menu'} size={18} color="#F8F6F0" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '68px',
              left: 0,
              right: 0,
              backgroundColor: 'rgba(26, 26, 30, 0.98)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid #2E2C2A',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.8)',
              padding: '16px 18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              zIndex: 100,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                scrollToSalons();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: '#161619',
                border: '1px solid #2E2C2A',
                borderRadius: '10px',
                color: '#F8F6F0',
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#26241F',
                  border: '1px solid #3E3A32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                  flexShrink: 0,
                }}
              >
                <Icon name="map-pin" size={16} />
              </div>
              <div>
                <div style={{ color: '#F8F6F0', fontWeight: 600 }}>Explore Salons</div>
                <div style={{ fontSize: '11px', color: '#8E8A85' }}>3 verified locations & real-time queues</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigateToBooking();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: '#161619',
                border: '1px solid #2E2C2A',
                borderRadius: '10px',
                color: '#F8F6F0',
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#26241F',
                  border: '1px solid #3E3A32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                  flexShrink: 0,
                }}
              >
                <Icon name="calendar" size={16} />
              </div>
              <div>
                <div style={{ color: '#F8F6F0', fontWeight: 600 }}>Services & Booking</div>
                <div style={{ fontSize: '11px', color: '#8E8A85' }}>Select stylist, chair and grooming package</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigateToPass();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: '#161619',
                border: '1px solid #2E2C2A',
                borderRadius: '10px',
                color: '#F8F6F0',
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#26241F',
                  border: '1px solid #3E3A32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                  flexShrink: 0,
                }}
              >
                <Icon name="ticket" size={16} />
              </div>
              <div>
                <div style={{ color: '#F8F6F0', fontWeight: 600 }}>My Booking Pass</div>
                <div style={{ fontSize: '11px', color: '#8E8A85' }}>Live queue tracker & verified pass status</div>
              </div>
            </button>

            {isCustomerAuthenticated && customer ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  backgroundColor: '#22201C',
                  border: '1px solid #3E3A32',
                  borderRadius: '10px',
                  width: '100%',
                  marginTop: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#26241F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#D4AF37',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="user" size={16} />
                  </div>
                  <div>
                    <div style={{ color: '#F8F6F0', fontWeight: 600, fontSize: '13px' }}>{customer.name}</div>
                    <div style={{ fontSize: '11px', color: '#8E8A85' }}>{customer.phone}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logoutCustomer();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#E05252',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateToLogin) onNavigateToLogin();
                  else window.location.hash = '#/login';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#D4AF37',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#111113',
                  fontSize: '14px',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '4px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(17, 17, 19, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111113',
                    flexShrink: 0,
                  }}
                >
                  <Icon name="user" size={16} />
                </div>
                <div>
                  <div style={{ color: '#111113', fontWeight: 700 }}>Sign In / Register</div>
                  <div style={{ fontSize: '11px', color: '#2E2C2A' }}>Customer booking & staff login access</div>
                </div>
              </button>
            )}
          </div>
        )}
      </header>

      {/* ───────── Hero Section with Background Video ───────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#111113',
        }}
      >
        {/* Background Video */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster={westernCuttersImg}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.45) contrast(1.15) saturate(0.9)',
              transform: 'scale(1.02)',
            }}
          >
            <source src="/videos/salon_haircut_bg.mp4" type="video/mp4" />
            Your browser does not support HTML5 background video.
          </video>

          {/* Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(17, 17, 19, 0.6) 0%, rgba(17, 17, 19, 0.78) 55%, #111113 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Video Controls */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(26, 26, 30, 0.85)',
            padding: '4px 8px',
            borderRadius: '9999px',
            backdropFilter: 'blur(8px)',
            border: '1px solid #2E2C2A',
          }}
        >
          <button
            type="button"
            onClick={handleTogglePlay}
            style={{
              background: 'none',
              border: 'none',
              color: '#D4AF37',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
            }}
            title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
          >
            <Icon name={isVideoPlaying ? 'pause' : 'play'} size={14} color="#D4AF37" />
          </button>
          <div style={{ width: '1px', height: '14px', backgroundColor: '#2E2C2A' }} />
          <button
            type="button"
            onClick={handleToggleMute}
            style={{
              background: 'none',
              border: 'none',
              color: '#D4AF37',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
            }}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            <Icon name={isMuted ? 'volume-off' : 'volume-on'} size={14} color="#D4AF37" />
          </button>
        </div>

        {/* Hero Content */}
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            padding: '80px 24px',
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Subtitle Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#26241F',
              border: '1px solid #3E3A32',
              padding: '6px 16px',
              borderRadius: '9999px',
              backdropFilter: 'blur(8px)',
              marginBottom: '24px',
            }}
          >
            <span className="live-pulse-dot" />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                color: '#D4AF37',
                letterSpacing: '0.4px',
              }}
            >
              3 Salons Available Now
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 58px)',
              lineHeight: 1.15,
              color: '#F8F6F0',
              margin: '0 0 20px',
              maxWidth: '820px',
              letterSpacing: '-1.5px',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
            }}
          >
            Skip the Queue.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #F8F6F0 0%, #D4AF37 50%, #C5A880 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Book Your Haircut
            </span>{' '}
            in Seconds.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              lineHeight: 1.65,
              color: '#8E8A85',
              maxWidth: '640px',
              margin: '0 0 36px',
              fontWeight: 400,
            }}
          >
            Find your favourite salon, pick a time slot, and walk straight into the chair.
            No more waiting on benches.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '48px',
            }}
          >
            <button
              type="button"
              onClick={scrollToSalons}
              style={{
                padding: '15px 28px',
                backgroundColor: '#D4AF37',
                color: '#111113',
                borderRadius: '12px',
                border: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#B8976C';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#D4AF37';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Explore Salons
              <Icon name="arrow-down" size={16} color="#111113" />
            </button>

            <button
              type="button"
              onClick={onNavigateToBooking}
              style={{
                padding: '15px 24px',
                backgroundColor: '#1A1A1E',
                color: '#D4AF37',
                borderRadius: '12px',
                border: '1px solid #2E2C2A',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#26241F';
                e.currentTarget.style.borderColor = '#3E3A32';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1A1A1E';
                e.currentTarget.style.borderColor = '#2E2C2A';
              }}
            >
              Book a Slot
              <Icon name="arrow-right" size={16} color="#D4AF37" />
            </button>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, auto)',
              gap: '32px',
              backgroundColor: 'rgba(26, 26, 30, 0.85)',
              padding: '18px 36px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid #2E2C2A',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: 800, color: '#D4AF37' }}>
                3
              </div>
              <span style={{ fontSize: '12px', color: '#8E8A85' }}>Salons</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: 800, color: '#F8F6F0' }}>
                12 min
              </div>
              <span style={{ fontSize: '12px', color: '#8E8A85' }}>Avg. Wait</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: 800, color: '#D4AF37' }}>
                4.8
              </div>
              <span style={{ fontSize: '12px', color: '#8E8A85' }}>Avg. Rating</span>
            </div>
          </div>
        </div>
      </section>
      {/* ───────── How It Works ───────── */}
      <section
        style={{
          width: '100%',
          padding: '80px 24px',
          backgroundColor: '#161619',
          borderBottom: '1px solid #2E2C2A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '1100px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 700,
                color: '#D4AF37',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              HOW IT WORKS
            </span>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: '32px',
                color: '#F8F6F0',
                margin: '8px 0 12px',
                letterSpacing: '-0.5px',
              }}
            >
              Book in 5 Simple Steps
            </h2>
            <p style={{ color: '#8E8A85', fontSize: '15px', maxWidth: '560px', margin: '0 auto' }}>
              From finding a salon to paying for your cut — all digital, all seamless.
            </p>
          </div>

          {/* 5 Steps Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '20px',
            }}
          >
            {flowSteps.map((s) => (
              <div
                key={s.step}
                style={{
                  backgroundColor: '#1A1A1E',
                  border: '1.5px solid #2E2C2A',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.backgroundColor = '#202025';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2E2C2A';
                  e.currentTarget.style.backgroundColor = '#1A1A1E';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: '#26241F',
                      border: '1px solid #3E3A32',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={s.iconName} size={20} color="#D4AF37" />
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#8E8A85',
                    }}
                  >
                    {String(s.step).padStart(2, '0')}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#F8F6F0',
                    margin: 0,
                  }}
                >
                  {s.title}
                </h3>

                <p style={{ fontSize: '13px', color: '#8E8A85', lineHeight: 1.55, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Salons Directory ───────── */}
      <section
        ref={salonsSectionRef}
        id="salons-section"
        style={{
          width: '100%',
          padding: '80px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#111113',
        }}
      >
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '36px',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ width: '4px', height: '22px', backgroundColor: '#D4AF37', borderRadius: '2px' }} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#D4AF37',
                    letterSpacing: '0.6px',
                    textTransform: 'uppercase',
                  }}
                >
                  SALON DIRECTORY
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '30px',
                  color: '#F8F6F0',
                  margin: 0,
                  letterSpacing: '-0.5px',
                }}
              >
                Available Salons
              </h2>
              <p style={{ margin: '6px 0 0', color: '#8E8A85', fontSize: '14px' }}>
                Browse real-time availability, stylists, and pricing.
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#1A1A1E', border: '1px solid #2E2C2A', padding: '4px', borderRadius: '10px' }}>
              {[
                { id: 'all' as const, label: 'All' },
                { id: 'men' as const, label: "Men's" },
                { id: 'unisex' as const, label: 'Unisex' },
              ].map((tab) => {
                const isSelected = filterGender === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterGender(tab.id)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isSelected ? '#D4AF37' : 'transparent',
                      color: isSelected ? '#111113' : '#8E8A85',
                      fontWeight: isSelected ? 700 : 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Salon Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredSalons.map((salon) => (
              <div
                key={salon.id}
                style={{
                  backgroundColor: '#1A1A1E',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: salon.isFeatured ? '0 0 0 1px #D4AF37, 0 8px 30px rgba(212, 175, 55, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.5)',
                  border: salon.isFeatured ? '1px solid #D4AF37' : '1px solid #2E2C2A',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = salon.isFeatured ? '0 0 0 1px #D4AF37, 0 12px 36px rgba(212, 175, 55, 0.25)' : '0 8px 30px rgba(0, 0, 0, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = salon.isFeatured ? '0 0 0 1px #D4AF37, 0 8px 30px rgba(212, 175, 55, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.5)';
                }}
              >
                {/* Salon Image */}
                <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={salon.image}
                    alt={salon.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(17, 17, 19, 0.05) 0%, rgba(17, 17, 19, 0.85) 100%)',
                    }}
                  />

                  {/* Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      right: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: '#26241F',
                        border: '1px solid #3E3A32',
                        color: '#D4AF37',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        letterSpacing: '0.3px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {salon.type === 'men' ? "Men's" : 'Unisex'}
                    </span>

                    {salon.isFeatured && (
                      <span
                        style={{
                          backgroundColor: '#D4AF37',
                          color: '#111113',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Icon name="star" size={12} color="#111113" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Bottom Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '16px',
                      right: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      color: '#F8F6F0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="star" size={14} color="#D4AF37" />
                      <strong style={{ fontSize: '15px' }}>{salon.rating}</strong>
                      <span style={{ fontSize: '12px', opacity: 0.85, color: '#8E8A85' }}>({salon.reviewsCount})</span>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(26, 26, 30, 0.9)',
                        border: '1px solid #2E2C2A',
                        backdropFilter: 'blur(4px)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#D4AF37',
                        fontFamily: "'JetBrains Mono', monospace",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Icon name="clock" size={11} color="#D4AF37" />
                      {salon.estWaitMinutes}m wait
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: '20px',
                        color: '#F8F6F0',
                        margin: '0 0 6px',
                      }}
                    >
                      {salon.name}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        color: '#8E8A85',
                        marginBottom: '10px',
                      }}
                    >
                      <Icon name="map-pin" size={13} color="#8E8A85" />
                      <span>{salon.address}</span>
                      <span style={{ color: '#2E2C2A' }}>·</span>
                      <span style={{ color: '#D4AF37', fontWeight: 600 }}>{salon.hours}</span>
                    </div>

                    <p
                      style={{
                        fontSize: '13px',
                        lineHeight: 1.55,
                        color: '#8E8A85',
                        margin: '0 0 14px',
                      }}
                    >
                      {salon.tagline}
                    </p>

                    {/* Details */}
                    <div
                      style={{
                        backgroundColor: '#161619',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        border: '1px solid #2E2C2A',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '7px',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8E8A85' }}>Active Chairs:</span>
                        <strong style={{ color: '#F8F6F0' }}>{salon.activeChairs} of {salon.totalChairs}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8E8A85' }}>Popular Service:</span>
                        <span style={{ color: '#D4AF37', fontWeight: 600 }}>{salon.popularService}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8E8A85' }}>Phone:</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#F8F6F0', fontSize: '11px' }}>{salon.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', paddingTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => onSelectSalon(salon.id)}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        backgroundColor: '#D4AF37',
                        color: '#111113',
                        border: 'none',
                        borderRadius: '10px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(212, 175, 55, 0.25)',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#B8976C';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#D4AF37';
                      }}
                    >
                      Book Now
                      <Icon name="arrow-right" size={14} color="#111113" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectSalon(salon.id);
                        onNavigateToBooking();
                      }}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#1A1A1E',
                        color: '#D4AF37',
                        border: '1px solid #2E2C2A',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#26241F';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1A1A1E';
                      }}
                    >
                      Menu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Trust Highlights ───────── */}
      <section
        style={{
          width: '100%',
          padding: '64px 24px',
          backgroundColor: '#161619',
          borderTop: '1px solid #2E2C2A',
          borderBottom: '1px solid #2E2C2A',
          color: '#F8F6F0',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
          }}
        >
          <div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#26241F',
                border: '1px solid #3E3A32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <Icon name="clock" size={22} color="#D4AF37" />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#F8F6F0' }}>
              Zero-Wait Guarantee
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#8E8A85', lineHeight: 1.65 }}>
              No more sitting on bench queues for 45 minutes. Your slot is digitally reserved and locked with your booking pass.
            </p>
          </div>

          <div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#26241F',
                border: '1px solid #3E3A32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <Icon name="shield" size={22} color="#D4AF37" />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#F8F6F0' }}>
              Secure Booking System
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#8E8A85', lineHeight: 1.65 }}>
              Your seat cannot be taken by walk-ins. The barber verifies your booking pass before starting the service.
            </p>
          </div>

          <div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#26241F',
                border: '1px solid #3E3A32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <Icon name="credit-card" size={22} color="#D4AF37" />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#F8F6F0' }}>
              Transparent Pricing
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#8E8A85', lineHeight: 1.65 }}>
              Standardized pricing: Normal Haircut at LKR 400, Haircut with Beard Cut at LKR 800. No hidden charges.
            </p>
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer
        style={{
          width: '100%',
          backgroundColor: '#111113',
          borderTop: '1px solid #2E2C2A',
          padding: '40px 24px 30px',
          color: '#8E8A85',
          fontSize: '13px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <div>
            <div
              className="trimly-logo-link"
              onClick={navigateToHome}
              title="Trimly Home"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Icon name="scissors" size={16} color="#D4AF37" />
              <strong style={{ color: '#F8F6F0', fontSize: '15px' }}>Trimly</strong>
            </div>
            <p style={{ margin: '4px 0 0', color: '#8E8A85', fontSize: '12px' }}>
              Smart Salon Booking System
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={scrollToSalons}
              style={{ background: 'none', border: 'none', color: '#8E8A85', cursor: 'pointer', fontSize: '13px', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#8E8A85'; }}
            >
              Salons
            </button>
            <button
              type="button"
              onClick={onNavigateToBooking}
              style={{ background: 'none', border: 'none', color: '#8E8A85', cursor: 'pointer', fontSize: '13px', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#8E8A85'; }}
            >
              Services
            </button>
            <button
              type="button"
              onClick={onNavigateToPass}
              style={{ background: 'none', border: 'none', color: '#8E8A85', cursor: 'pointer', fontSize: '13px', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#8E8A85'; }}
            >
              My Booking
            </button>
            <button
              type="button"
              onClick={() => {
                if (onNavigateToLogin) onNavigateToLogin();
                else window.location.hash = '#/login';
              }}
              style={{ background: 'none', border: 'none', color: '#8E8A85', cursor: 'pointer', fontSize: '13px', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#8E8A85'; }}
            >
              Sign In
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #2E2C2A', width: '100%', maxWidth: '1100px', paddingTop: '18px', textAlign: 'center', color: '#8E8A85' }}>
          <span>© {new Date().getFullYear()} Trimly. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};
