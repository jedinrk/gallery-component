'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { gsap } from 'gsap';

type TabKey = 'dine-sip' | 'see-hear' | 'shop-browse' | 'move-play';

interface TabMeasurement {
  width: number;
  offsetLeft: number;
}

interface EndlessScrollState {
  trackX: number;
  isDragging: boolean;
  velocity: number;
  originIndex: number;
}

export const useEndlessTabScroll = (onTabClick?: (tabKey: TabKey) => void) => {
  const trackRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const measurementsRef = useRef<Map<string, TabMeasurement>>(new Map());
  const stateRef = useRef<EndlessScrollState>({
    trackX: 0,
    isDragging: false,
    velocity: 0,
    originIndex: 0
  });
  
  const [isInitialized, setIsInitialized] = useState(false);
  const activeKeyRef = useRef<TabKey | null>(null);
  const centerActiveTabRef = useRef<((key: TabKey) => void) | null>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const segmentWidthRef = useRef<number>(0);
  const wrapThresholdRef = useRef<number>(0);

  // Tab labels in order
  const tabLabels = ['Dine + Sip', 'See + Hear', 'Shop + Browse', 'Move + Play'];
  const tabKeys: TabKey[] = ['dine-sip', 'see-hear', 'shop-browse', 'move-play'];

  // Initialize track with cloned elements
  const initializeTrack = useCallback((container: HTMLElement, track: HTMLElement, onTabClick?: (tabKey: TabKey) => void) => {
    if (!container || !track) return;

    // Clear existing content
    track.innerHTML = '';

    // Handle tab click (allow originals and clones)
    const handleTabClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const tabKey = target.getAttribute('data-tab-key') as TabKey;
      if (tabKey && onTabClick) {
        onTabClick(tabKey);
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tabKey = target.getAttribute('data-tab-key') as TabKey;
      const isOriginal = target.getAttribute('data-original') === 'true';
      
      if (!tabKey || !isOriginal) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (onTabClick) {
          onTabClick(tabKey);
        }
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = tabKeys.indexOf(tabKey);
        let newIndex;
        
        if (e.key === 'ArrowLeft') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabKeys.length - 1;
        } else {
          newIndex = currentIndex < tabKeys.length - 1 ? currentIndex + 1 : 0;
        }
        // Move focus only (do not activate)
        const originals = track.querySelectorAll('[data-original="true"]') as NodeListOf<HTMLElement>;
        const next = originals[newIndex];
        if (next) next.focus();
      }
    };

    // Create original tabs
    const originalTabs = tabLabels.map((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.role = 'tab';
      button.className = 'where-to-tab-large focus-ring';
      button.setAttribute('aria-controls', `panel-${tabKeys[index]}`);
      button.setAttribute('data-tab-key', tabKeys[index]);
      button.setAttribute('data-original', 'true');
      button.id = `tab-${tabKeys[index]}`;
      button.textContent = label;
      
      // Add event listeners
      button.addEventListener('click', handleTabClick);
      button.addEventListener('keydown', handleKeyDown);
      
      return button;
    });

    // Create clones for seamless wrapping (before and after)
    const beforeClones = tabLabels.map((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.role = 'tab';
      button.className = 'where-to-tab-large focus-ring';
      button.setAttribute('aria-controls', `panel-${tabKeys[index]}`);
      button.setAttribute('data-tab-key', tabKeys[index]);
      button.setAttribute('data-clone', 'before');
      button.setAttribute('aria-hidden', 'true');
      button.textContent = label;
      button.tabIndex = -1; // Clones should not be focusable
      // Allow clicking clones to trigger tab switch
      button.addEventListener('click', handleTabClick);
      return button;
    });

    const afterClones = tabLabels.map((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.role = 'tab';
      button.className = 'where-to-tab-large focus-ring';
      button.setAttribute('aria-controls', `panel-${tabKeys[index]}`);
      button.setAttribute('data-tab-key', tabKeys[index]);
      button.setAttribute('data-clone', 'after');
      button.setAttribute('aria-hidden', 'true');
      button.textContent = label;
      button.tabIndex = -1; // Clones should not be focusable
      // Allow clicking clones to trigger tab switch
      button.addEventListener('click', handleTabClick);
      return button;
    });

    // Append in order: before clones, originals, after clones
    [...beforeClones, ...originalTabs, ...afterClones].forEach(tab => {
      track.appendChild(tab);
    });

    // Measure elements after DOM update
    setTimeout(() => {
      measureTrack(track);
      setIsInitialized(true);
    }, 0);

  }, [tabLabels, tabKeys, onTabClick]);

  // Measure track elements and calculate segment width
  const measureTrack = useCallback((track: HTMLElement) => {
    if (!track) return;

    const measurements = new Map<string, TabMeasurement>();
    let totalWidth = 0;
    let maxWidth = 0;

    // Measure original tabs only
    const originalTabs = track.querySelectorAll('[data-original="true"]');
    originalTabs.forEach((tab, index) => {
      const element = tab as HTMLElement;
      const rect = element.getBoundingClientRect();
      const measurement = {
        width: rect.width,
        offsetLeft: element.offsetLeft
      };
      
      measurements.set(tabKeys[index], measurement);
      totalWidth += rect.width;
      maxWidth = Math.max(maxWidth, rect.width);
    });

    // Use computed gap from CSS if available
    const styles = getComputedStyle(track);
    const gapPx = parseFloat((styles as any).gap || (styles as any).columnGap || '0') || (window.innerWidth >= 640 ? 48 : 32);
    const totalGaps = (tabLabels.length - 1) * gapPx;

    segmentWidthRef.current = totalWidth + totalGaps;
    wrapThresholdRef.current = segmentWidthRef.current * 0.5;
    measurementsRef.current = measurements;

  }, [tabKeys, tabLabels.length]);

  // Handle wrap detection and repositioning
  const handleWrapping = useCallback(() => {
    const state = stateRef.current;
    const segmentWidth = segmentWidthRef.current;
    const wrapThreshold = wrapThresholdRef.current;

    if (segmentWidth === 0) return;

    let needsReposition = false;
    let newTrackX = state.trackX;
    let newOriginIndex = state.originIndex;

    // Check if we need to wrap
    if (state.trackX > wrapThreshold) {
      // Wrapped too far right, reposition left
      newTrackX = state.trackX - segmentWidth;
      newOriginIndex = (state.originIndex - 1 + tabLabels.length) % tabLabels.length;
      needsReposition = true;
    } else if (state.trackX < -wrapThreshold) {
      // Wrapped too far left, reposition right
      newTrackX = state.trackX + segmentWidth;
      newOriginIndex = (state.originIndex + 1) % tabLabels.length;
      needsReposition = true;
    }

    if (needsReposition && trackRef.current) {
      // Update state
      stateRef.current.trackX = newTrackX;
      stateRef.current.originIndex = newOriginIndex;

      // Apply transform instantly (no animation for wrapping)
      gsap.set(trackRef.current, { x: newTrackX });
    }

  }, [tabLabels.length]);

  // Inertia animation loop
  const inertiaLoop = useCallback((currentTime: number) => {
    const state = stateRef.current;
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    if (Math.abs(state.velocity) < 0.1) {
      // Velocity too low, stop animation
      state.velocity = 0;
      // Ensure active tab remains in view after momentum stops
      if (centerActiveTabRef.current && activeKeyRef.current) {
        centerActiveTabRef.current(activeKeyRef.current);
      }
      return;
    }

    // Apply friction
    const friction = 0.95;
    state.velocity *= friction;

    // Update position
    state.trackX += state.velocity * (deltaTime / 16); // Normalize to 60fps

    // Apply transform
    if (trackRef.current) {
      gsap.set(trackRef.current, { x: state.trackX });
    }

    // Check for wrapping
    handleWrapping();

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(inertiaLoop);

  }, [handleWrapping]);

  // Start inertia animation
  const startInertia = useCallback((initialVelocity: number) => {
    const state = stateRef.current;
    state.velocity = Math.max(-15, Math.min(15, initialVelocity)); // Cap velocity

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(inertiaLoop);

  }, [inertiaLoop]);

  // Handle mouse/touch drag
  const handleDragStart = useCallback((clientX: number) => {
    const state = stateRef.current;
    state.isDragging = true;
    state.velocity = 0;

    // Cancel any ongoing inertia
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return {
      startX: clientX,
      startTrackX: state.trackX,
      lastX: clientX,
      lastTime: performance.now(),
      velocityTracker: [] as Array<{ x: number; time: number }>
    };

  }, []);

  const handleDragMove = useCallback((
    clientX: number, 
    dragData: { startX: number; startTrackX: number; lastX: number; lastTime: number; velocityTracker: Array<{ x: number; time: number }> }
  ) => {
    const state = stateRef.current;
    if (!state.isDragging || !trackRef.current) return;

    const deltaX = clientX - dragData.startX;
    const newTrackX = dragData.startTrackX + deltaX;

    // Update position
    state.trackX = newTrackX;
    gsap.set(trackRef.current, { x: newTrackX });

    // Track velocity for inertia
    const currentTime = performance.now();
    dragData.velocityTracker.push({ x: clientX, time: currentTime });

    // Keep only recent velocity samples (last 100ms)
    dragData.velocityTracker = dragData.velocityTracker.filter(
      sample => currentTime - sample.time < 100
    );

    dragData.lastX = clientX;
    dragData.lastTime = currentTime;

    // Check for wrapping during drag
    handleWrapping();

  }, [handleWrapping]);

  const handleDragEnd = useCallback((
    dragData: { velocityTracker: Array<{ x: number; time: number }> }
  ) => {
    const state = stateRef.current;
    state.isDragging = false;

    // Calculate velocity from recent samples
    let velocity = 0;
    if (dragData.velocityTracker.length >= 2) {
      const recent = dragData.velocityTracker.slice(-3);
      const totalDelta = recent[recent.length - 1].x - recent[0].x;
      const totalTime = recent[recent.length - 1].time - recent[0].time;
      velocity = totalTime > 0 ? (totalDelta / totalTime) * 16 : 0; // Convert to pixels per frame
    }

    // Start inertia if velocity is significant
    if (Math.abs(velocity) > 0.5) {
      startInertia(velocity);
    } else {
      // If no inertia, ensure active tab remains within viewport anchor
      if (centerActiveTabRef.current && activeKeyRef.current) {
        centerActiveTabRef.current(activeKeyRef.current);
      }
    }

  }, [startInertia]);

  // Handle wheel events
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    const state = stateRef.current;
    if (state.isDragging) return;

    // Apply wheel delta
    const deltaX = event.deltaX || event.deltaY;
    state.trackX -= deltaX;

    if (trackRef.current) {
      gsap.set(trackRef.current, { x: state.trackX });
    }

    // Check for wrapping
    handleWrapping();

    // Start small inertia for smooth feel
    startInertia(-deltaX * 0.1);

  }, [handleWrapping, startInertia]);

  // Center active tab
  const centerActiveTab = useCallback((activeTabKey: TabKey) => {
    if (!trackRef.current || !containerRef.current || !isInitialized) return;

    const container = containerRef.current;
    const track = trackRef.current;
    const measurements = measurementsRef.current;
    const measurement = measurements.get(activeTabKey);

    if (!measurement) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Find the original tab element
    const originalTab = track.querySelector(`[data-original="true"][data-tab-key="${activeTabKey}"]`) as HTMLElement;
    if (!originalTab) return;

    const containerRect = container.getBoundingClientRect();
    const isMobile = window.innerWidth < 640;

    let targetX = 0;

    if (isMobile) {
      // Mobile: ensure active tab is visible with small left inset based on container padding
      const leftInset = parseFloat(getComputedStyle(container).paddingLeft) || 16;
      const buttonRect = originalTab.getBoundingClientRect();
      const buttonLeftRelativeToContainer = buttonRect.left - containerRect.left;
      
      if (buttonLeftRelativeToContainer < leftInset) {
        targetX = stateRef.current.trackX + (leftInset - buttonLeftRelativeToContainer);
      } else if (buttonRect.right > containerRect.right) {
        const overflow = buttonRect.right - containerRect.right + leftInset;
        targetX = stateRef.current.trackX - overflow;
      } else {
        return; // Already visible
      }
    } else {
      // Desktop: align active label's left edge with container's left gutter
      const leftGutter = parseFloat(getComputedStyle(container).paddingLeft) || 0;
      const desiredPosition = leftGutter;
      targetX = -(originalTab.offsetLeft - desiredPosition);
    }

    // Clamp to original segment edges (never reveal empty space)
    const containerStyles = getComputedStyle(container);
    const leftGutter = parseFloat(containerStyles.paddingLeft) || 0;
    const rightGutter = parseFloat(containerStyles.paddingRight) || 0;

    const originals = track.querySelectorAll('[data-original="true"]');
    const firstOriginal = originals[0] as HTMLElement | undefined;
    const lastOriginal = originals[originals.length - 1] as HTMLElement | undefined;

    if (firstOriginal && lastOriginal) {
      const rightmostTranslate = -(firstOriginal.offsetLeft - leftGutter);
      const lastRight = lastOriginal.offsetLeft + lastOriginal.offsetWidth;
      const leftmostTranslate = -(lastRight - (container.clientWidth - rightGutter));
      const minTranslate = Math.min(leftmostTranslate, rightmostTranslate);
      const maxTranslate = Math.max(leftmostTranslate, rightmostTranslate);
      targetX = Math.max(minTranslate, Math.min(maxTranslate, targetX));
    }

    // Only animate if there's meaningful change
    if (Math.abs(targetX - stateRef.current.trackX) < 1) return;

    // Update state
    stateRef.current.trackX = targetX;

    if (prefersReducedMotion) {
      gsap.set(track, { x: targetX });
    } else {
      gsap.to(track, {
        x: targetX,
        duration: 0.26,
        ease: 'power2.out'
      });
    }

  }, [isInitialized]);

  // Keep latest centerActiveTab in a ref so earlier callbacks can use it without order issues
  useEffect(() => {
    centerActiveTabRef.current = centerActiveTab;
  }, [centerActiveTab]);

  // Setup event listeners for wheel/touch/drag with inertia and wrapping
  const setupEventListeners = useCallback((container: HTMLElement, track: HTMLElement) => {
    // Wheel
    const onWheel = (e: WheelEvent) => {
      handleWheel(e);
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    // Mouse drag
    let dragData: ReturnType<typeof handleDragStart> | null = null;

    const onMouseMove = (e: MouseEvent) => {
      if (!dragData) return;
      handleDragMove(e.clientX, dragData);
    };

    const onMouseUp = () => {
      if (!dragData) return;
      handleDragEnd(dragData);
      dragData = null;
      window.removeEventListener('mousemove', onMouseMove);
    };

    const onMouseDown = (e: MouseEvent) => {
      dragData = handleDragStart(e.clientX);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp, { once: true });
    };

    track.addEventListener('mousedown', onMouseDown);

    // Touch drag
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        dragData = handleDragStart(e.touches[0].clientX);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragData || e.touches.length === 0) return;
      e.preventDefault();
      handleDragMove(e.touches[0].clientX, dragData);
    };
    const onTouchEnd = () => {
      if (!dragData) return;
      handleDragEnd(dragData);
      dragData = null;
    };

    track.addEventListener('touchstart', onTouchStart, { passive: false });
    track.addEventListener('touchmove', onTouchMove, { passive: false });
    track.addEventListener('touchend', onTouchEnd);

    // Return cleanup function
    return () => {
      container.removeEventListener('wheel', onWheel as any);
      track.removeEventListener('mousedown', onMouseDown as any);
      window.removeEventListener('mousemove', onMouseMove as any);
      track.removeEventListener('touchstart', onTouchStart as any);
      track.removeEventListener('touchmove', onTouchMove as any);
      track.removeEventListener('touchend', onTouchEnd as any);
    };
  }, [handleWheel, handleDragStart, handleDragMove, handleDragEnd]);

  // Initialize hook
  const initialize = useCallback((container: HTMLElement, track: HTMLElement, onTabClick?: (tabKey: TabKey) => void) => {
    containerRef.current = container;
    trackRef.current = track;

    // Initialize track with provided onTabClick handler (if any)
    initializeTrack(container, track, onTabClick);

    // Setup event listeners after initialization
    const cleanup = setupEventListeners(container, track);

    return cleanup;

  }, [initializeTrack, setupEventListeners]);

  // Re-measure and re-center on resize
  useEffect(() => {
    const onResize = () => {
      if (trackRef.current) {
        measureTrack(trackRef.current);
      }
      if (activeKeyRef.current) {
        centerActiveTab(activeKeyRef.current);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [centerActiveTab, measureTrack]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update active states for all tabs
  const updateActiveStates = useCallback((activeTabKey: TabKey) => {
    if (!trackRef.current) return;

    const allTabs = trackRef.current.querySelectorAll('button[data-tab-key]');
    allTabs.forEach((tab) => {
      const tabElement = tab as HTMLElement;
      const tabKey = tabElement.getAttribute('data-tab-key');
      const isOriginal = tabElement.getAttribute('data-original') === 'true';

      if (isOriginal) {
        if (tabKey === activeTabKey) {
          // Active original tab
          tabElement.classList.add('active');
          tabElement.setAttribute('aria-selected', 'true');
          tabElement.tabIndex = 0;
          tabElement.style.pointerEvents = 'none'; // Non-clickable when active
        } else {
          // Inactive original tabs
          tabElement.classList.remove('active');
          tabElement.setAttribute('aria-selected', 'false');
          tabElement.tabIndex = -1;
          tabElement.style.pointerEvents = 'auto'; // Clickable when inactive
        }
      } else {
        // Always keep clones inactive and unfocusable
        tabElement.classList.remove('active');
        tabElement.setAttribute('aria-selected', 'false');
        tabElement.tabIndex = -1;
      }
    });

    // Track current active key for resize/auto-adjustments
    activeKeyRef.current = activeTabKey;
  }, []);

  return {
    initialize,
    centerActiveTab,
    updateActiveStates,
    isInitialized,
    measureTrack
  };
};
