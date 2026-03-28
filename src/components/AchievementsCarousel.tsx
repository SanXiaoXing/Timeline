import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import type { Achievement } from '../contents/achievements';
import AchievementCard from './AchievementCard';

const AchievementsCarousel: React.FC<{ initialAchievements: Achievement[] }> = ({ initialAchievements }) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const stateRef = useRef<{ x: number; singleWidth: number; wrap: ((v: number) => number) | null }>({
    x: 0,
    singleWidth: 0,
    wrap: null
  });

  const unlocked = useMemo(() => initialAchievements.filter(a => a.unlocked), [initialAchievements]);

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
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-4xl">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Achievements</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 md:text-base font-light">
            Recent milestones and accomplishments.
          </p>
        </div>
        <a
          href="/achievements"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/10 hover:text-zinc-100 backdrop-blur-sm"
        >
          View All
          <svg className="h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      <div
        ref={viewportRef}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
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
