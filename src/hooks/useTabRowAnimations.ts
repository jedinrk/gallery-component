'use client';

import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type TabKey = 'dine-sip' | 'see-hear' | 'shop-browse' | 'move-play';

// Hook for tab row entrance and centering animations
export const useTabRowAnimations = () => {
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const centeringTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Scroll-linked entrance animation
  const setupEntranceAnimation = useCallback((
    sectionElement: HTMLElement,
    tabsTrackElement: HTMLElement
  ) => {
    if (!sectionElement || !tabsTrackElement) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Set final state immediately for reduced motion
      gsap.set(tabsTrackElement, { x: 0, opacity: 1 });
      // Wait for tabs to be created, then set their opacity
      setTimeout(() => {
        const tabButtons = tabsTrackElement.querySelectorAll('.where-to-tab-large');
        gsap.set(tabButtons, { opacity: 1 });
      }, 100);
      return;
    }

    // Kill existing timeline
    if (entranceTimelineRef.current) {
      entranceTimelineRef.current.kill();
    }

    // Create entrance timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionElement,
        start: 'top 80%', // When section is 20% into viewport
        once: true,
      }
    });

    entranceTimelineRef.current = tl;

    // Set initial states for track
    tl.set(tabsTrackElement, { x: 40, opacity: 0 });

    // Animate track slide-in from +40px with opacity fade
    tl.to(tabsTrackElement, {
      x: 0,
      opacity: 1,
      duration: 0.58, // 500-650ms range
      ease: 'power2.out',
      onComplete: () => {
        // After track animation, animate individual tabs with micro-stagger
        const tabButtons = tabsTrackElement.querySelectorAll('.where-to-tab-large');
        
        if (tabButtons.length > 0) {
          // Set initial opacity for tabs
          gsap.set(tabButtons, { opacity: 0 });
          
          // Stagger tab buttons with micro delays (8-12ms)
          gsap.to(tabButtons, {
            opacity: 1,
            duration: 0.4,
            stagger: 0.01, // 10ms stagger for richness
            ease: 'power2.out'
          });
        }
      }
    });

  }, []);

  // Active-centering slide animation
  const centerActiveTab = useCallback((
    tabsContainer: HTMLElement,
    tabsTrack: HTMLElement,
    activeTabKey: TabKey
  ) => {
    if (!tabsContainer || !tabsTrack) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return; // Skip animation for reduced motion
    }

    // Kill existing centering timeline
    if (centeringTimelineRef.current) {
      centeringTimelineRef.current.kill();
    }

    // Find the active tab button
    const activeButton = tabsTrack.querySelector(
      `[aria-controls="panel-${activeTabKey}"]`
    ) as HTMLElement;

    if (!activeButton) return;

    // Get container and button measurements
    const containerRect = tabsContainer.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const trackRect = tabsTrack.getBoundingClientRect();

    // Calculate current transform
    const currentTransform = gsap.getProperty(tabsTrack, 'x') as number || 0;

    // Calculate target position
    let targetX = 0;

    // Check if we're on mobile (small screens)
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      // Mobile: ensure active tab is visible with small left inset (16-20px)
      const leftInset = 18;
      const buttonLeftRelativeToContainer = buttonRect.left - containerRect.left;
      
      if (buttonLeftRelativeToContainer < leftInset) {
        // Button is too far left, scroll right
        targetX = currentTransform + (leftInset - buttonLeftRelativeToContainer);
      } else if (buttonRect.right > containerRect.right) {
        // Button is cut off on right, scroll left
        const overflow = buttonRect.right - containerRect.right + leftInset;
        targetX = currentTransform - overflow;
      } else {
        // Button is already visible, no need to scroll
        return;
      }
    } else {
      // Desktop: align active label's left edge with container's left inner gutter
      const leftGutter = 32; // Approximate left padding/gutter
      const buttonLeftRelativeToTrack = activeButton.offsetLeft;
      const desiredPosition = leftGutter;
      
      // Calculate how much to move the track
      targetX = -(buttonLeftRelativeToTrack - desiredPosition);
    }

    // Clamp to prevent showing empty space
    const trackWidth = tabsTrack.scrollWidth;
    const containerWidth = tabsContainer.clientWidth;
    const maxTranslate = Math.min(0, containerWidth - trackWidth);
    const minTranslate = 0;

    targetX = Math.max(maxTranslate, Math.min(minTranslate, targetX));

    // Only animate if there's a meaningful change
    if (Math.abs(targetX - currentTransform) < 1) return;

    // Create centering timeline
    const tl = gsap.timeline();
    centeringTimelineRef.current = tl;

    // Animate track to center active tab
    tl.to(tabsTrack, {
      x: targetX,
      duration: 0.26, // 220-300ms range
      ease: 'power2.out'
    });

  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (entranceTimelineRef.current) {
      entranceTimelineRef.current.kill();
      entranceTimelineRef.current = null;
    }
    if (centeringTimelineRef.current) {
      centeringTimelineRef.current.kill();
      centeringTimelineRef.current = null;
    }
  }, []);

  return {
    setupEntranceAnimation,
    centerActiveTab,
    cleanup
  };
};
