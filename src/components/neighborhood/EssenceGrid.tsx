'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { neighborhoodData } from '@/data/neighborhood-data';
import { NeighborhoodCategory } from '@/types/neighborhood';

gsap.registerPlugin(ScrollTrigger);

export default function EssenceGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(titleRef.current, {
        y: 50,
        opacity: 0,
      });

      gsap.set('.category-column', {
        y: 80,
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
      }).to(
        '.category-column',
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-gray-50"
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-tight"
          >
            The essence of<br />New York
          </h2>
        </div>

        {/* Categories Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto"
        >
          {neighborhoodData.essenceCategories.map((category, index) => (
            <CategoryColumn
              key={category.title}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryColumnProps {
  category: NeighborhoodCategory;
  index: number;
}

function CategoryColumn({ category, index }: CategoryColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={columnRef}
      className="category-column bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Category Header */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl md:text-2xl font-medium text-black">
          {category.title}
        </h3>
      </div>

      {/* Category Items */}
      <div className="space-y-3">
        {category.items.map((item, itemIndex) => (
          <CategoryItem
            key={`${item.name}-${itemIndex}`}
            item={item}
            delay={itemIndex * 0.05}
          />
        ))}
      </div>
    </div>
  );
}

interface CategoryItemProps {
  item: { name: string; type: string };
  delay: number;
}

function CategoryItem({ item, delay }: CategoryItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRef.current,
        {
          opacity: 0,
          x: -20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: delay,
          scrollTrigger: {
            trigger: itemRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, itemRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={itemRef}
      className="group cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-700 group-hover:text-black transition-colors duration-200 text-sm md:text-base">
          {item.name}
        </span>
        
        {/* Type indicator */}
        <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-black transition-colors duration-200" />
      </div>
    </div>
  );
}
