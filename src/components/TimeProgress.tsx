import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { RollingNumber } from './RollingNumber';

function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(' ');
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function formatDateCN(now: Date): string {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const weekday = new Intl.DateTimeFormat('zh-CN', { weekday: 'long' }).format(now);
  return `${y}年${m}月${d}日 ${weekday}`;
}

function computeProgress(now: Date): { day: number; month: number; year: number; week: number } {
  const msInDay = 24 * 60 * 60 * 1000;
  const dayStart = startOfDay(now);
  const msIntoDay = now.getTime() - dayStart.getTime();
  const day = clamp(msIntoDay / msInDay, 0, 1);

  const dayOfWeek = now.getDay();
  const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  const daysIntoWeek = isoDay - 1;
  const msIntoWeek = daysIntoWeek * msInDay + msIntoDay;
  const msInWeek = 7 * msInDay;
  const week = clamp(msIntoWeek / msInWeek, 0, 1);

  const monthStart = startOfMonth(now);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const msIntoMonth = now.getTime() - monthStart.getTime();
  const msInMonth = nextMonthStart.getTime() - monthStart.getTime();
  const month = clamp(msIntoMonth / msInMonth, 0, 1);

  const yearStart = startOfYear(now);
  const nextYearStart = new Date(now.getFullYear() + 1, 0, 1);
  const msIntoYear = now.getTime() - yearStart.getTime();
  const msInYear = nextYearStart.getTime() - yearStart.getTime();
  const year = clamp(msIntoYear / msInYear, 0, 1);

  return { day, month, year, week };
}

function buildMonthGrid(now: Date): Array<{ day: number | null; isToday: boolean }> {
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalDays = daysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  const cells: Array<{ day: number | null; isToday: boolean }> = [];
  for (let i = 0; i < firstDay; i += 1) {
    cells.push({ day: null, isToday: false });
  }
  for (let d = 1; d <= totalDays; d += 1) {
    cells.push({ day: d, isToday: d === now.getDate() });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, isToday: false });
  }
  while (cells.length < 42) {
    cells.push({ day: null, isToday: false });
  }
  return cells;
}

const TimeProgress: React.FC<{ className?: string }> = ({ className }) => {
  const [now, setNow] = useState<Date>(() => new Date());

  const header = useMemo(() => {
    return {
      dateText: formatDateCN(now),
      year: now.getFullYear(),
      monthIndex: now.getMonth(),
      dayOfMonth: now.getDate(),
      weekNo: getWeekNumber(now)
    };
  }, [now]);

  const progress = useMemo(() => computeProgress(now), [now]);
  const monthGrid = useMemo(() => buildMonthGrid(now), [now]);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activePanel, setActivePanel] = useState(0);

  const tabs = ['今日', '本月', '今年'] as const;

  const scrollToPanel = useCallback((index: number) => {
    const scroller = pinRef.current;
    if (scroller) {
      scroller.scrollTo({ left: scroller.clientWidth * index, behavior: 'smooth' });
    }
  }, []);

  // Track active panel from scroll position
  useEffect(() => {
    const scroller = pinRef.current;
    if (!scroller) return;
    const handleScroll = () => {
      const w = scroller.clientWidth;
      if (w <= 0) return;
      const idx = Math.round(scroller.scrollLeft / w);
      setActivePanel(clamp(idx, 0, 2));
    };
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    const pinEl = pinRef.current;
    const trackEl = trackRef.current;
    if (!rootEl || !pinEl || !trackEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const panels = panelsRef.current.filter(Boolean);
    if (panels.length === 0) return;

    // Simple entrance reveal
    const appearEls = rootEl.querySelectorAll('[data-appear]');
    appearEls.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = '0';
      htmlEl.style.transform = 'translateY(10px)';
      setTimeout(() => {
        htmlEl.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        htmlEl.style.opacity = '1';
        htmlEl.style.transform = 'translateY(0)';
      }, i * 60);
    });
  }, []);

  return (
    <section ref={rootRef} className={cn('mx-auto max-w-content px-4 py-16 md:py-24', className)}>
      <div className="mx-auto max-w-4xl text-center" />

      {/* Tab indicators */}
      <div className="mt-12 flex items-center justify-center">
        <div
          className="relative inline-flex items-center"
          style={{ borderBottom: '1px solid #E5DFD6' }}
        >
          {/* Sliding indicator */}
          <div
            className="absolute bottom-0 h-[2px] transition-all duration-300"
            style={{
              backgroundColor: '#D45D4A',
              left: `${(activePanel / 3) * 100}%`,
              width: `${100 / 3}%`,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {tabs.map((label, i) => (
            <button
              key={label}
              ref={el => { tabRefs.current[i] = el; }}
              type="button"
              onClick={() => scrollToPanel(i)}
              className="relative px-8 py-3 text-sm font-medium transition-colors duration-200"
              style={{
                color: activePanel === i ? '#2C3639' : '#7A7A72',
                fontFamily: activePanel === i ? "'Instrument Serif', 'Noto Serif SC', serif" : undefined,
                fontSize: activePanel === i ? '1.05rem' : undefined,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={pinRef}
        className="mt-2 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ borderBottom: '1px solid #E5DFD6', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div ref={trackRef} className="flex w-[300%]">
          {/* Panel 1: Day */}
          <div
            ref={el => { if (el) panelsRef.current[0] = el; }}
            className="w-1/3 shrink-0 snap-center p-8 md:p-12 relative"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="font-mono text-xs tracking-[0.15em] uppercase text-muted mb-2">今天已过去</div>
                <div className="font-display text-4xl md:text-5xl text-primary flex items-baseline gap-1">
                  <RollingNumber value={progress.day * 100} unit="" className="" />
                  <span className="text-2xl text-muted font-light font-body">%</span>
                </div>
                <div className="mt-3 text-sm text-muted font-light">以当前时间为准</div>
              </div>
              <div className="px-5 py-4 text-right" style={{ borderLeft: '1px solid #E5DFD6' }}>
                <div className="text-xs text-muted uppercase tracking-wider mb-1">当前时间</div>
                <div className="font-mono text-xl text-primary tabular-nums tracking-widest">
                  {pad2(now.getHours())}:{pad2(now.getMinutes())}:{pad2(now.getSeconds())}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="h-2 w-full overflow-hidden" style={{ backgroundColor: '#E5DFD6' }}>
                <div
                  className="h-full origin-left transition-transform duration-500 ease-out"
                  style={{
                    backgroundColor: '#D45D4A',
                    transform: `scaleX(${progress.day})`,
                  }}
                />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="p-6" style={{ borderLeft: '1px solid #E5DFD6' }}>
                  <div className="text-xs text-muted uppercase tracking-wider mb-2">本年第</div>
                  <div className="font-display text-3xl text-primary flex items-baseline gap-1">
                    <span>{header.weekNo}</span> <span className="text-sm text-muted font-body">周</span>
                  </div>
                </div>
                <div className="p-6" style={{ borderLeft: '1px solid #E5DFD6' }}>
                  <div className="text-xs text-muted uppercase tracking-wider mb-2">本周进度</div>
                  <div className="font-display text-3xl text-primary flex items-baseline gap-1">
                    <RollingNumber value={progress.week * 100} unit="" className="" />
                    <span className="text-sm text-muted font-body">%</span>
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden" style={{ backgroundColor: '#E5DFD6' }}>
                    <div
                      className="h-full origin-left transition-transform duration-500 ease-out"
                      style={{
                        backgroundColor: '#D45D4A',
                        transform: `scaleX(${progress.week})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Month */}
          <div
            ref={el => { if (el) panelsRef.current[1] = el; }}
            className="w-1/3 shrink-0 snap-center p-8 md:p-12 relative"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="font-mono text-xs tracking-[0.15em] uppercase text-muted mb-2">本月已过去</div>
                <div className="font-display text-4xl md:text-5xl text-primary flex items-baseline gap-1">
                  <RollingNumber value={progress.month * 100} unit="" className="" />
                  <span className="text-2xl text-muted font-light font-body">%</span>
                </div>
                <div className="mt-3 text-sm text-muted font-light flex items-center gap-2">
                  <span className="font-medium text-primary">{header.year}</span>年
                  <span className="font-medium text-primary">{header.monthIndex + 1}</span>月
                  <span className="font-medium text-primary">{header.dayOfMonth}</span>日
                </div>
              </div>
              <div className="px-5 py-4 text-right" style={{ borderLeft: '1px solid #E5DFD6' }}>
                <div className="text-xs text-muted uppercase tracking-wider mb-1">日历</div>
                <div className="font-display text-xl text-primary">
                  <span>{header.monthIndex + 1}</span> <span className="text-base font-body">月</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="h-2 w-full overflow-hidden" style={{ backgroundColor: '#E5DFD6' }}>
                <div
                  className="h-full origin-left transition-transform duration-500 ease-out"
                  style={{
                    backgroundColor: '#4A6B5F',
                    transform: `scaleX(${progress.month})`,
                  }}
                />
              </div>
            </div>

            <div className="mt-8 p-6 md:p-8" style={{ borderLeft: '1px solid #E5DFD6' }}>
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted font-medium mb-4">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-sm font-mono tracking-wider">
                {monthGrid.map((cell, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {cell.day ? (
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center tabular-nums transition-colors duration-200',
                          cell.isToday
                            ? 'text-paper font-bold'
                            : 'text-primary hover:text-accent cursor-pointer'
                        )}
                        style={cell.isToday ? { backgroundColor: '#D45D4A' } : {}}
                      >
                        <span>{cell.day}</span>
                      </div>
                    ) : (
                      <div className="h-8 w-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 3: Year */}
          <div
            ref={el => { if (el) panelsRef.current[2] = el; }}
            className="w-1/3 shrink-0 snap-center p-8 md:p-12 relative"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="font-mono text-xs tracking-[0.15em] uppercase text-muted mb-2">今年已过去</div>
                <div className="font-display text-4xl md:text-5xl text-primary flex items-baseline gap-1">
                  <RollingNumber value={progress.year * 100} unit="" className="" />
                  <span className="text-2xl text-muted font-light font-body">%</span>
                </div>
                <div className="mt-3 text-sm text-muted font-light">按自然年累计进度</div>
              </div>
              <div className="px-5 py-4 text-right" style={{ borderLeft: '1px solid #E5DFD6' }}>
                <div className="text-xs text-muted uppercase tracking-wider mb-1">年份</div>
                <div className="font-display text-xl text-primary">
                  <span>{header.year}</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="h-2 w-full overflow-hidden" style={{ backgroundColor: '#E5DFD6' }}>
                <div
                  className="h-full origin-left transition-transform duration-500 ease-out"
                  style={{
                    backgroundColor: '#2C3639',
                    transform: `scaleX(${progress.year})`,
                  }}
                />
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="p-6" style={{ borderLeft: '1px solid #E5DFD6' }}>
                  <div className="text-xs text-muted uppercase tracking-wider mb-2">月份进度</div>
                  <div className="font-display text-3xl text-primary flex items-baseline gap-1">
                    <span>{(progress.month * 100).toFixed(1)}</span>
                    <span className="text-sm text-muted font-body">%</span>
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden" style={{ backgroundColor: '#E5DFD6' }}>
                    <div
                      className="h-full origin-left transition-transform duration-500 ease-out"
                      style={{
                        backgroundColor: '#4A6B5F',
                        transform: `scaleX(${progress.month})`,
                      }}
                    />
                  </div>
                </div>
                <div className="p-6" style={{ borderLeft: '1px solid #E5DFD6' }}>
                  <div className="text-xs text-muted uppercase tracking-wider mb-2">今日进度</div>
                  <div className="font-display text-3xl text-primary flex items-baseline gap-1">
                    <span>{(progress.day * 100).toFixed(1)}</span>
                    <span className="text-sm text-muted font-body">%</span>
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden" style={{ backgroundColor: '#E5DFD6' }}>
                    <div
                      className="h-full origin-left transition-transform duration-500 ease-out"
                      style={{
                        backgroundColor: '#D45D4A',
                        transform: `scaleX(${progress.day})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeProgress;