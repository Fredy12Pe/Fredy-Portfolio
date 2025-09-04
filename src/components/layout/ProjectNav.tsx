"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export default function ProjectNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 mobile-menu-container">
        <div className="mx-auto max-w-[100rem] px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - clickable to go to header */}
            <Link href="/#site-header" className="text-black text-xl font-bold hover:text-gray-700 transition-colors">
              FREDY DESIGN
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <Link href="/#projects" className="text-black/90 hover:text-black text-lg font-medium transition-colors">
                Projects
              </Link>
              <Link href="/#about" className="text-black/90 hover:text-black text-lg font-medium transition-colors">
                About
              </Link>
              <Link href="/#favorite-stack" className="text-black/90 hover:text-black text-lg font-medium transition-colors">
                Stack
              </Link>
              <Link href="/#contact" className="text-black/90 hover:text-black text-lg font-medium transition-colors">
                Contact
              </Link>
            </div>

            {/* Mobile hamburger menu */}
            <div className="md:hidden">
              <button 
                className="text-black p-2"
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
      </nav>

      {/* Mobile Menu Dropdown - Rendered as Portal */}
      {mounted && isMobileMenuOpen && createPortal(
        <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999]">
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
          
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-4">
            <Link 
              href="/#projects" 
              className="text-white hover:text-white/80 text-2xl font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href="/#about" 
              className="text-white hover:text-white/80 text-2xl font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/#favorite-stack" 
              className="text-white hover:text-white/80 text-2xl font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Stack
            </Link>
            <Link 
              href="/#contact" 
              className="text-white hover:text-white/80 text-2xl font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
