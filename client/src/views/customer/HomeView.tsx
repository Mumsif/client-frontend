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

export interface HomeViewProps {
  onSelectSalon: (salonId: string) => void;
  onNavigateToBooking: () => void;
  onNavigateToSalons: () => void;
  onNavigateToPass: () => void;
  onNavigateToBarber: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectSalon,
  onNavigateToBooking,
  onNavigateToSalons,
  onNavigateToPass,
  onNavigateToBarber,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [filterGender, setFilterGender] = useState<'all' | 'men' | 'unisex'>('all');

  const videoRef = useRef<HTMLVideoElement>(null);
  const salonsSectionRef = useRef<HTMLDivElement>(null);

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
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8F9FF', color: '#0D1C2F' }}>
      {/* ───────── Navigation Bar ───────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(13, 28, 47, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0 24px',
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
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00685F 0%, #008378 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0, 104, 95, 0.4)',
              }}
            >
              <Icon name="scissors" size={18} color="#FFFFFF" />
            </div>
            <div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '19px',
                  color: '#FFFFFF',
                  letterSpacing: '-0.3px',
                }}
              >
                Trimly
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: '#94A3B8',
                }}
              >
                Smart Salon Booking
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={scrollToSalons}
              style={{
                backgroundColor: 'transparent',
                color: '#CBD5E1',
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
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#CBD5E1';
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
                color: '#CBD5E1',
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
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#CBD5E1';
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
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                padding: '8px 14px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icon name="ticket" size={14} color="#FFFFFF" />
              My Booking
            </button>

            <button
              type="button"
              onClick={onNavigateToBarber}
              style={{
                backgroundColor: '#00685F',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 104, 95, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icon name="briefcase" size={14} color="#FFFFFF" />
              For Barbers
            </button>
          </nav>
        </div>
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
          backgroundColor: '#0D1C2F',
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
              filter: 'brightness(0.55) contrast(1.1) saturate(1.1)',
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
                'linear-gradient(180deg, rgba(13, 28, 47, 0.55) 0%, rgba(13, 28, 47, 0.75) 55%, rgba(13, 28, 47, 0.97) 100%)',
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
            backgroundColor: 'rgba(13, 28, 47, 0.75)',
            padding: '4px 8px',
            borderRadius: '9999px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <button
            type="button"
            onClick={handleTogglePlay}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
            }}
            title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
          >
            <Icon name={isVideoPlaying ? 'pause' : 'play'} size={14} color="#FFFFFF" />
          </button>
          <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          <button
            type="button"
            onClick={handleToggleMute}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
            }}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            <Icon name={isMuted ? 'volume-off' : 'volume-on'} size={14} color="#FFFFFF" />
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
              backgroundColor: 'rgba(0, 104, 95, 0.25)',
              border: '1px solid rgba(0, 209, 178, 0.35)',
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
                color: '#E0F7F4',
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
              color: '#FFFFFF',
              margin: '0 0 20px',
              maxWidth: '820px',
              letterSpacing: '-1.5px',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            }}
          >
            Skip the Queue.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #00D1B2 0%, #008378 100%)',
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
              color: '#CBD5E1',
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
                backgroundColor: '#00685F',
                color: '#FFFFFF',
                borderRadius: '12px',
                border: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0, 104, 95, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#008378';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00685F';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Explore Salons
              <Icon name="arrow-down" size={16} color="#FFFFFF" />
            </button>

            <button
              type="button"
              onClick={onNavigateToBooking}
              style={{
                padding: '15px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.22)',
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
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Book a Slot
              <Icon name="arrow-right" size={16} color="#FFFFFF" />
            </button>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, auto)',
              gap: '32px',
              backgroundColor: 'rgba(13, 28, 47, 0.6)',
              padding: '18px 36px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: 800, color: '#00D1B2' }}>
                3
              </div>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Salons</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
                ~12 min
              </div>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Avg. Wait</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
                4.8
              </div>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Avg. Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── How It Works ───────── */}
      <section
        style={{
          width: '100%',
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
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
                color: '#00685F',
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
                color: '#0D1C2F',
                margin: '8px 0 12px',
                letterSpacing: '-0.5px',
              }}
            >
              Book in 5 Simple Steps
            </h2>
            <p style={{ color: '#5C647A', fontSize: '15px', maxWidth: '560px', margin: '0 auto' }}>
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
                  backgroundColor: '#F8F9FF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00685F';
                  e.currentTarget.style.backgroundColor = '#F4FFFC';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 104, 95, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.backgroundColor = '#F8F9FF';
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
                      backgroundColor: '#EFF4FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={s.iconName} size={20} color="#00685F" />
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#94A3B8',
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
                    color: '#0D1C2F',
                    margin: 0,
                  }}
                >
                  {s.title}
                </h3>

                <p style={{ fontSize: '13px', color: '#5C647A', lineHeight: 1.55, margin: 0 }}>
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
          backgroundColor: '#F8F9FF',
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
                <span style={{ width: '4px', height: '22px', backgroundColor: '#00685F', borderRadius: '2px' }} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#00685F',
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
                  color: '#0D1C2F',
                  margin: 0,
                  letterSpacing: '-0.5px',
                }}
              >
                Available Salons
              </h2>
              <p style={{ margin: '6px 0 0', color: '#5C647A', fontSize: '14px' }}>
                Browse real-time availability, stylists, and pricing.
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', backgroundColor: '#EFF4FF', padding: '4px', borderRadius: '10px' }}>
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
                      backgroundColor: isSelected ? '#00685F' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#0D1C2F',
                      fontWeight: 600,
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
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
                  border: salon.isFeatured ? '2px solid #00685F' : '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 104, 95, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.05)';
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
                      background: 'linear-gradient(180deg, rgba(13, 28, 47, 0.05) 0%, rgba(13, 28, 47, 0.7) 100%)',
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
                        backgroundColor: salon.type === 'men' ? '#00685F' : '#4648D4',
                        color: '#FFFFFF',
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
                          backgroundColor: 'rgba(245, 158, 11, 0.9)',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Icon name="star" size={12} color="#FFFFFF" />
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
                      color: '#FFFFFF',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="star" size={14} color="#FBBF24" />
                      <strong style={{ fontSize: '15px' }}>{salon.rating}</strong>
                      <span style={{ fontSize: '12px', opacity: 0.85 }}>({salon.reviewsCount})</span>
                    </div>

                    <div
                      style={{
                        backgroundColor: 'rgba(0, 104, 95, 0.85)',
                        backdropFilter: 'blur(4px)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Icon name="clock" size={11} color="#FFFFFF" />
                      ~{salon.estWaitMinutes}m wait
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
                        color: '#0D1C2F',
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
                        color: '#5C647A',
                        marginBottom: '10px',
                      }}
                    >
                      <Icon name="map-pin" size={13} color="#5C647A" />
                      <span>{salon.address}</span>
                      <span style={{ color: '#CBD5E1' }}>·</span>
                      <span style={{ color: '#00685F', fontWeight: 600 }}>{salon.hours}</span>
                    </div>

                    <p
                      style={{
                        fontSize: '13px',
                        lineHeight: 1.55,
                        color: '#3D4947',
                        margin: '0 0 14px',
                      }}
                    >
                      {salon.tagline}
                    </p>

                    {/* Details */}
                    <div
                      style={{
                        backgroundColor: '#F8F9FF',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        border: '1px solid #E8ECF5',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '7px',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#5C647A' }}>Active Chairs:</span>
                        <strong style={{ color: '#0D1C2F' }}>{salon.activeChairs} of {salon.totalChairs}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#5C647A' }}>Popular Service:</span>
                        <span style={{ color: '#00685F', fontWeight: 600 }}>{salon.popularService}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#5C647A' }}>Phone:</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0D1C2F', fontSize: '11px' }}>{salon.phone}</span>
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
                        backgroundColor: '#00685F',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 104, 95, 0.2)',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#008378';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#00685F';
                      }}
                    >
                      Book Now
                      <Icon name="arrow-right" size={14} color="#FFFFFF" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectSalon(salon.id);
                        onNavigateToBooking();
                      }}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#F0F4FF',
                        color: '#00685F',
                        border: '1px solid #D5E3FD',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
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
          backgroundColor: '#0D1C2F',
          color: '#FFFFFF',
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
                backgroundColor: 'rgba(0, 209, 178, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <Icon name="clock" size={22} color="#00D1B2" />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
              Zero-Wait Guarantee
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', lineHeight: 1.65 }}>
              No more sitting on bench queues for 45 minutes. Your slot is digitally reserved and locked with your booking pass.
            </p>
          </div>

          <div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 209, 178, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <Icon name="shield" size={22} color="#00D1B2" />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
              Secure Booking System
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', lineHeight: 1.65 }}>
              Your seat cannot be taken by walk-ins. The barber verifies your booking pass before starting the service.
            </p>
          </div>

          <div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 209, 178, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <Icon name="credit-card" size={22} color="#00D1B2" />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
              Transparent Pricing
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', lineHeight: 1.65 }}>
              Standardized pricing: Normal Haircut at LKR 400, Haircut with Beard Cut at LKR 800. No hidden charges.
            </p>
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer
        style={{
          width: '100%',
          backgroundColor: '#091320',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '40px 24px 30px',
          color: '#94A3B8',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="scissors" size={16} color="#00D1B2" />
              <strong style={{ color: '#FFFFFF', fontSize: '15px' }}>Trimly</strong>
            </div>
            <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '12px' }}>
              Smart Salon Booking System
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={scrollToSalons}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '13px' }}
            >
              Salons
            </button>
            <button
              type="button"
              onClick={onNavigateToBooking}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '13px' }}
            >
              Services
            </button>
            <button
              type="button"
              onClick={onNavigateToPass}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '13px' }}
            >
              My Booking
            </button>
            <button
              type="button"
              onClick={onNavigateToBarber}
              style={{ background: 'none', border: 'none', color: '#00D1B2', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              Barber Portal
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', width: '100%', maxWidth: '1100px', paddingTop: '18px', textAlign: 'center' }}>
          <span>© {new Date().getFullYear()} Trimly. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};
