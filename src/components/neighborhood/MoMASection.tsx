'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { neighborhoodData } from '@/data/neighborhood-data';

gsap.registerPlugin(ScrollTrigger);

export default function MoMASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const momaImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, textRef.current], {
        x: -60,
        opacity: 0,
      });

      gsap.set([imageRef.current, momaImageRef.current], {
        scale: 1.1,
        opacity: 0,
      });

      // Create scroll-triggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.to(titleRef.current, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      })
        .to(
          textRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .to(
          imageRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: 'power3.out',
          },
          '-=0.8'
        )
        .to(
          momaImageRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: 'power3.out',
          },
          '-=1'
        );

      // Parallax effects
      gsap.to(imageRef.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(momaImageRef.current, {
        yPercent: -25,
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
      className="py-20 md:py-32 bg-gray-50 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Images */}
          <div className="relative order-2 lg:order-1">
            {/* Main building image */}
            <div
              ref={imageRef}
              className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-2xl"
            >
              <Image
                src={neighborhoodData.momaSection.image}
                alt="MoMA tower - The David Geffen Wing"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
            </div>

            {/* Secondary MoMA image */}
            <div
              ref={momaImageRef}
              className="absolute -bottom-12 -right-8 w-48 h-64 md:w-56 md:h-72 overflow-hidden rounded-lg shadow-xl"
            >
              <Image
                src="https://www.datocms-assets.com/121312/1710767431-53west53_neighborhood_04.jpg?auto=format%2Ccompress&fit=max&h=3000&w=2000"
                alt="53W53 residences above the Museum of Modern Art"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, 250px"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/80 rounded-full -z-10" />
            <div className="absolute top-1/2 -right-12 w-24 h-24 bg-black/5 rounded-full -z-10" />
          </div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <h2
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-tight"
            >
              {neighborhoodData.momaSection.title}
            </h2>
            
            <p
              ref={textRef}
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
            >
              {neighborhoodData.momaSection.description}
            </p>

            {/* MoMA Badge */}
            <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
              <div className="w-3 h-3 bg-black rounded-full" />
              <span className="text-sm font-medium text-black tracking-wide">
                Connected to MoMA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
