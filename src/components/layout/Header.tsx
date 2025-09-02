"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import fredyHeaderImg from "../../../app/mainPage Assets/Hero/Fredy-header.png";

export default function Header() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bannerPosition, setBannerPosition] = useState(0);
  const [scrollY, setScrollY] = useState(0);

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
    const animateBanner = () => {
      setBannerPosition(prev => {
        if (prev <= -200) {
          return 100; // Reset to start position for seamless loop
        }
        return prev - 0.02; // Move left much slower
      });
    };

    const interval = setInterval(animateBanner, 60); // Much slower updates
    return () => clearInterval(interval);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header
      id="site-header"
      className="relative w-full h-[100vh] bg-white overflow-hidden rounded-b-3xl"
    >
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 py-6" style={{ zIndex: 40 }}>
        <div className="mx-auto max-w-[100rem] px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="text-black text-xl font-bold">Fredy Portfolio</div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#work" className="text-black/80 hover:text-black">Work</a>
              <a href="#about" className="text-black/80 hover:text-black">About</a>
              <a href="#contact" className="text-black/80 hover:text-black">Contact</a>
            </div>
          </div>
        </div>
      </nav>

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
          transform: `translateY(-50%) translateY(${scrollY * 0.1}px)`, // Subtle parallax for banner
          height: '1000px'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            fontSize: '600px',
            fontWeight: 1000,
            color: '#F4F4F4',
            fontFamily: 'Arial, sans-serif',
            whiteSpace: 'nowrap',
            top: '50%',
            transform: `translateY(-50%) translateX(${bannerPosition}%)`,
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
          transform: `translateY(${scrollY * 0.15}px)` // Subtle parallax for image
        }}
      >
        <Image
          src={fredyHeaderImg}
          alt="Fredy"
          fill
          className="object-contain object-bottom"
          priority
        />
      </div>

      {/* Text layer with blend mode applied to entire text with parallax */}
      <div 
        className="absolute inset-0 pointer-events-none select-none flex items-center"
        style={{
          zIndex: 30,
          mixBlendMode: 'difference',
          transform: `translateY(-120px) translateX(${mousePosition.x * 45}px) translateY(${mousePosition.y * 25}px) translateY(${scrollY * 0.05}px)`,
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
              fontSize: 'clamp(10rem, 15vw, 15.4rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.85,
              whiteSpace: 'nowrap',
              color: '#FFFFFF',
              fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
              margin: 0,
              padding: 0
            }}
          >
            FREDY PEDRO
          </h1>
        </div>
      </div>

      {/* Description and Buttons at the bottom */}
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
            <p 
              style={{
                fontSize: '1.25rem',
                lineHeight: 1.4,
                color: '#FFFFFF',
                fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                margin: '0 0 2rem 0',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              I am a UI/UX Designer & Front End Developer<br />
              based in Los Angeles.
            </p>
            
            <div 
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                pointerEvents: 'auto',
                marginBottom: '3rem'
              }}
            >
              <button 
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                  cursor: 'pointer'
                }}
              >
                View My Work
              </button>
              
              <button 
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                  cursor: 'pointer'
                }}
              >
                Get In Touch
              </button>
            </div>

            {/* Scroll Indicator */}
            <div 
              style={{
                display: 'flex',
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
  );
}