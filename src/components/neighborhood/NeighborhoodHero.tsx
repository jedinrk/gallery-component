'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function NeighborhoodHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReducedMotion = useRef<boolean>(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;
    
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    
    mediaQuery.addEventListener('change', handleChange);

    if (!heroRef.current) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial video container position with +8% offset
      if (videoContainerRef.current) {
        gsap.set(videoContainerRef.current, {
          y: '8%',
        });
      }

      // Set initial state for words (hidden for entrance animation)
      gsap.set(wordRefs.current.filter(Boolean), {
        opacity: 0,
        y: 16,
      });

      if (!prefersReducedMotion.current) {
        // Word-by-word entrance animation with stagger
        gsap.to(wordRefs.current.filter(Boolean), {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power2.out',
          delay: 0.5, // Small delay after page load
        });

        // Parallax effect on scroll
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            if (videoContainerRef.current) {
              // Move from +8% to -8% as user scrolls
              const progress = self.progress;
              const yValue = 8 - (progress * 16); // 8% to -8%
              gsap.set(videoContainerRef.current, {
                y: `${yValue}%`,
              });
            }
          },
        });
      } else {
        // For reduced motion, show words immediately without animation
        gsap.set(wordRefs.current.filter(Boolean), {
          opacity: 1,
          y: 0,
        });
      }

      // Auto-play video when it's loaded
      if (videoRef.current) {
        const video = videoRef.current;
        const playVideo = () => {
          video.play().catch(() => {
            // Video autoplay failed, which is expected in some browsers
            console.log('Video autoplay prevented by browser');
          });
        };

        if (video.readyState >= 3) {
          playVideo();
        } else {
          video.addEventListener('loadeddata', playVideo);
        }
      }
    }, heroRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const words = ['The', 'heartbeat', 'of', 'the', 'city'];

  return (
    <div
      ref={heroRef}
      className={`hero-section relative h-screen h-[100svh] text-white flex items-end overflow-hidden ${
        prefersReducedMotion.current ? 'no-motion' : ''
      }`}
      style={{ 
        marginTop: 0,
        height: '100vh'
      }}
    >
      {/* Sentinel for scroll detection - positioned at bottom of hero */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1 pointer-events-none"
        style={{ zIndex: 1 }}
        data-scroll-sentinel
      />
      {/* Video Background */}
      <div 
        ref={videoContainerRef}
        className="absolute"
        style={{ 
          top: 'calc(-1 * clamp(60px, 10vw, 88px))',
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <video
          ref={videoRef}
          src="https://player.vimeo.com/progressive_redirect/playback/927187390/rendition/1080p/file.mp4?loc=external&log_user=0&signature=9b8b0fdb1207e671c13a7e200214b9cea671942e9dfacd6668f44539b163edfe"
          preload="metadata"
          muted
          loop
          playsInline
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="site-max-hero relative pb-48 z-2">
        <div className="hero-text-container">
          <h1 className="hero-title">
          <div className="block text-left relative mb-8">
            <span 
              ref={(el) => { wordRefs.current[0] = el; }}
              className="relative inline-block"
            >
              {words[0].toUpperCase()}
            </span>
            {' '}
            <span 
              ref={(el) => { wordRefs.current[1] = el; }}
              className="relative inline-block"
            >
              {words[1].toUpperCase()}
            </span>
          </div>
          <div className="block text-left relative">
            <span 
              ref={(el) => { wordRefs.current[2] = el; }}
              className="relative inline-block"
            >
              {words[2].toUpperCase()}
            </span>
            {' '}
            <span 
              ref={(el) => { wordRefs.current[3] = el; }}
              className="relative inline-block"
            >
              {words[3].toUpperCase()}
            </span>
            {' '}
            <span 
              ref={(el) => { wordRefs.current[4] = el; }}
              className="relative inline-block"
            >
              {words[4].toUpperCase()}
            </span>
          </div>
          </h1>
        </div>
      </div>
    </div>
  );
}
