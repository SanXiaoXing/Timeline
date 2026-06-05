import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ProjectMilestone, ProjectTimelineItem } from '../contents/projects/types';

export type ProjectProgressTimelineProps = {
  actualProgressPct: number;
  milestones: ProjectMilestone[];
  timeline: ProjectTimelineItem[];
  activeMilestoneId: string | null;
  onItemSelect: (milestoneId: string) => void;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const all = container.querySelectorAll('[data-reveal]');
      setVisibleItems(new Set(Array.from(all).map(el => el.getAttribute('data-reveal')!)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleItems(prev => {
          const next = new Set(prev);
          entries.forEach(entry => {
            const id = entry.target.getAttribute('data-reveal');
            if (id && entry.isIntersecting) {
              next.add(id);
            }
          });
          return next;
        });
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    const items = container.querySelectorAll('[data-reveal]');
    items.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visibleItems };
}

function formatDateCN(dateStr: string): { year: string; month: string; day: string } {
  const d = new Date(dateStr);
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, '0'),
    day: String(d.getDate()).padStart(2, '0'),
  };
}

const ProjectProgressTimeline: React.FC<ProjectProgressTimelineProps> = ({
  actualProgressPct,
  milestones,
  timeline,
  activeMilestoneId,
  onItemSelect
}) => {
  const pct = useMemo(() => clamp(actualProgressPct, 0, 100), [actualProgressPct]);
  const milestoneById = useMemo(() => new Map(milestones.map(m => [m.id, m])), [milestones]);
  const { ref: revealRef, visibleItems } = useScrollReveal(0.12);

  const unlockedCount = useMemo(
    () => milestones.filter(m => pct >= m.pct).length,
    [milestones, pct]
  );

  return (
    <div ref={revealRef}>
      {/* Magazine section header */}
      <div className="mb-16 md:mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">Timeline</p>
            <h2 className="font-display text-3xl md:text-4xl text-primary font-normal leading-[1.15]">
              开发日志
            </h2>
            <p className="mt-3 text-muted text-sm leading-relaxed max-w-[40ch]">
              共 {milestones.length} 个里程碑，已完成 {unlockedCount} 个
            </p>
          </div>

          {/* Overall progress */}
          <div className="flex items-end gap-10">
            <div className="flex flex-col items-end">
              <span className="font-display text-4xl md:text-5xl text-accent tabular-nums leading-none">
                {pct}%
              </span>
              <span className="text-xs text-muted mt-2 font-medium uppercase tracking-wider">总进度</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-[2px] w-full overflow-hidden" style={{ backgroundColor: '#E5DFD6' }}>
          <div
            className="h-full origin-left"
            style={{
              backgroundColor: '#D45D4A',
              transform: `scaleX(${pct / 100})`,
              transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      </div>

      {/* Timeline items */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-0 md:left-0 top-0 bottom-0 w-px" style={{ backgroundColor: '#E5DFD6' }} />

        <div className="space-y-0">
          {timeline.map((item, index) => {
            const milestone = milestoneById.get(item.milestoneId);
            const milestonePct = milestone?.pct ?? 0;
            const unlocked = pct >= milestonePct;
            const active = activeMilestoneId === item.milestoneId;
            const isVisible = visibleItems.has(item.id);
            const date = formatDateCN(item.date);

            return (
              <div
                key={item.id}
                data-reveal={item.id}
                className="relative"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.6s ease-out ${index * 0.08}s, transform 0.6s ease-out ${index * 0.08}s`,
                }}
              >
                {/* Dot on timeline */}
                <div
                  className="absolute left-0 top-0 -translate-x-1/2 z-10 transition-all duration-300"
                  style={{
                    width: active ? '14px' : '10px',
                    height: active ? '14px' : '10px',
                    backgroundColor: unlocked ? '#D45D4A' : '#E5DFD6',
                    border: unlocked ? '2px solid #D45D4A' : '2px solid #E5DFD6',
                    marginTop: '2.1rem',
                  }}
                />

                <button
                  type="button"
                  className="relative pl-8 md:pl-12 w-full text-left block outline-none group cursor-pointer"
                  onClick={() => onItemSelect(item.milestoneId)}
                >
                  {/* Magazine layout: date row + content row */}
                  <div className="py-6 md:py-8">
                    {/* Date — large magazine display */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-display text-5xl md:text-6xl lg:text-7xl text-primary tabular-nums leading-none tracking-tight">
                        {date.month}.{date.day}
                      </span>
                      <span className="font-display text-2xl md:text-3xl text-muted font-light">
                        {date.year}
                      </span>
                      <span className="ml-3 inline-flex items-center gap-1.5">
                        <span
                          className="inline-block w-1 h-1"
                          style={{ backgroundColor: unlocked ? '#4A6B5F' : '#E5DFD6' }}
                        />
                        <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                          {milestone?.label ?? 'MILESTONE'}
                        </span>
                      </span>
                    </div>

                    {/* Content */}
                    <div
                      className="transition-all duration-300"
                      style={{
                        backgroundColor: active ? '#F0EBE3' : 'transparent',
                        borderLeft: active ? '3px solid #D45D4A' : '1px solid transparent',
                        opacity: unlocked ? 1 : 0.5,
                        padding: active ? '1.5rem' : '0',
                        paddingLeft: active ? '1.5rem' : '0',
                      }}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0 flex-1">
                          <h3
                            className="font-display text-xl md:text-2xl text-primary leading-tight group-hover:text-accent transition-colors duration-200"
                            style={{
                              opacity: isVisible ? 1 : 0,
                              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                              transition: `opacity 0.5s ease-out ${index * 0.08 + 0.1}s, transform 0.5s ease-out ${index * 0.08 + 0.1}s`,
                            }}
                          >
                            {item.title}
                          </h3>

                          {/* Expand indicator */}
                          <div
                            className="mt-3 flex items-center gap-2"
                            style={{
                              opacity: isVisible ? 1 : 0,
                              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                              transition: `opacity 0.5s ease-out ${index * 0.08 + 0.2}s, transform 0.5s ease-out ${index * 0.08 + 0.2}s`,
                            }}
                          >
                            <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {active ? '收起' : '点击展开'}
                            </span>
                            <svg
                              className="w-3.5 h-3.5 text-muted transition-transform duration-300"
                              style={{ transform: active ? 'rotate(180deg)' : 'rotate(0deg)' }}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        <span
                          className="shrink-0 font-mono text-sm text-accent tabular-nums mt-1"
                          style={{
                            opacity: isVisible ? 1 : 0,
                            transition: `opacity 0.5s ease-out ${index * 0.08 + 0.15}s`,
                          }}
                        >
                          {milestonePct}%
                        </span>
                      </div>

                      {/* Expanded content */}
                      <div
                        className="grid transition-all duration-500 ease-in-out"
                        style={{
                          gridTemplateRows: active ? '1fr' : '0fr',
                          opacity: active ? 1 : 0,
                          marginTop: active ? '1.5rem' : '0',
                        }}
                      >
                        <div className="overflow-hidden">
                          <div className="space-y-6" style={{ borderTop: '1px solid #E5DFD6', paddingTop: '1.5rem' }}>
                            {milestone?.description ? (
                              <div
                                className="text-sm md:text-base text-primary leading-relaxed italic p-4"
                                style={{ backgroundColor: '#F6F2EB', borderLeft: '2px solid #D45D4A' }}
                              >
                                {milestone.description}
                              </div>
                            ) : null}

                            <div className="text-base md:text-lg leading-relaxed text-muted font-light">
                              {item.detail}
                            </div>

                            {item.result ? (
                              <div
                                className="pl-4 py-2 text-base md:text-lg text-primary"
                                style={{ borderLeft: '3px solid #4A6B5F' }}
                              >
                                <span className="font-mono text-[10px] font-bold tracking-widest uppercase mb-2 block" style={{ color: '#4A6B5F' }}>
                                  Result
                                </span>
                                {item.result}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* End marker */}
        <div className="relative pl-8 md:pl-12 py-8">
          <div
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#D45D4A',
              border: '2px solid #D45D4A',
            }}
          />
          <p className="font-display text-lg text-muted italic">
            Fin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressTimeline;