'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function NeighborhoodTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(imageRef.current, {
        scale: 1.1,
        opacity: 0,
      });

      // Create scroll-triggered animation
      gsap.to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      // Parallax effect
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
    <section ref={sectionRef} className="w-full overflow-hidden">
      <div ref={imageRef} className="relative w-full aspect-[2/3] md:aspect-[3/2]">
        <Image
          src="https://www.datocms-assets.com/121312/1710767391-53west53_neighborhood_02.jpg?auto=format%2Ccompress&fit=max&h=3000&w=2000"
          alt="53 West 53 Neighborhood View"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    </section>
  );
}
