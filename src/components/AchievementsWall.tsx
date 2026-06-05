import React, { useMemo, useState } from 'react';
import AchievementCard from './AchievementCard';
import AchievementModal from './AchievementModal';
import BackButton from './BackButton';
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
    <div className="mx-auto max-w-content px-4 md:px-12 pb-20 pt-28 md:pt-32">
      {/* Back */}
      <div className="mb-8 md:mb-12">
        <BackButton href="/">返回首页</BackButton>
      </div>

      <header className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted mb-4">Achievements</p>
            <h1 className="font-display text-4xl md:text-5xl text-primary font-normal leading-[1.15]">
              成就记录
            </h1>
            <p className="mt-4 text-muted text-base leading-relaxed max-w-[50ch]">
              记录生活、工作与学习中的每一个重要里程碑。未解锁的成就将保持隐匿状态，等待在未来的某一刻被点亮。
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9 flex items-end gap-8 md:gap-12">
            <div className="flex flex-col">
              <span className="font-display text-3xl md:text-4xl text-primary tabular-nums">
                {stats.unlocked}<span className="text-lg text-muted font-body">/{stats.total}</span>
              </span>
              <span className="text-xs text-muted mt-2 font-medium uppercase tracking-wider">已解锁</span>
            </div>
            <div className="w-px h-10 bg-divider" />
            <div className="flex flex-col">
              <span className="font-display text-3xl md:text-4xl text-primary tabular-nums">
                {stats.epic}
              </span>
              <span className="text-xs text-muted mt-2 font-medium uppercase tracking-wider">史诗</span>
            </div>
            <div className="w-px h-10 bg-divider" />
            <div className="flex flex-col">
              <span className="font-display text-3xl md:text-4xl text-primary tabular-nums">
                {stats.legendary}
              </span>
              <span className="text-xs text-muted mt-2 font-medium uppercase tracking-wider">传说</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between pt-8" style={{ borderTop: '1px solid #E5DFD6' }}>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => {
            const active = c.key === activeCategory;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setActiveCategory(c.key)}
                className="px-5 py-2 text-sm font-medium transition-colors duration-200"
                style={{
                  color: active ? '#F6F2EB' : '#7A7A72',
                  backgroundColor: active ? '#2C3639' : 'transparent',
                  borderBottom: active ? '2px solid #2C3639' : '1px solid #E5DFD6',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          {(['all', 'unlocked', 'locked'] as const).map(k => (
            <button
              key={k}
              type="button"
              onClick={() => setStatusFilter(k)}
              className="px-4 py-1.5 text-xs font-medium transition-colors duration-200"
              style={{
                color: statusFilter === k ? '#F6F2EB' : '#7A7A72',
                backgroundColor: statusFilter === k ? '#2C3639' : 'transparent',
              }}
            >
              {k === 'all' ? '全部' : k === 'unlocked' ? '已解锁' : '未解锁'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid layout — 一行多个成就 */}
      <div
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        aria-label="成就网格"
      >
        {filtered.map((item, idx) => {
          const height = '220px';

          return (
            <div
              key={item.id}
              style={{ height }}
            >
              <AchievementCard
                achievement={item}
                index={idx}
                onCardClick={(a) => {
                  setSelectedAchievement(a);
                  setIsModalOpen(true);
                }}
              />
            </div>
          );
        })}
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