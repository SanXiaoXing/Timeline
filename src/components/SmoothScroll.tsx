import React, { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SmoothScroll: React.FC = () => {
  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const w = window as unknown as { __gsapScrollSmoother?: ScrollSmoother };
    if (w.__gsapScrollSmoother) return;

    const wrapper = document.querySelector('#smooth-wrapper');
    const content = document.querySelector('#smooth-content');
    if (!wrapper || !content) return;

    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.1,
      effects: true,
      normalizeScroll: true,
      smoothTouch: 0.08
    });

    w.__gsapScrollSmoother = smoother;
    ScrollTrigger.refresh(true);

    return () => {
      smoother.kill();
      delete w.__gsapScrollSmoother;
    };
  }, []);

  return null;
};

export default SmoothScroll;
