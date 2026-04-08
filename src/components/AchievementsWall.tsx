import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AchievementCard from './AchievementCard';
import AchievementModal from './AchievementModal';
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
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 border border-neutral-200/50 text-neutral-600 hover:text-indigo-600 hover:border-indigo-400/30 hover:bg-white transition-all duration-500 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-indigo-100/50"
          data-magnetic
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium tracking-wide relative z-10">返回首页</span>
        </a>
      </div>

      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-neutral-800 tracking-tight">
              成就记录
            </h1>
            <p className="mt-4 text-neutral-500 text-base md:text-lg leading-relaxed font-light">
              记录生活、工作与学习中的每一个重要里程碑。<br className="hidden md:block" />
              未解锁的成就将保持隐匿状态，等待在未来的某一刻被点亮。
            </p>
          </div>

          <div className="flex items-center gap-8 md:gap-12 pb-2">
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-light text-neutral-800 tracking-tight tabular-nums">
                {stats.unlocked}<span className="text-lg md:text-xl text-neutral-400 font-normal">/{stats.total}</span>
              </span>
              <span className="text-xs text-neutral-400 mt-2 font-medium tracking-wider uppercase">已解锁</span>
            </div>
            <div className="w-px h-10 bg-neutral-200"></div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-light text-violet-500 tracking-tight tabular-nums">
                {stats.epic}
              </span>
              <span className="text-xs text-neutral-400 mt-2 font-medium tracking-wider uppercase">史诗</span>
            </div>
            <div className="w-px h-10 bg-neutral-200"></div>
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-light text-amber-500 tracking-tight tabular-nums">
                {stats.legendary}
              </span>
              <span className="text-xs text-neutral-400 mt-2 font-medium tracking-wider uppercase">传说</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-t border-neutral-200/50 pt-8">
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
                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-200/50' 
                    : 'bg-white/60 border-neutral-200/50 text-neutral-600 hover:bg-white hover:text-neutral-800 hover:shadow-md'
                }`}
                data-magnetic
              >
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 p-1 rounded-full bg-white/60 border border-neutral-200/50 backdrop-blur-sm shadow-sm">
          {(['all', 'unlocked', 'locked'] as const).map(k => (
            <button
              key={k}
              type="button"
              onClick={() => setStatusFilter(k)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                statusFilter === k 
                  ? 'bg-indigo-500 text-white shadow-md' 
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100/50'
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
            <AchievementCard
              achievement={item}
              onCardClick={(a) => {
                setSelectedAchievement(a);
                setIsModalOpen(true);
              }}
            />
          </div>
        ))}
      </div>

      <AchievementModal
        isOpen={isModalOpen}
        achievement={selectedAchievement}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AchievementsWall;
