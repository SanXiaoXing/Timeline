import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AchievementCard from './AchievementCard';
import type { Achievement, AchievementCategory } from '../contents/achievements';
import { achievementCategoryLabels, achievements as baseAchievements } from '../contents/achievements';

type StatusFilter = 'all' | 'unlocked' | 'locked';

const categories: Array<{ key: 'all' | AchievementCategory; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'life', label: achievementCategoryLabels.life },
  { key: 'study', label: achievementCategoryLabels.study },
  { key: 'career', label: achievementCategoryLabels.career },
  { key: 'skill', label: achievementCategoryLabels.skill },
  { key: 'mindset', label: achievementCategoryLabels.mindset }
];

const AchievementsWall: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | AchievementCategory>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [achievements] = useState<Achievement[]>(baseAchievements);
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
      activeCategory === 'all' ? achievements : achievements.filter(a => a.category === activeCategory);
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
      <header className="mb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-[#7C3AED] bg-[#0B0B1A] px-3 py-2 shadow-[4px_4px_0px_#7C3AED]">
              <span className="font-['PressStart2P'] text-[12px] text-[#A78BFA]">ACHIEVEMENTS</span>
              <span className="text-[#94A3B8] text-[12px]">成就墙</span>
            </div>
            <h1 className="mt-6 text-3xl md:text-5xl font-bold text-[#E2E8F0] drop-shadow-[4px_4px_0px_rgba(124,58,237,0.85)]">
              <span className="font-['PressStart2P'] tracking-tight">TROPHY ROOM</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[#94A3B8] text-lg md:text-xl leading-relaxed">
              未解锁成就处于锁定状态，解锁状态以数据文件为准。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="border-2 border-[#7C3AED] bg-[#0B0B1A] p-4 shadow-[4px_4px_0px_#7C3AED]">
              <div className="text-[11px] text-[#A78BFA] font-['PressStart2P']">UNLOCKED</div>
              <div className="mt-2 text-2xl font-bold text-[#E2E8F0] tabular-nums font-['PressStart2P']">
                {stats.unlocked}/{stats.total}
              </div>
            </div>
            <div className="border-2 border-[#334155] bg-[#0B0B1A] p-4 shadow-[4px_4px_0px_rgba(51,65,85,0.75)]">
              <div className="text-[11px] text-[#94A3B8] font-['PressStart2P']">EPIC</div>
              <div className="mt-2 text-2xl font-bold text-[#E2E8F0] tabular-nums font-['PressStart2P']">
                {stats.epic}
              </div>
            </div>
            <div className="border-2 border-[#F59E0B] bg-[#0B0B1A] p-4 shadow-[4px_4px_0px_rgba(245,158,11,0.55)]">
              <div className="text-[11px] text-[#FCD34D] font-['PressStart2P']">LEGEND</div>
              <div className="mt-2 text-2xl font-bold text-[#E2E8F0] tabular-nums font-['PressStart2P']">
                {stats.legendary}
              </div>
            </div>
            <a
              href="/"
              className="group border-2 border-[#F43F5E] bg-[#0B0B1A] p-4 shadow-[4px_4px_0px_rgba(244,63,94,0.55)] transition-transform duration-200 hover:-translate-y-[2px]"
            >
              <div className="text-[11px] text-[#FCA5A5] font-['PressStart2P']">BACK</div>
              <div className="mt-2 text-[14px] text-[#E2E8F0] group-hover:text-white">返回首页</div>
            </a>
          </div>
        </div>
      </header>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map(c => {
            const active = c.key === activeCategory;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setActiveCategory(c.key)}
                className={[
                  'border-2 px-3 py-2 shadow-[3px_3px_0px_rgba(124,58,237,0.55)] transition-transform duration-200',
                  'hover:-translate-y-[1px]',
                  active ? 'border-[#F43F5E] bg-[#1A1A2E] text-[#E2E8F0]' : 'border-[#334155] bg-[#0B0B1A] text-[#94A3B8]'
                ].join(' ')}
              >
                <span className="text-[12px] font-['PressStart2P']">{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'unlocked', 'locked'] as const).map(k => (
            <button
              key={k}
              type="button"
              onClick={() => setStatusFilter(k)}
              className={[
                'border-2 px-3 py-2 shadow-[3px_3px_0px_rgba(51,65,85,0.75)] transition-transform duration-200',
                'hover:-translate-y-[1px]',
                statusFilter === k ? 'border-[#22C55E] bg-[#0B0B1A] text-[#E2E8F0]' : 'border-[#334155] bg-[#0B0B1A] text-[#94A3B8]'
              ].join(' ')}
            >
              <span className="text-[12px] font-['PressStart2P']">
                {k === 'all' ? '全部' : k === 'unlocked' ? '已解锁' : '未解锁'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        aria-label="Achievements grid"
      >
        {filtered.map(a => (
          <AchievementCard key={a.id} achievement={a} />
        ))}
      </div>
    </div>
  );
};

export default AchievementsWall;
