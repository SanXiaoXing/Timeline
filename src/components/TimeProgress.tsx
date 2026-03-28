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

      gsap.to(trackEl, {
        x: () => -(trackEl.scrollWidth - pinEl.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          pin: true,
          scrub: 1,
          start: 'center center',
          end: () => `+=${(trackEl.scrollWidth - pinEl.clientWidth) * 1.5}`,
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

      <div ref={pinRef} className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/30 backdrop-blur-md relative shadow-2xl">
        <div ref={trackRef} className="flex w-[250%]">
          <div
            ref={el => {
              if (el) panelsRef.current[0] = el;
            }}
            className="w-1/3 shrink-0 p-8 md:p-12 relative"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-2xl font-semibold text-indigo-400 tracking-wider uppercase mb-2">今天已过去</div>
                <div className="text-4xl font-bold tracking-tight text-zinc-100 tabular-nums md:text-5xl flex items-baseline gap-1 [font-family:'Emblema_One']">
                  <RollingNumber value={progress.day * 100} unit="" className="" />
                  <span className="text-2xl text-zinc-500 font-light font-sans">%</span>
                </div>
                <div className="mt-3 text-sm text-zinc-400 font-light">以当前时间为准</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-right backdrop-blur-sm">
                <div className="text-[15px] text-zinc-500 uppercase tracking-wider mb-1">当前时间</div>
                <div className="text-xl font-semibold text-zinc-200 tabular-nums tracking-widest [font-family:'Emblema_One']">
                  <RollingNumber value={header.timeText} unit="" className="" />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="h-4 w-full rounded-full overflow-hidden bg-zinc-800/50 border border-white/5 shadow-inner">
                <div
                  ref={el => {
                    progressRefs.current.dayBar = el;
                  }}
                  className="h-full origin-left bg-gradient-to-r from-indigo-500 to-cyan-400 scale-x-0 relative"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30"></div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10">
                  <div className="text-[15px] text-zinc-500 uppercase tracking-wider mb-2">本年第</div>
                  <div className="text-3xl font-bold tracking-tight text-zinc-200 tabular-nums flex items-baseline gap-1 [font-family:'Emblema_One']">
                    <span>{header.weekNo}</span> <span className="text-sm text-zinc-500 font-normal font-sans">周</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10">
                  <div className="text-[15px] text-zinc-500 uppercase tracking-wider mb-2">本周进度</div>
                  <div className="text-3xl font-bold tracking-tight text-zinc-200 tabular-nums flex items-baseline gap-1 [font-family:'Emblema_One']">
                    <RollingNumber value={progress.week * 100} unit="" className="" />
                    <span className="text-sm text-zinc-500 font-normal font-sans">%</span>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full overflow-hidden bg-zinc-800/50">
                    <div
                      ref={el => {
                        progressRefs.current.weekBar = el;
                      }}
                      className="h-full origin-left bg-indigo-400 scale-x-0"
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
            className="w-1/3 shrink-0 p-8 md:p-12 relative"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-2xl font-semibold text-cyan-400 tracking-wider uppercase mb-2">本月已过去</div>
                <div className="text-4xl font-bold tracking-tight text-zinc-100 tabular-nums md:text-5xl flex items-baseline gap-1 [font-family:'Emblema_One']">
                  <RollingNumber value={progress.month * 100} unit="" className="" />
                  <span className="text-2xl text-zinc-500 font-light font-sans">%</span>
                </div>
                <div className="mt-3 text-sm text-zinc-400 font-light flex items-center gap-2">
                  <span className="font-medium text-zinc-300 [font-family:'Emblema_One'] tracking-widest">{header.year}</span>年
                  <span className="font-medium text-zinc-300 [font-family:'Emblema_One'] tracking-widest">{header.monthIndex + 1}</span>月
                  <span className="font-medium text-zinc-300 [font-family:'Emblema_One'] tracking-widest">{header.dayOfMonth}</span>日
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-right backdrop-blur-sm">
                <div className="text-[15px] text-zinc-500 uppercase tracking-wider mb-1">日历</div>
                <div className="text-xl font-semibold text-zinc-200 [font-family:'Emblema_One'] tracking-widest">
                  <span>{header.monthIndex + 1}</span> <span className="text-base font-sans font-normal">月</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="h-4 w-full rounded-full overflow-hidden bg-zinc-800/50 border border-white/5 shadow-inner">
                <div
                  ref={el => {
                    progressRefs.current.monthBar = el;
                  }}
                  className="h-full origin-left bg-gradient-to-r from-cyan-500 to-emerald-400 scale-x-0 relative"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/5 bg-white/5 p-6 md:p-8">
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-zinc-500 font-medium mb-4">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-sm [font-family:'Emblema_One'] tracking-wider">
                {monthGrid.map((cell, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {cell.day ? (
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full tabular-nums transition-all duration-300',
                          cell.isToday 
                            ? 'bg-cyan-500 text-zinc-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                            : 'text-zinc-400 hover:bg-white/10 hover:text-zinc-200 cursor-pointer'
                        )}
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

          <div
            ref={el => {
              if (el) panelsRef.current[2] = el;
            }}
            className="w-1/3 shrink-0 p-8 md:p-12 relative"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-2xl font-semibold text-emerald-400 tracking-wider uppercase mb-2">今年已过去</div>
                <div className="text-4xl font-bold tracking-tight text-zinc-100 tabular-nums md:text-5xl flex items-baseline gap-1 [font-family:'Emblema_One']">
                  <RollingNumber value={progress.year * 100} unit="" className="" />
                  <span className="text-2xl text-zinc-500 font-light font-sans">%</span>
                </div>
                <div className="mt-3 text-sm text-zinc-400 font-light">按自然年累计进度</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-right backdrop-blur-sm">
                <div className="text-[15px] text-zinc-500 uppercase tracking-wider mb-1">年份</div>
                <div className="text-xl font-semibold text-zinc-200 tabular-nums [font-family:'Emblema_One'] tracking-widest">
                  <span>{header.year}</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="h-4 w-full rounded-full overflow-hidden bg-zinc-800/50 border border-white/5 shadow-inner">
                <div
                  ref={el => {
                    progressRefs.current.yearBar = el;
                  }}
                  className="h-full origin-left bg-gradient-to-r from-emerald-500 to-teal-400 scale-x-0 relative"
                >
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30"></div>
                </div>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10">
                  <div className="text-[15px] text-zinc-500 uppercase tracking-wider mb-2">月份进度</div>
                  <div className="text-3xl font-bold tracking-tight text-zinc-200 tabular-nums flex items-baseline gap-1 [font-family:'Emblema_One']">
                    <span>{(progress.month * 100).toFixed(1)}</span>
                    <span className="text-sm text-zinc-500 font-normal font-sans">%</span>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full overflow-hidden bg-zinc-800/50">
                    <div
                      ref={el => {
                        progressRefs.current.extraMonthBar = el;
                      }}
                      className="h-full origin-left bg-cyan-500 scale-x-0"
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10">
                  <div className="text-[15px] text-zinc-500 uppercase tracking-wider mb-2">今日进度</div>
                  <div className="text-3xl font-bold tracking-tight text-zinc-200 tabular-nums flex items-baseline gap-1 [font-family:'Emblema_One']">
                    <span>{(progress.day * 100).toFixed(1)}</span>
                    <span className="text-sm text-zinc-500 font-normal font-sans">%</span>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full overflow-hidden bg-zinc-800/50">
                    <div
                      ref={el => {
                        progressRefs.current.extraDayBar = el;
                      }}
                      className="h-full origin-left bg-indigo-500 scale-x-0"
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
