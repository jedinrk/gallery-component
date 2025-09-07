'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { neighborhoodData } from '@/data/neighborhood-data';
import type { WhereToItem } from '@/types/neighborhood';
import { 
  useScrollReveal, 
  useTabSwitching, 
  useMobileTabScroll 
} from '@/hooks/useWhereToAnimations';
import { useTabRowAnimations } from '@/hooks/useTabRowAnimations';
import { useEndlessTabScroll } from '@/hooks/useEndlessTabScroll';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type TabKey = 'dine-sip' | 'see-hear' | 'shop-browse' | 'move-play';

const WhereToSection = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('dine-sip');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs for DOM elements
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabsTrackRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const containersRef = useRef<{ [key in TabKey]?: HTMLDivElement }>({});

  const { whereToSection } = neighborhoodData;
  const categories = whereToSection.categories;

  // Animation hooks
  const { observeElement, cleanup: cleanupScrollReveal } = useScrollReveal();
  const { switchTab, isAnimating: isTabAnimating, cleanup: cleanupTabSwitching } = useTabSwitching();
  const { scrollToActiveTab } = useMobileTabScroll();
  const { setupEntranceAnimation, cleanup: cleanupTabRowAnimations } = useTabRowAnimations();

  // Create item element
  const createItemElement = useCallback((item: WhereToItem, isLast: boolean): HTMLElement => {
    const li = document.createElement('li');
    li.className = `where-to-item site-grid py-40 px-4 s:px-8 border-t border-main ${isLast ? 'border-b border-main' : ''}`;
    
    li.innerHTML = `
      <figure class="where-to-figure col-span-4 s:col-span-3 overflow-hidden relative">
        <div class="relative" style="padding-top: 130.088%">
          <picture class="absolute inset-0">
            <img
              src="${item.image}"
              width="450"
              height="585"
              loading="lazy"
              decoding="async"
              draggable="false"
              class="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out"
              alt="${item.name}"
            />
          </picture>
        </div>
      </figure>
      
      <h3 class="where-to-item-title s:col-start-5 col-span-4 s:col-span-2 mt-20 s:mt-0 flex items-center">
        ${item.name}
      </h3>
      
      <div class="s:col-start-8 col-span-4 s:col-span-5 mt-30 s:mt-0 flex items-center">
        <p class="where-to-description">
          ${item.description}
        </p>
      </div>
    `;

    // Add hover effects
    const figure = li.querySelector('.where-to-figure') as HTMLElement;
    const img = li.querySelector('img') as HTMLImageElement;
    
    if (figure && img) {
      figure.addEventListener('mouseenter', () => {
        gsap.to(img, {
          scale: 1.01,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      figure.addEventListener('mouseleave', () => {
        gsap.to(img, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    }

    return li;
  }, []);

  // Initialize endless scroll hook first (will be called later)
  const { initialize: initializeEndlessScroll, centerActiveTab: centerEndlessTab, updateActiveStates, isInitialized: isEndlessInitialized } = useEndlessTabScroll();

  // Tab switching handler
  const handleTabSwitch = useCallback(async (newTab: TabKey) => {
    if (newTab === activeTab || isAnimating || isTabAnimating()) return;
    
    setIsAnimating(true);

    // First, center the active tab with animation and update states
    centerEndlessTab(newTab);
    updateActiveStates(newTab);

    const currentContainer = containersRef.current[activeTab];
    const newContainer = containersRef.current[newTab];
    const viewport = viewportRef.current;

    if (!currentContainer || !newContainer || !viewport) {
      setIsAnimating(false);
      return;
    }

    // Prepare new container with new content
    newContainer.innerHTML = '';
    const newItems = categories[newTab].items;
    
    // Render new items
    newItems.forEach((item, index) => {
      const itemElement = createItemElement(item, index === newItems.length - 1);
      newContainer.appendChild(itemElement);
    });

    // Execute tab switching animation
    await switchTab(
      currentContainer,
      newContainer,
      viewport,
      () => {
        setActiveTab(newTab);
        setIsAnimating(false);
        
        // Setup scroll reveal for new items
        const items = newContainer.querySelectorAll('.where-to-item');
        items.forEach((item, index) => {
          const itemElement = item as HTMLElement;
          const itemId = `${newTab}-${index}`;
          observeElement(itemElement, itemId);
        });
      }
    );
  }, [activeTab, isAnimating, isTabAnimating, switchTab, observeElement, categories, createItemElement, centerEndlessTab, updateActiveStates]);

  // Section reveal animation on scroll
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !tabsTrackRef.current) return;

    const ctx = gsap.context(() => {
      // Title reveal animation
      gsap.fromTo(titleRef.current, 
        { 
          opacity: 0, 
          y: 16 
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          }
        }
      );
    }, sectionRef);

    // Setup tab-row entrance animation
    if (sectionRef.current && tabsTrackRef.current) {
      setupEntranceAnimation(sectionRef.current, tabsTrackRef.current);
    }

    return () => ctx.revert();
  }, [setupEntranceAnimation]);

  // Setup scroll reveal for initial items
  useEffect(() => {
    const currentContainer = containersRef.current[activeTab];
    if (!currentContainer) return;

    const items = currentContainer.querySelectorAll('.where-to-item');
    items.forEach((item, index) => {
      const itemElement = item as HTMLElement;
      const itemId = `${activeTab}-${index}`;
      
      // Add stagger delay for initial reveal
      setTimeout(() => {
        observeElement(itemElement, itemId);
      }, index * 75); // 60-90ms stagger
    });
  }, [activeTab, observeElement]);

  // Initialize endless scroll and center active tab on initial load
  useEffect(() => {
    if (tabsRef.current && tabsTrackRef.current) {
      // Initialize endless scroll system with handleTabSwitch callback
      const cleanup = initializeEndlessScroll(tabsRef.current, tabsTrackRef.current, handleTabSwitch);
      
      // Center active tab once initialized
      if (isEndlessInitialized) {
        setTimeout(() => {
          centerEndlessTab(activeTab);
          updateActiveStates(activeTab);
        }, 100);
      }

      return cleanup;
    }
  }, [initializeEndlessScroll, centerEndlessTab, updateActiveStates, activeTab, isEndlessInitialized, handleTabSwitch]);

  // Update active states when activeTab changes
  useEffect(() => {
    if (isEndlessInitialized) {
      updateActiveStates(activeTab);
    }
  }, [activeTab, isEndlessInitialized, updateActiveStates]);

  // Initialize containers with current items
  useEffect(() => {
    Object.keys(categories).forEach((key) => {
      const tabKey = key as TabKey;
      const container = containersRef.current[tabKey];
      if (container && tabKey === activeTab) {
        container.innerHTML = '';
        categories[tabKey].items.forEach((item, index) => {
          const itemElement = createItemElement(item, index === categories[tabKey].items.length - 1);
          container.appendChild(itemElement);
        });
      }
    });
  }, [categories, activeTab, createItemElement]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, tabKey: TabKey) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabSwitch(tabKey);
    }
    
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const tabKeys = Object.keys(categories) as TabKey[];
      const currentIndex = tabKeys.indexOf(activeTab);
      let newIndex;
      
      if (event.key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabKeys.length - 1;
      } else {
        newIndex = currentIndex < tabKeys.length - 1 ? currentIndex + 1 : 0;
      }
      
      handleTabSwitch(tabKeys[newIndex]);
    }
  }, [handleTabSwitch, activeTab, categories]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupScrollReveal();
      cleanupTabSwitching();
      cleanupTabRowAnimations();
    };
  }, [cleanupScrollReveal, cleanupTabSwitching, cleanupTabRowAnimations]);

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden pt-40 bg-white"
      aria-labelledby="where-to-title"
    >
      {/* Header - Full Width */}
      <header className="w-full px-4 s:px-8">
        <h2 
          ref={titleRef}
          id="where-to-title"
          className="where-to-title"
        >
          {whereToSection.title}
        </h2>
        
        {/* Tabs Navigation - Full Width with Sliding Track */}
        <div 
          ref={tabsRef}
          className="where-to-tabs-container w-full mt-50 s:mt-0 overflow-hidden"
        >
          <nav 
            ref={tabsTrackRef}
            className="where-to-tabs-nav"
            role="tablist"
            aria-label="Where to categories"
          >
            {/* Tabs will be dynamically created by useEndlessTabScroll hook */}
          </nav>
        </div>
      </header>

      {/* Content - Full Width with Height Morphing Viewport */}
      <div className="relative mt-20 s:mt-120">
        <div 
          ref={viewportRef}
          className="where-list-viewport w-full"
        >
          {/* Container for each tab's content */}
          {Object.keys(categories).map((key) => {
            const tabKey = key as TabKey;
            return (
              <div
                key={tabKey}
                ref={(el) => {
                  if (el) containersRef.current[tabKey] = el;
                }}
                id={`panel-${tabKey}`}
                role="tabpanel"
                aria-labelledby={`tab-${tabKey}`}
                className={`where-list-container w-full ${tabKey === activeTab ? '' : 'hidden'}`}
                style={{ display: tabKey === activeTab ? 'block' : 'none' }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhereToSection;
