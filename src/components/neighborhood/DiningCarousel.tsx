'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { neighborhoodData } from '@/data/neighborhood-data';
import { DiningVenue } from '@/types/neighborhood';

gsap.registerPlugin(ScrollTrigger);

export default function DiningCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const venues = neighborhoodData.diningVenues;

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Initial animation for the section
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % venues.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, venues.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + venues.length) % venues.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % venues.length);
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-tight mb-6">
            The essence of<br />New York
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover world-class dining and entertainment just steps from your door
          </p>
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Carousel */}
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {venues.map((venue, index) => (
                <CarouselSlide
                  key={venue.id}
                  venue={venue}
                  isActive={index === currentIndex}
                />
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous venue"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next venue"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {venues.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-black scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Venue Cards Grid (Mobile Alternative) */}
        <div className="grid md:hidden gap-6 mt-16">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CarouselSlideProps {
  venue: DiningVenue;
  isActive: boolean;
}

function CarouselSlide({ venue, isActive }: CarouselSlideProps) {
  return (
    <div className="w-full flex-shrink-0 relative">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px]">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={venue.image}
            alt={venue.name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={isActive}
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
            {venue.category}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h3 className="text-3xl md:text-4xl font-light text-black">
            {venue.name}
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            {venue.description}
          </p>
          
          {/* Learn More Button */}
          <button className="inline-flex items-center space-x-2 text-black hover:text-gray-600 transition-colors duration-200 group">
            <span className="font-medium">Learn More</span>
            <ChevronRight 
              size={20} 
              className="transition-transform duration-200 group-hover:translate-x-1" 
            />
          </button>
        </div>
      </div>
    </div>
  );
}

interface VenueCardProps {
  venue: DiningVenue;
}

function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-[4/3]">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
          {venue.category}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-light text-black">{venue.name}</h3>
        <p className="text-gray-600 leading-relaxed">{venue.description}</p>
        
        <button className="inline-flex items-center space-x-2 text-black hover:text-gray-600 transition-colors duration-200 group">
          <span className="font-medium">Learn More</span>
          <ChevronRight 
            size={20} 
            className="transition-transform duration-200 group-hover:translate-x-1" 
          />
        </button>
      </div>
    </div>
  );
}
