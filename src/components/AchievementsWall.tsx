import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AchievementCard from './AchievementCard';
import type { Achievement, AchievementCategory } from '../contents/achievements';
import { achievementCategoryLabels } from '../contents/achievements';

type StatusFilter = 'all' | 'unlocked' | 'locked';

const categories: Array<{ key: 'all' | AchievementCategory; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'life', label: achievementCategoryLabels.life },
  { key: 'study', label: achievementCategoryLabels.study },
  { key: 'career', label: achievementCategoryLabels.career },
  { key: 'skill', label: achievementCategoryLabels.skill },
  { key: 'mindset', label: achievementCategoryLabels.mindset }
];

const AchievementsWall: React.FC<{ initialAchievements: Achievement[] }> = ({ initialAchievements }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | AchievementCategory>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [achievements] = useState<Achievement[]>(initialAchievements);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('[data-achievement-id]')) as HTMLElement[];
    gsap.killTweensOf(cards);
    gsap.set(cards, { opacity: 0, y: 10 });
    gsap.to(cards, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.04 });
  }, [activeCategory, statusFilter]);

  const filtered = useMemo(() => {
    const byCategory =
      activeCategory === 'all' ? achievements : achievements.filter(a => a.category.includes(activeCategory));
    if (statusFilter === 'all') return byCategory;
    if (statusFilter === 'unlocked') return byCategory.filter(a => a.unlocked);
    return byCategory.filter(a => !a.unlocked);
  }, [achievements, activeCategory, statusFilter]);

  const stats = useMemo(() => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.unlocked).length;
    const legendary = achievements.filter(a => a.rarity === 'legendary').length;
    const epic = achievements.filter(a => a.rarity === 'epic').length;
    return { total, unlocked, legendary, epic };
  }, [achievements]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:pt-32">
      {/* Back Button */}
      <div className="mb-8 md:mb-12">
        <a 
          href="/" 
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/40 border border-white/10 text-zinc-400 hover:text-indigo-200 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden"
        >
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(99,102,241,0.2)_inset] pointer-events-none rounded-full"></div>
          
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium tracking-wide relative z-10">返回首页</span>
        </a>
      </div>

      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-zinc-100 tracking-tight">
              成就记录
            </h1>
            <p className="mt-4 text-zinc-400 text-base md:text-lg leading-relaxed font-light">
              记录生活、工作与学习中的每一个重要里程碑。<br className="hidden md:block" />
              未解锁的成就将保持隐匿状态，等待在未来的某一刻被点亮。
            </p>
          </div>

          <div className="flex items-center gap-8 md:gap-12 pb-2">
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-light text-zinc-100 tracking-tight tabular-nums">
                {stats.unlocked}<span className="text-lg md:text-xl text-zinc-600 font-normal">/{stats.total}</span>
              </span>
              <span className="text-xs text-zinc-500 mt-2 font-medium tracking-wider uppercase">已解锁</span>
            </div>
            <div className="w-px h-10 bg-zinc-800"></div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-light text-indigo-300 tracking-tight tabular-nums">
                {stats.epic}
              </span>
              <span className="text-xs text-zinc-500 mt-2 font-medium tracking-wider uppercase">史诗</span>
            </div>
            <div className="w-px h-10 bg-zinc-800"></div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-light text-amber-300 tracking-tight tabular-nums">
                {stats.legendary}
              </span>
              <span className="text-xs text-zinc-500 mt-2 font-medium tracking-wider uppercase">传说</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-t border-white/5 pt-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => {
            const active = c.key === activeCategory;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setActiveCategory(c.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-sm ${
                  active 
                    ? 'bg-zinc-100 border-zinc-100 text-zinc-900 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                }`}
              >
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          {(['all', 'unlocked', 'locked'] as const).map(k => (
            <button
              key={k}
              type="button"
              onClick={() => setStatusFilter(k)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                statusFilter === k 
                  ? 'bg-white/10 text-zinc-100 shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>
                {k === 'all' ? '全部' : k === 'unlocked' ? '已解锁' : '未解锁'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={gridRef}
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-label="Achievements grid"
      >
        {filtered.map(item => (
          <div key={item.id} className="min-h-[220px]">
            <AchievementCard achievement={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsWall;
