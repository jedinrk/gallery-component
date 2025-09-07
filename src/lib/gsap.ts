import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation configurations
export const animations = {
  // Gallery title animation
  titleReveal: {
    duration: 1.2,
    ease: 'power3.out',
    y: 100,
    opacity: 0,
  },

  // Filter tabs animation
  tabsReveal: {
    duration: 0.8,
    ease: 'power2.out',
    y: 30,
    opacity: 0,
    stagger: 0.1,
  },

  // Gallery items animation
  itemsReveal: {
    duration: 0.6,
    ease: 'power2.out',
    y: 50,
    opacity: 0,
    stagger: 0.05,
  },

  // Filter transition
  filterTransition: {
    duration: 0.4,
    ease: 'power2.inOut',
  },

  // Hover animations
  itemHover: {
    duration: 0.3,
    ease: 'power2.out',
    scale: 1.02,
    y: -5,
  },

  // Loading animation
  loading: {
    duration: 1,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
  },
};

// Animation functions
export const animateTitle = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    animations.titleReveal,
    {
      y: 0,
      opacity: 1,
      duration: animations.titleReveal.duration,
      ease: animations.titleReveal.ease,
    }
  );
};

export const animateTabs = (elements: HTMLElement[]) => {
  gsap.fromTo(
    elements,
    animations.tabsReveal,
    {
      y: 0,
      opacity: 1,
      duration: animations.tabsReveal.duration,
      ease: animations.tabsReveal.ease,
      stagger: animations.tabsReveal.stagger,
    }
  );
};

export const animateGalleryItems = (elements: HTMLElement[]) => {
  gsap.fromTo(
    elements,
    animations.itemsReveal,
    {
      y: 0,
      opacity: 1,
      duration: animations.itemsReveal.duration,
      ease: animations.itemsReveal.ease,
      stagger: animations.itemsReveal.stagger,
    }
  );
};

export const animateFilterChange = (
  outElements: HTMLElement[],
  inElements: HTMLElement[]
) => {
  const tl = gsap.timeline();

  // Animate out current items
  tl.to(outElements, {
    opacity: 0,
    y: -20,
    duration: animations.filterTransition.duration / 2,
    ease: animations.filterTransition.ease,
    stagger: 0.02,
  });

  // Animate in new items
  tl.fromTo(
    inElements,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: animations.filterTransition.duration,
      ease: animations.filterTransition.ease,
      stagger: 0.03,
    },
    '-=0.1'
  );

  return tl;
};

export const setupScrollTriggers = () => {
  if (typeof window === 'undefined') return;

  // Refresh ScrollTrigger on window resize
  ScrollTrigger.addEventListener('refresh', () => {
    ScrollTrigger.refresh();
  });

  // Gallery items scroll animation
  gsap.utils.toArray('.gallery-item').forEach((item: any, index) => {
    gsap.fromTo(
      item,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
        delay: index * 0.05,
      }
    );
  });
};

export const cleanupScrollTriggers = () => {
  if (typeof window !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
};

// Utility function to create hover animations
export const createHoverAnimation = (element: HTMLElement) => {
  const hoverTl = gsap.timeline({ paused: true });

  hoverTl.to(element, {
    scale: animations.itemHover.scale,
    y: animations.itemHover.y,
    duration: animations.itemHover.duration,
    ease: animations.itemHover.ease,
  });

  return {
    play: () => hoverTl.play(),
    reverse: () => hoverTl.reverse(),
  };
};

// Loading animation
export const createLoadingAnimation = (element: HTMLElement) => {
  return gsap.to(element, {
    opacity: 0.5,
    duration: animations.loading.duration,
    ease: animations.loading.ease,
    repeat: animations.loading.repeat,
    yoyo: animations.loading.yoyo,
  });
};
