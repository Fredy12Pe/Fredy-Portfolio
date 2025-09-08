"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bannerPosition, setBannerPosition] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);

  // Scroll functions for buttons
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate position as percentage from center (-1 to 1)
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Banner animation
  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);

    const animateBanner = () => {
      setBannerPosition(prev => {
        if (prev <= -200) {
          return 100; // Reset to start position for seamless loop
        }
        const speed = isMobile ? 0.01 : 0.02; // Slower on mobile only
        return prev - speed;
      });
    };

    const interval = setInterval(animateBanner, 60);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateIsMobile);
    };
  }, [isMobile]);

  // Parallax scroll effect and scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollY(scrollY);
      
      // Jump to 80% opacity immediately when scroll starts, then smooth transition
      const opacity = scrollY > 0 ? 0.8 : 0;
      setScrollOpacity(opacity);
      
      // Still use binary for other effects
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  return (
    <>
      {/* Sticky Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 mobile-menu-container ${
          isScrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="mx-auto max-w-[100rem] px-4 md:px-8">
          <div 
            style={{
              width: '100%', 
              height: '100%', 
              background: scrollOpacity > 0 ? 'rgba(0, 0, 0, 0.80)' : 'transparent', 
              borderRadius: 20, 
              border: '1px rgba(255, 255, 255, 0.20) solid',
              backdropFilter: scrollOpacity > 0 ? 'blur(12px)' : 'none',
              WebkitBackdropFilter: scrollOpacity > 0 ? 'blur(12px)' : 'none',
              transition: 'all 0.3s ease-out'
            }}
            className="p-5"
          >
            <div className="flex items-center justify-between">
              <div className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-black'
              }`}>
                FREDY DESIGN
              </div>
              <div className="hidden md:flex items-center space-x-10">
                <a 
                  href="#projects" 
                  className={`text-lg font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'
                  }`}
                >
                  Projects
                </a>
                <a 
                  href="#about" 
                  className={`text-lg font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'
                  }`}
                >
                  About
                </a>
                <a 
                  href="#favorite-stack" 
                  className={`text-lg font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'
                  }`}
                >
                  Stack
                </a>
                <a 
                  href="#contact" 
                  className={`text-lg font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'
                  }`}
                >
                  Contact
                </a>
              </div>
              {/* Mobile hamburger menu */}
              <div className="md:hidden">
                <button 
                  className={`p-2 transition-colors duration-300 ${
                    isScrolled ? 'text-white' : 'text-black'
                  }`}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <header
        id="site-header"
        className="relative w-full h-[100vh] bg-white overflow-hidden rounded-b-3xl"
      >
        {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-50">
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 text-white hover:text-white/80 transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <a 
              href="#projects" 
              className="text-white hover:text-white/80 text-2xl font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </a>
            <a 
              href="#about" 
              className="text-white hover:text-white/80 text-2xl font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#favorite-stack" 
              className="text-white hover:text-white/80 text-2xl font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stack
            </a>
            <a 
              href="#contact" 
              className="text-white hover:text-white/80 text-2xl font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      )}

      {/* Scrolling Banner - behind image - JavaScript animated with parallax */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          zIndex: 15,
          overflow: 'hidden',
          pointerEvents: 'none',
          transform: `translateY(-50%) translateY(${scrollY * 0.06}px)`, // Reduced parallax for banner
          height: '1000px'
        }}
      >
        <div 
          className="text-[600px]"
          style={{
            position: 'absolute',
            fontWeight: 1000,
            color: '#F5F5F5',
            fontFamily: 'Arial, sans-serif',
            whiteSpace: 'nowrap',
            top: isMobile ? '30%' : '50%',
            transform: isMobile ? `translateY(-40%) translateX(${bannerPosition}%)` : `translateY(-50%) translateX(${bannerPosition}%)`,
            transition: 'none' // No CSS transitions, pure JS animation
          }}
        >
          UI/UX • REACT • NEXT.JS • SPLINE • AI • UI/UX • REACT • NEXT.JS • SPLINE • AI • UI/UX • REACT • NEXT.JS • SPLINE • AI • UI/UX • REACT • NEXT.JS • SPLINE • AI • UI/UX • REACT • NEXT.JS • SPLINE • AI • UI/UX • REACT • NEXT.JS • SPLINE • AI • 
        </div>
      </div>

      {/* Image layer - middle layer above banner with parallax */}
      <div 
        className="absolute inset-0" 
        style={{ 
          zIndex: 20,
          transform: `translateY(${scrollY * 0.08}px)` // Reduced parallax for image
        }}
      >
        {/* Mobile image (art-directed) */}
        <Image
          src="/images/hero/Fredy-header-mobile.png"
          alt="Fredy"
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 0vw"
          priority
          className="block md:hidden object-center object-cover w-full h-full"
          onLoad={() => console.log('Mobile header image loaded successfully')}
          onError={(e) => console.error('Mobile header image failed to load:', e)}
        />
        {/* Desktop image */}
        <Image
          src="/images/hero/Fredy-header.png"
          alt="Fredy"
          width={1200}
          height={800}
          sizes="(min-width: 768px) 100vw, 0vw"
          priority
          className="hidden md:block object-bottom object-contain w-full h-full"
          onLoad={() => console.log('Desktop header image loaded successfully')}
          onError={(e) => console.error('Desktop header image failed to load:', e)}
        />
      </div>

      {/* Text layer with blend mode applied to entire text with parallax */}
      <div 
        className="absolute inset-0 pointer-events-none select-none flex items-center"
        style={{
          zIndex: 30,
          mixBlendMode: 'difference',
          transform: `${isMobile ? 'translateY(300px)' : 'translateY(-160px)'} translateX(${mousePosition.x * 16}px) translateY(${mousePosition.y * 10}px) translateY(${scrollY * 0.018}px)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div 
          className="mx-auto w-full"
          style={{
            maxWidth: '100rem',
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}
        >
          <h1 
            style={{
              width: '100%',
              fontSize: isMobile ? 'clamp(2.75rem, 12vw, 15rem)' : 'clamp(10rem, 15vw, 15.4rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.85,
              whiteSpace: 'nowrap',
              color: '#FFFFFF',
              fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
              margin: 0,
              padding: 0,
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            FREDY PEDRO
          </h1>

          {/* Centered description and buttons (like reference) */}
          <div className="block md:hidden" style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <p 
              style={{
                fontSize: 'clamp(1rem, 3.6vw, 1.25rem)',
                lineHeight: 1.4,
                color: '#FFFFFF',
                fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                margin: '0 0 1.5rem 0',
                maxWidth: '700px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              I am a UI/UX Designer & front-end Developer, <br />creating intuitive digital experiences.
            </p>

            <div 
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                pointerEvents: 'auto',
              }}
            >
              <button 
                onClick={scrollToAbout}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                About Me
              </button>
              <button 
                onClick={scrollToContact}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: desktop description + buttons; mobile keeps content above */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none select-none"
        style={{
          zIndex: 40,
          paddingBottom: '4rem'
        }}
      >
        <div 
          className="mx-auto w-full"
          style={{
            maxWidth: '100rem',
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            {/* Desktop-only description + buttons */}
            <div className="hidden md:block" style={{ marginBottom: '3rem' }}>
              <p 
                style={{
                  fontSize: 'clamp(1rem, 3.6vw, 1.25rem)',
                  lineHeight: 1.4,
                  color: '#FFFFFF',
                  fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                  margin: '0 0 2rem 0',
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              >
                I am a UI/UX Designer & front-end Developer, <br />creating intuitive digital experiences.
              </p>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  justifyContent: 'center', 
                  flexWrap: 'wrap',
                  pointerEvents: 'auto'
                }}
              >
                <button 
                  onClick={scrollToAbout}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  About Me
                </button>
                <button 
                  onClick={scrollToContact}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: 'transparent',
                    color: '#FFFFFF',
                    border: '2px solid #FFFFFF',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  Get In Touch
                </button>
              </div>
            </div>
            {/* Scroll Indicator removed on mobile */}
            <div className="hidden md:flex"
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                color: '#FFFFFF'
              }}
            >
              <span 
                style={{
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontFamily: 'Poppins, system-ui, -apple-system, sans-serif'
                }}
              >
                Scroll to explore
              </span>
              <div 
                style={{
                  width: '24px',
                  height: '40px',
                  border: '2px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '20px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div 
                  style={{
                    width: '4px',
                    height: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '2px',
                    marginTop: '8px',
                    animation: 'bounce 1s infinite'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}