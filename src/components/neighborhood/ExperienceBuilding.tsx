'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { neighborhoodData } from '@/data/neighborhood-data';

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceBuilding() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, buttonRef.current], {
        y: 60,
        opacity: 0,
      });

      // Create scroll-triggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      }).to(
        buttonRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.5'
      );

      // Button hover animation
      const button = buttonRef.current;
      if (button) {
        const handleMouseEnter = () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          button.removeEventListener('mouseenter', handleMouseEnter);
          button.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Title */}
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-12"
          >
            {neighborhoodData.cta.title}
          </h2>

          {/* CTA Button */}
          <Link
            ref={buttonRef}
            href={neighborhoodData.cta.link}
            className="inline-flex items-center space-x-4 bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors duration-300 group"
          >
            <span>{neighborhoodData.cta.buttonText}</span>
            <ArrowRight 
              size={24} 
              className="transition-transform duration-300 group-hover:translate-x-1" 
            />
          </Link>

          {/* Additional Info */}
          <div className="mt-12 space-y-4">
            <p className="text-gray-300 text-lg">
              Discover luxury living in the heart of Manhattan
            </p>
            
            {/* Contact Options */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mt-8">
              <a
                href="tel:917.870.6463"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Call: 917.870.6463</span>
              </a>
              
              <a
                href="mailto:info@53WEST53.com"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Email: info@53WEST53.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 translate-y-16" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-24 -translate-y-24" />
    </section>
  );
}
