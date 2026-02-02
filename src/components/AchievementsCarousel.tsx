import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { achievements } from '../contents/achievements';
import AchievementCard from './AchievementCard';

const AchievementsCarousel: React.FC = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const stateRef = useRef<{ x: number; singleWidth: number; wrap: ((v: number) => number) | null }>({
    x: 0,
    singleWidth: 0,
    wrap: null
  });

  const unlocked = useMemo(() => achievements.filter(a => a.unlocked), []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const setX = gsap.quickSetter(track, 'x', 'px');
    const measure = () => {
      const first = firstSetRef.current;
      if (!first) return;
      const rect = first.getBoundingClientRect();
      const width = rect.width;
      if (!Number.isFinite(width) || width <= 0) return;
      const wrap = gsap.utils.wrap(-width, 0);
      stateRef.current.singleWidth = width;
      stateRef.current.wrap = wrap;
      stateRef.current.x = wrap(stateRef.current.x);
      setX(stateRef.current.x);
    };

    gsap.set(track, { x: 0, force3D: true });
    stateRef.current.x = 0;
    measure();
    window.addEventListener('resize', measure);

    let lastTime = 0;
    const speed = 70;
    const tick = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;
      if (pausedRef.current) return;

      const { singleWidth, wrap } = stateRef.current;
      if (!wrap || singleWidth <= 0) return;
      stateRef.current.x = wrap(stateRef.current.x - speed * dt);
      setX(stateRef.current.x);
    };
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('resize', measure);
      gsap.ticker.remove(tick);
    };
  }, []);

  if (unlocked.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 border-2 border-[#7C3AED] bg-[#0B0B1A] px-3 py-2 shadow-[4px_4px_0px_#7C3AED]">
            <span className="font-['PressStart2P'] text-[12px] text-[#A78BFA]">UNLOCKED</span>
            <span className="text-[#94A3B8] text-[12px]">已完成成就</span>
          </div>
          <div className="mt-4 text-xl md:text-2xl font-bold text-[#E2E8F0]">
            <span className="font-['PressStart2P']">Achievement</span> Carousel
          </div>
        </div>
        <a
          href="/achievements"
          className="inline-flex items-center justify-center border-2 border-[#F43F5E] bg-[#0B0B1A] px-4 py-3 text-[#E2E8F0] shadow-[4px_4px_0px_rgba(244,63,94,0.55)] transition-transform duration-200 hover:-translate-y-[2px]"
        >
          <span className="font-['PressStart2P'] text-[12px]">进入成就页</span>
        </a>
      </div>

      <div
        ref={viewportRef}
        className="mt-6 relative overflow-hidden border-4 border-[#7C3AED] bg-[#0B0B1A] shadow-[8px_8px_0px_#7C3AED]"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0B0B1A] to-transparent z-[2]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0B0B1A] to-transparent z-[2]" />

        <div className="py-5">
          <div ref={trackRef} className="flex w-max items-stretch px-5">
            <div ref={firstSetRef} className="flex items-stretch gap-4 pr-4">
              {unlocked.map(a => (
                <div key={a.id} className="w-[320px] md:w-[360px] lg:w-[405px] xl:w-[420px] shrink-0">
                  <AchievementCard achievement={a} />
                </div>
              ))}
            </div>
            <div className="flex items-stretch gap-4 pr-4" aria-hidden="true">
              {unlocked.map(a => (
                <div key={`${a.id}-dup`} className="w-[320px] md:w-[360px] lg:w-[405px] xl:w-[420px] shrink-0">
                  <AchievementCard achievement={a} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsCarousel;
