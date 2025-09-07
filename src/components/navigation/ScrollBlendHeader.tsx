'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { navigationItems, contactInfo } from '@/data/neighborhood-data';
import { X, Menu, Mail, Phone, Instagram } from 'lucide-react';

interface ScrollBlendHeaderProps {
  heroRef?: React.RefObject<HTMLDivElement>;
}

export default function ScrollBlendHeader({ heroRef }: ScrollBlendHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);

    // Find the sentinel element in the hero section
    const findSentinel = () => {
      return document.querySelector('[data-scroll-sentinel]') as HTMLElement;
    };

    // Create intersection observer for scroll detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When sentinel is not intersecting (hero has scrolled past), header becomes sticky
          setIsScrolled(!entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -1px 0px', // Trigger just before sentinel leaves viewport
      }
    );

    // Try to find and observe the sentinel
    const sentinel = findSentinel();
    if (sentinel) {
      observer.observe(sentinel);
    } else {
      // If sentinel not found immediately, try again after a short delay
      const timeout = setTimeout(() => {
        const delaySentinel = findSentinel();
        if (delaySentinel) {
          observer.observe(delaySentinel);
        }
      }, 100);
      
      return () => {
        clearTimeout(timeout);
        observer.disconnect();
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // Close menu and restore scroll when component unmounts or menu closes
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      {/* Header */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50`}
        role="banner"
        style={{
          height: 'clamp(60px, 10vw, 88px)',
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        }}
      >
        <div className="w-full px-6 h-full flex items-center justify-between relative">
          {/* Left Navigation - First 4 items (skip Homepage since logo serves as home) */}
          <nav 
            className="hidden lg:flex items-center flex-1 justify-start"
            aria-label="Primary navigation left"
            style={{ gap: '1.5rem' }}
          >
            {navigationItems.slice(1, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-white font-medium tracking-wide transition-colors ${
                  prefersReducedMotion ? 'duration-0' : 'duration-300'
                } ease-out hover:text-white/90 focus:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm px-1 py-1`}
                style={{
                  fontSize: 'clamp(14px, 1.6vw, 16px)',
                  letterSpacing: '0.08em',
                  minHeight: '44px',
                  minWidth: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logo - Centered */}
          <Link 
            href="/" 
            className={`text-white font-light tracking-wider transition-all ${
              prefersReducedMotion ? 'duration-0' : 'duration-200'
            } ease-out hover:opacity-80 absolute left-1/2 transform -translate-x-1/2`}
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              zIndex: 10,
            }}
          >
            53WEST53
          </Link>

          {/* Right Navigation - Last 4 items + CTA */}
          <nav 
            className="hidden lg:flex items-center flex-1 justify-end"
            aria-label="Primary navigation right"
            style={{ gap: '1.5rem' }}
          >
            {navigationItems.slice(5, 9).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-white font-medium tracking-wide transition-colors ${
                  prefersReducedMotion ? 'duration-0' : 'duration-300'
                } ease-out hover:text-white/90 focus:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm px-1 py-1`}
                style={{
                  fontSize: 'clamp(14px, 1.6vw, 16px)',
                  letterSpacing: '0.08em',
                  minHeight: '44px',
                  minWidth: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Desktop CTA */}
            <Link
              href="/inquire"
              className={`nav-link text-white font-medium tracking-wide transition-colors ${
                prefersReducedMotion ? 'duration-0' : 'duration-300'
              } ease-out hover:text-white/90 focus:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm px-1 py-1`}
              style={{
                fontSize: 'clamp(14px, 1.6vw, 16px)',
                letterSpacing: '0.08em',
                minHeight: '44px',
                minWidth: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Inquire
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-white hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          id="mobile-menu"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/92 backdrop-blur-sm" 
            onClick={toggleMenu}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div 
            className={`absolute top-0 right-0 h-full w-full max-w-sm bg-black/95 shadow-xl transform transition-transform ${
              prefersReducedMotion ? 'duration-0' : 'duration-300'
            } ease-out`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 id="mobile-menu-title" className="text-white text-xl font-light tracking-wider">
                  53W53
                </h2>
                <button
                  onClick={toggleMenu}
                  className="p-2 text-white hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 rounded-sm"
                  aria-label="Close menu"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 mb-12 flex-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={toggleMenu}
                    className="block text-white font-medium tracking-wide hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/95 rounded-sm px-3 py-4"
                    style={{
                      fontSize: '18px',
                      lineHeight: '24px',
                      minHeight: '44px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Contact Information */}
              <div className="space-y-4 border-t border-white/20 pt-8 mb-8">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-sm p-2"
                  style={{ minHeight: '44px' }}
                >
                  <Mail size={20} />
                  <span className="text-sm">Email</span>
                </a>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-sm p-2"
                  style={{ minHeight: '44px' }}
                >
                  <Phone size={20} />
                  <span className="text-sm">Phone</span>
                </a>
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-sm p-2"
                  style={{ minHeight: '44px' }}
                >
                  <Instagram size={20} />
                  <span className="text-sm">Instagram</span>
                </a>
                <Link
                  href={contactInfo.press}
                  onClick={toggleMenu}
                  className="block text-sm text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-sm p-2"
                  style={{ minHeight: '44px' }}
                >
                  Press
                </Link>
              </div>

              {/* Mobile CTA Button */}
              <div>
                <Link
                  href="/inquire"
                  onClick={toggleMenu}
                  className="block w-full bg-white text-black text-center font-medium uppercase tracking-wide hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/95 rounded-sm px-6 py-4"
                  style={{
                    fontSize: '16px',
                    minHeight: '44px',
                  }}
                >
                  Inquire
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
