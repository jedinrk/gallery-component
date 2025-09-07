'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { neighborhoodData } from '@/data/neighborhood-data';

gsap.registerPlugin(ScrollTrigger);

export default function NeighborhoodIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, textRef.current], {
        y: 60,
        opacity: 0,
      });

      gsap.set(imageRef.current, {
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
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      })
        .to(
          textRef.current,
          {
            y: 0,
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
        );

      // Parallax effect for image
      gsap.to(imageRef.current, {
        yPercent: -20,
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
      data-text=""
      className="site-max site-grid mb-20 s:mb-40"
    >
      <h1
        ref={titleRef}
        className="col-span-4 s:col-span-10 h1 mb-50 s:mb-150"
      >
        A vibrant <span>neighborhood</span>
      </h1>
      
      <div className="col-span-4 txt s:pr-90">
        <p ref={textRef}>
          {neighborhoodData.vibrantNeighborhood.description}
        </p>
      </div>
      
      <div 
        ref={imageRef}
        data-src={neighborhoodData.vibrantNeighborhood.image}
        className="bg-main col-span-4 mt-30 s:mt-0 relative w-full s:col-span-8"
      >
        <figure 
          data-zoom={neighborhoodData.vibrantNeighborhood.image}
          className="overflow-hidden media-fill lazy relative w-full"
        >
          <div style={{ paddingTop: '66.6667%' }}></div>
          <picture className="absolute inset-0">
            <Image
              src={neighborhoodData.vibrantNeighborhood.image}
              alt="53 West 53 neighborhood view"
              width={2000}
              height={1333}
              loading="lazy"
              className="transition-opacity duration-500 ease-out opacity-100"
              style={{ objectFit: 'cover', objectPosition: '50% 50%' }}
              draggable={false}
              sizes="(max-width: 2000px) 100vw, 2000px"
            />
          </picture>
        </figure>
      </div>
    </section>
  );
}
