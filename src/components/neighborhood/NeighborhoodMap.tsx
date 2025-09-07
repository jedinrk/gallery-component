'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { neighborhoodData } from '@/data/neighborhood-data';

gsap.registerPlugin(ScrollTrigger);

export default function NeighborhoodMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(mapRef.current, {
        scale: 0.9,
        opacity: 0,
        y: 50,
      });

      // Create scroll-triggered animation
      gsap.to(mapRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Parallax effect
      gsap.to(mapRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Map Container */}
        <div
          ref={mapRef}
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="relative aspect-[16/10]">
            <Image
              src={neighborhoodData.map.image}
              alt={neighborhoodData.map.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
            />
            
            {/* Overlay with location marker */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Location Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Pulsing circle */}
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                <div className="relative w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg">
                  <div className="absolute inset-1 bg-white rounded-full" />
                </div>
                
                {/* Location label */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                  <span className="text-sm font-medium text-black">53 West 53</span>
                </div>
              </div>
            </div>

            {/* Interactive hotspots */}
            <MapHotspot
              position={{ top: '30%', left: '40%' }}
              label="MoMA"
              category="Culture"
            />
            
            <MapHotspot
              position={{ top: '45%', left: '35%' }}
              label="Central Park"
              category="Recreation"
            />
            
            <MapHotspot
              position={{ top: '60%', left: '50%' }}
              label="Times Square"
              category="Entertainment"
            />
            
            <MapHotspot
              position={{ top: '40%', left: '60%' }}
              label="Fifth Avenue"
              category="Shopping"
            />
          </div>
        </div>

        {/* Map Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <LegendItem color="bg-red-500" label="53 West 53" />
          <LegendItem color="bg-blue-500" label="Culture" />
          <LegendItem color="bg-green-500" label="Recreation" />
          <LegendItem color="bg-purple-500" label="Shopping" />
          <LegendItem color="bg-orange-500" label="Entertainment" />
        </div>
      </div>
    </section>
  );
}

interface MapHotspotProps {
  position: { top: string; left: string };
  label: string;
  category: string;
}

function MapHotspot({ position, label, category }: MapHotspotProps) {
  const hotspotRef = useRef<HTMLDivElement>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Culture':
        return 'bg-blue-500';
      case 'Recreation':
        return 'bg-green-500';
      case 'Shopping':
        return 'bg-purple-500';
      case 'Entertainment':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      ref={hotspotRef}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
      style={position}
    >
      {/* Hotspot marker */}
      <div className={`w-4 h-4 ${getCategoryColor(category)} rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform duration-200`}>
        <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
      </div>
    </div>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 ${color} rounded-full`} />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
