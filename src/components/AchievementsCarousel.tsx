import React, { useLayoutEffect, useMemo, useRef } from 'react';
import type { Achievement } from './AchievementCard';
import AchievementCard from './AchievementCard';

const AchievementsCarousel: React.FC<{ initialAchievements: Achievement[] }> = ({ initialAchievements }) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const animRef = useRef<number | null>(null);
  const xRef = useRef(0);
  const widthRef = useRef(0);

  const unlocked = useMemo(() => initialAchievements.filter(a => a.unlocked), [initialAchievements]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const first = firstSetRef.current;
    if (!track || !first) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const measure = () => {
      const rect = first.getBoundingClientRect();
      widthRef.current = rect.width;
      xRef.current = 0;
      track.style.transform = 'translateX(0)';
    };
    measure();
    window.addEventListener('resize', measure);

    let lastTime = 0;
    const speed = 0.04; // px per ms

    const tick = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;
      if (pausedRef.current || widthRef.current <= 0) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }

      xRef.current -= speed * dt;
      if (xRef.current <= -widthRef.current) {
        xRef.current += widthRef.current;
      }
      track.style.transform = `translateX(${xRef.current}px)`;
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', measure);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  if (unlocked.length === 0) return null;

  return (
    <section className="mx-auto max-w-content px-4 py-16 md:py-24">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl md:text-4xl text-primary font-normal leading-[1.2]">
            最新成就
          </h2>
          <p className="mt-2 text-sm text-muted">
            最近的里程碑与成就。
          </p>
        </div>
        <a
          href="/achievements"
          className="group inline-flex items-center gap-2 text-sm text-muted hover:text-link transition-colors duration-200"
        >
          查看全部
          <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      <div
        ref={viewportRef}
        className="relative overflow-hidden"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-[2]"
          style={{ background: 'linear-gradient(to right, #F6F2EB, transparent)' }}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-[2]"
          style={{ background: 'linear-gradient(to left, #F6F2EB, transparent)' }}
        />

        <div className="py-5">
          <div ref={trackRef} className="flex w-max items-stretch" style={{ willChange: 'transform' }}>
            <div ref={firstSetRef} className="flex items-stretch gap-4 pr-4">
              {unlocked.map(a => (
                <div key={a.id} className="w-[320px] md:w-[360px] lg:w-[400px] shrink-0">
                  <AchievementCard achievement={a} />
                </div>
              ))}
            </div>
            <div className="flex items-stretch gap-4 pr-4" aria-hidden="true">
              {unlocked.map(a => (
                <div key={`${a.id}-dup`} className="w-[320px] md:w-[360px] lg:w-[400px] shrink-0">
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