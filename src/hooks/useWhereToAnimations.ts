'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type TabKey = 'dine-sip' | 'see-hear' | 'shop-browse' | 'move-play';

// Hook for scroll reveal animations
export const useScrollReveal = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const revealedItemsRef = useRef<Set<string>>(new Set());

  const observeElement = useCallback((element: HTMLElement, itemId: string) => {
    if (!element || revealedItemsRef.current.has(itemId)) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
              const itemElement = entry.target as HTMLElement;
              const itemId = itemElement.dataset.itemId;
              
              if (itemId && !revealedItemsRef.current.has(itemId)) {
                revealedItemsRef.current.add(itemId);
                animateItemReveal(itemElement);
                observerRef.current?.unobserve(entry.target);
              }
            }
          });
        },
        {
          threshold: 0.25,
          rootMargin: '0px'
        }
      );
    }

    element.dataset.itemId = itemId;
    observerRef.current.observe(element);
  }, []);

  const animateItemReveal = useCallback((itemElement: HTMLElement) => {
    const figure = itemElement.querySelector('.where-to-figure');
    const title = itemElement.querySelector('.where-to-item-title');
    const description = itemElement.querySelector('.where-to-description');

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Instant reveal for reduced motion
      gsap.set([figure, title, description], { opacity: 1 });
      return;
    }

    // Set initial states
    gsap.set(figure, { opacity: 0, scale: 1.05, y: 8 });
    gsap.set(title, { opacity: 0, y: 12 });
    gsap.set(description, { opacity: 0, y: 14 });

    // Create timeline for staggered reveal
    const tl = gsap.timeline();

    // Figure animation
    tl.to(figure, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.47, // 420-520ms range
      ease: 'power2.out'
    });

    // Title animation (with delay)
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.42, // 380-460ms range
      ease: 'power2.out'
    }, '-=0.39'); // Start 60-90ms after figure starts

    // Description animation (with delay)
    tl.to(description, {
      opacity: 1,
      y: 0,
      duration: 0.42, // 380-460ms range
      ease: 'power2.out'
    }, '-=0.30'); // Start 120-150ms after figure starts
  }, []);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    revealedItemsRef.current.clear();
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { observeElement, cleanup };
};

// Hook for measuring heights
export const useMeasuredHeight = () => {
  const measureHeight = useCallback((element: HTMLElement): number => {
    if (!element) return 0;
    
    // Force layout calculation
    element.style.height = 'auto';
    const height = element.offsetHeight;
    return height;
  }, []);

  const measureOffscreenHeight = useCallback((element: HTMLElement): Promise<number> => {
    return new Promise((resolve) => {
      if (!element) {
        resolve(0);
        return;
      }

      // Create offscreen container
      const offscreenContainer = element.cloneNode(true) as HTMLElement;
      offscreenContainer.classList.add('offscreen');
      offscreenContainer.style.position = 'absolute';
      offscreenContainer.style.top = '0';
      offscreenContainer.style.left = '0';
      offscreenContainer.style.width = '100%';
      offscreenContainer.style.opacity = '0';
      offscreenContainer.style.pointerEvents = 'none';
      offscreenContainer.style.visibility = 'hidden';
      offscreenContainer.style.height = 'auto';

      // Insert into DOM temporarily
      element.parentElement?.appendChild(offscreenContainer);

      // Measure height after next frame
      requestAnimationFrame(() => {
        const height = offscreenContainer.offsetHeight;
        offscreenContainer.remove();
        resolve(height);
      });
    });
  }, []);

  return { measureHeight, measureOffscreenHeight };
};

// Hook for tab switching choreography
export const useTabSwitching = () => {
  const isAnimatingRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const switchTab = useCallback(async (
    currentContainer: HTMLElement,
    newContainer: HTMLElement,
    viewportContainer: HTMLElement,
    onComplete: () => void
  ): Promise<void> => {
    if (isAnimatingRef.current) return;
    
    isAnimatingRef.current = true;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Instant switch for reduced motion
      currentContainer.style.display = 'none';
      newContainer.style.display = 'block';
      newContainer.style.opacity = '1';
      isAnimatingRef.current = false;
      onComplete();
      return;
    }

    // Measure heights
    const hFrom = currentContainer.offsetHeight;
    
    // Prepare new container offscreen for measurement
    newContainer.style.position = 'absolute';
    newContainer.style.top = '0';
    newContainer.style.left = '0';
    newContainer.style.width = '100%';
    newContainer.style.display = 'block'; // ensure measurable (was display:none)
    newContainer.style.opacity = '0';
    newContainer.style.pointerEvents = 'none';
    newContainer.style.visibility = 'hidden';
    newContainer.style.height = 'auto';

    // Wait for next frame to measure
    await new Promise(resolve => requestAnimationFrame(resolve));
    const hTo = newContainer.offsetHeight;

    // Create master timeline
    const masterTimeline = gsap.timeline({
      onComplete: () => {
        // Cleanup
        viewportContainer.style.height = 'auto';
        newContainer.style.position = 'relative';
        newContainer.style.visibility = 'visible';
        newContainer.style.pointerEvents = 'auto';
        newContainer.style.display = 'block'; // ensure visible after animation
        currentContainer.style.display = 'none';
        isAnimatingRef.current = false;
        onComplete();
      }
    });

    timelineRef.current = masterTimeline;

    // Phase 1: Exit animation (180-220ms)
    const currentItems = currentContainer.querySelectorAll('.where-to-item');
    
    masterTimeline.to(currentContainer, {
      y: -8,
      opacity: 0,
      duration: 0.2, // 180-220ms
      ease: 'power1.out'
    });

    // Stagger current items exit
    masterTimeline.to(currentItems, {
      opacity: 0,
      duration: 0.15,
      stagger: 0.04, // 0.03-0.05s
      ease: 'power1.out'
    }, '<');

    // Phase 2: Height morph (260-320ms) - starts immediately after exit
    masterTimeline.to(viewportContainer, {
      height: hTo,
      duration: 0.29, // 260-320ms
      ease: 'power1.inOut'
    }, '<');

    // Phase 3: DOM swap at 50% of height animation
    masterTimeline.call(() => {
      currentContainer.style.display = 'none';
      newContainer.style.position = 'relative';
      newContainer.style.visibility = 'visible';
      newContainer.style.pointerEvents = 'auto';
      newContainer.style.display = 'block'; // unhide for enter animation
      newContainer.style.opacity = '0'; // Still hidden for enter animation
    }, [], 0.145); // 50% of height animation

    // Phase 4: Enter animation (360-480ms)
    const newItems = newContainer.querySelectorAll('.where-to-item');
    
    // Set initial states for new container and items
    masterTimeline.set(newContainer, { y: 8, opacity: 0 });
    masterTimeline.set(newItems, { opacity: 0 });
    
    // Animate new container in
    masterTimeline.to(newContainer, {
      y: 0,
      opacity: 1,
      duration: 0.42, // 360-480ms
      ease: 'power2.out'
    }, '-=0.1');

    // Stagger new items with detailed element animations
    newItems.forEach((item, index) => {
      const figure = item.querySelector('.where-to-figure');
      const title = item.querySelector('.where-to-item-title');
      const description = item.querySelector('.where-to-description');

      // Set initial states
      masterTimeline.set(figure, { opacity: 0, scale: 1.05, y: 8 }, '<');
      masterTimeline.set(title, { opacity: 0, y: 12 }, '<');
      masterTimeline.set(description, { opacity: 0, y: 14 }, '<');

      const itemDelay = index * 0.07; // 0.06-0.08s stagger

      // Figure animation
      masterTimeline.to(figure, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.47,
        ease: 'power2.out'
      }, `-=0.32 + ${itemDelay}`);

      // Title animation (60-90ms delay)
      masterTimeline.to(title, {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: 'power2.out'
      }, `-=0.39 + ${itemDelay}`);

      // Description animation (120-150ms delay)
      masterTimeline.to(description, {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: 'power2.out'
      }, `-=0.30 + ${itemDelay}`);
    });

  }, []);

  const cleanup = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    isAnimatingRef.current = false;
  }, []);

  return { switchTab, isAnimating: () => isAnimatingRef.current, cleanup };
};

// Hook for mobile tab scrolling
export const useMobileTabScroll = () => {
  const scrollToActiveTab = useCallback((
    tabsContainer: HTMLElement,
    activeTabKey: TabKey
  ) => {
    const activeButton = tabsContainer.querySelector(
      `[aria-controls="panel-${activeTabKey}"]`
    ) as HTMLElement;
    
    if (!activeButton) return;

    const container = tabsContainer.querySelector('.where-to-tabs-nav') as HTMLElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    
    // Calculate scroll position to center the active tab
    const scrollLeft = activeButton.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2);
    
    // Smooth scroll animation
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth'
    });
  }, []);

  return { scrollToActiveTab };
};
