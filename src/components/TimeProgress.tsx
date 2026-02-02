import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RollingNumber } from './RollingNumber';

gsap.registerPlugin(ScrollTrigger);

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
  // 复制日期以避免修改原日期
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // 设置为最近的周四：当前日期 + 4 - 当前星期几（周日为7）
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  // 获取当年的1月1日
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // 计算周数
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function formatDateCN(now: Date): string {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const weekday = new Intl.DateTimeFormat('zh-CN', { weekday: 'long' }).format(now);
  return `${y}年${m}月${d}日 ${weekday}`;
}

function formatTime(now: Date): string {
  return `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
}

function computeProgress(now: Date): { day: number; month: number; year: number; week: number } {
  const msInDay = 24 * 60 * 60 * 1000;

  const dayStart = startOfDay(now);
  const msIntoDay = now.getTime() - dayStart.getTime();
  const day = clamp(msIntoDay / msInDay, 0, 1);

  // 周进度：以周一为一周的开始，计算本周已过时间
  // 获取当前是周几，周日为0，转为周一为0，周日为6
  const dayOfWeek = now.getDay(); 
  // 将周日从0变为7，方便计算（1-7）
  const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  // 本周已过的完整天数 = isoDay - 1
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

type ProgressRefs = {
    dayBar: HTMLDivElement | null;
    monthBar: HTMLDivElement | null;
    yearBar: HTMLDivElement | null;
    extraDayBar: HTMLDivElement | null;
    extraMonthBar: HTMLDivElement | null;
    weekBar: HTMLDivElement | null;
  };

const TimeProgress: React.FC<{ className?: string }> = ({ className }) => {
  const [now, setNow] = useState<Date>(() => new Date());

  const header = useMemo(() => {
    return {
      dateText: formatDateCN(now),
      timeText: formatTime(now),
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

  const progressRefs = useRef<ProgressRefs>({
    dayBar: null,
    monthBar: null,
    yearBar: null,
    extraDayBar: null,
    extraMonthBar: null,
    weekBar: null
  });

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
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const panels = panelsRef.current.filter(Boolean);
      if (panels.length === 0) return;

      gsap.set(panels, { xPercent: 0 });

      if (prefersReducedMotion) return;

      gsap.fromTo(
        rootEl.querySelectorAll('[data-appear]'),
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.06 }
      );

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${pinEl.clientWidth * (panels.length - 1)}`,
          invalidateOnRefresh: true
        }
      });
    }, rootEl);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const { dayBar, monthBar, yearBar, extraDayBar, extraMonthBar, weekBar } = progressRefs.current;
    if (!dayBar || !monthBar || !yearBar) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const target = {
      day: progress.day,
      month: progress.month,
      year: progress.year,
      week: progress.week
    };

    if (prefersReducedMotion) {
      dayBar.style.transform = `scaleX(${target.day})`;
      monthBar.style.transform = `scaleX(${target.month})`;
      yearBar.style.transform = `scaleX(${target.year})`;
      if (extraDayBar) extraDayBar.style.transform = `scaleX(${target.day})`;
      if (extraMonthBar) extraMonthBar.style.transform = `scaleX(${target.month})`;
      if (weekBar) weekBar.style.transform = `scaleX(${target.week})`;
      return;
    }

    gsap.to(dayBar, { scaleX: target.day, duration: 0.45, ease: 'power2.out' });
    gsap.to(monthBar, { scaleX: target.month, duration: 0.45, ease: 'power2.out' });
    gsap.to(yearBar, { scaleX: target.year, duration: 0.45, ease: 'power2.out' });
    
    if (extraDayBar) gsap.to(extraDayBar, { scaleX: target.day, duration: 0.45, ease: 'power2.out' });
    if (extraMonthBar) gsap.to(extraMonthBar, { scaleX: target.month, duration: 0.45, ease: 'power2.out' });
    if (weekBar) gsap.to(weekBar, { scaleX: target.week, duration: 0.45, ease: 'power2.out' });

  }, [progress.day, progress.month, progress.year, progress.week]);

  return (
    <section ref={rootRef} className={cn('mx-auto max-w-6xl px-4 py-16 md:py-24', className)}>
      <div className="mx-auto max-w-4xl text-center">
      </div>

      <div ref={pinRef} className="mt-12 overflow-hidden border-4 border-[#7C3AED] bg-[#0F0F23] shadow-[8px_8px_0px_#7C3AED] relative">
        <div ref={trackRef} className="flex w-[250%]">
          <div
            ref={el => {
              if (el) panelsRef.current[0] = el;
            }}
            className="w-1/3 shrink-0 p-6 md:p-10 relative"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-lg font-bold text-[#A78BFA] tracking-wider uppercase leading-loose">今天已过去</div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-[#E2E8F0] tabular-nums md:text-4xl drop-shadow-[2px_2px_0px_#7C3AED]">
                  <RollingNumber value={progress.day * 100} className="font-['PressStart2P']" />
                </div>
                <div className="mt-4 text-sm text-[#94A3B8] leading-loose">以当前时间为准</div>
              </div>
              <div className="border-2 border-[#7C3AED] bg-[#1A1A2E] px-4 py-3 text-right shadow-[4px_4px_0px_#7C3AED]">
                <div className="text-xs text-[#A78BFA] uppercase tracking-wider mb-2">当前时间</div>
                <div className="mt-1 text-base font-bold text-[#E2E8F0] tabular-nums">
                  <RollingNumber value={header.timeText} unit="" className="font-['PressStart2P']" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="h-6 w-full overflow-hidden bg-[#1E1E3F] border-2 border-[#7C3AED]">
                <div
                  ref={el => {
                    progressRefs.current.dayBar = el;
                  }}
                  className="h-full origin-left bg-[#F43F5E] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.5)] scale-x-0 relative"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30"></div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-6 text-sm text-[#94A3B8]">
                <div className="border-2 border-[#7C3AED] bg-[#1A1A2E] p-5 shadow-[4px_4px_0px_#7C3AED] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#7C3AED] transition-all duration-200">
                  <div className="text-xs text-[#A78BFA] uppercase tracking-wider mb-3">本年第</div>
                  <div className="mt-2 text-lg font-bold tracking-tight text-[#E2E8F0] tabular-nums">
                    <span className="font-['PressStart2P']">{header.weekNo}</span> <span className="text-xs">周</span>
                  </div>
                </div>
                <div className="border-2 border-[#7C3AED] bg-[#1A1A2E] p-5 shadow-[4px_4px_0px_#7C3AED] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#7C3AED] transition-all duration-200">
                  <div className="text-xs text-[#A78BFA] uppercase tracking-wider mb-3">本周进度</div>
                  <div className="mt-2 text-lg font-bold tracking-tight text-[#E2E8F0] tabular-nums">
                    <RollingNumber value={progress.week * 100} className="font-['PressStart2P']" />
                  </div>
                  <div className="mt-4 h-4 w-full overflow-hidden bg-[#1E1E3F] border-2 border-[#7C3AED]">
                    <div
                      ref={el => {
                        progressRefs.current.weekBar = el;
                      }}
                      className="h-full origin-left bg-[#F43F5E] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.5)] scale-x-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={el => {
              if (el) panelsRef.current[1] = el;
            }}
            className="w-1/3 shrink-0 p-6 md:p-10 relative"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-lg font-bold text-[#A78BFA] tracking-wider uppercase leading-loose">本月已过去</div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-[#E2E8F0] tabular-nums md:text-4xl drop-shadow-[2px_2px_0px_#7C3AED]">
                  <RollingNumber value={progress.month * 100} className="font-['PressStart2P']" />
                </div>
                <div className="mt-4 text-sm text-[#94A3B8] leading-loose">
                  <span className="font-['PressStart2P']">{header.year}</span>年
                  <span className="font-['PressStart2P']">{header.monthIndex + 1}</span>月
                  <span className="font-['PressStart2P']">{header.dayOfMonth}</span>日
                </div>
              </div>
              <div className="border-2 border-[#7C3AED] bg-[#1A1A2E] px-4 py-3 text-right shadow-[4px_4px_0px_#7C3AED]">
                <div className="text-xs text-[#A78BFA] uppercase tracking-wider mb-2">日历</div>
                <div className="mt-1 text-base font-bold text-[#E2E8F0]">
                  <span className="font-['PressStart2P']">{header.monthIndex + 1}</span> 月
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="h-6 w-full overflow-hidden bg-[#1E1E3F] border-2 border-[#7C3AED]">
                <div
                  ref={el => {
                    progressRefs.current.monthBar = el;
                  }}
                  className="h-full origin-left bg-[#F43F5E] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.5)] scale-x-0 relative"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-2 border-[#7C3AED] bg-[#1A1A2E] p-5 md:p-6 shadow-[4px_4px_0px_#7C3AED]">
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-[#A78BFA] font-bold">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
                {monthGrid.map((cell, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {cell.day ? (
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center border-2 text-[#E2E8F0] tabular-nums transition-all duration-200 text-xs',
                          cell.isToday 
                            ? 'bg-[#F43F5E] text-white border-[#F43F5E] shadow-[2px_2px_0px_rgba(0,0,0,0.5)]' 
                            : 'border-transparent hover:border-[#7C3AED] hover:bg-[#7C3AED]/20 cursor-pointer'
                        )}
                      >
                        <span className="font-['PressStart2P']">{cell.day}</span>
                      </div>
                    ) : (
                      <div className="h-8 w-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={el => {
              if (el) panelsRef.current[2] = el;
            }}
            className="w-1/3 shrink-0 p-6 md:p-10 relative"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-lg font-bold text-[#A78BFA] tracking-wider uppercase leading-loose">今年已过去</div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-[#E2E8F0] tabular-nums md:text-4xl drop-shadow-[2px_2px_0px_#7C3AED]">
                  <RollingNumber value={progress.year * 100} className="font-['PressStart2P']" />
                </div>
                <div className="mt-4 text-sm text-[#94A3B8] leading-loose">按自然年累计进度</div>
              </div>
              <div className="border-2 border-[#7C3AED] bg-[#1A1A2E] px-4 py-3 text-right shadow-[4px_4px_0px_#7C3AED]">
                <div className="text-xs text-[#A78BFA] uppercase tracking-wider mb-2">年份</div>
                <div className="mt-1 text-sm font-bold text-[#E2E8F0] tabular-nums">
                  <span className="font-['PressStart2P']">{header.year}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="h-6 w-full overflow-hidden bg-[#1E1E3F] border-2 border-[#7C3AED]">
                <div
                  ref={el => {
                    progressRefs.current.yearBar = el;
                  }}
                  className="h-full origin-left bg-[#F43F5E] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.5)] scale-x-0 relative"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30"></div>
                </div>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="border-2 border-[#7C3AED] bg-[#1A1A2E] p-5 shadow-[4px_4px_0px_#7C3AED] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#7C3AED] transition-all duration-200">
                  <div className="text-xs text-[#A78BFA] uppercase tracking-wider mb-3">月份进度</div>
                  <div className="mt-2 text-lg font-bold tracking-tight text-[#E2E8F0] tabular-nums">
                    <span className="font-['PressStart2P']">{(progress.month * 100).toFixed(1)}%</span>
                  </div>
                  <div className="mt-4 h-4 w-full overflow-hidden bg-[#1E1E3F] border-2 border-[#7C3AED]">
                    <div
                      ref={el => {
                        progressRefs.current.extraMonthBar = el;
                      }}
                      className="h-full origin-left bg-[#F43F5E] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.5)] scale-x-0"
                    />
                  </div>
                </div>
                <div className="border-2 border-[#7C3AED] bg-[#1A1A2E] p-5 shadow-[4px_4px_0px_#7C3AED] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#7C3AED] transition-all duration-200">
                  <div className="text-xs text-[#A78BFA] uppercase tracking-wider mb-3">今日进度</div>
                  <div className="mt-2 text-lg font-bold tracking-tight text-[#E2E8F0] tabular-nums">
                    <span className="font-['PressStart2P']">{(progress.day * 100).toFixed(1)}%</span>
                  </div>
                  <div className="mt-4 h-4 w-full overflow-hidden bg-[#1E1E3F] border-2 border-[#7C3AED]">
                    <div
                      ref={el => {
                        progressRefs.current.extraDayBar = el;
                      }}
                      className="h-full origin-left bg-[#F43F5E] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.5)] scale-x-0"
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
