import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import type { ProjectMilestone, ProjectTimelineItem } from '../contents/projects';

export type ProjectProgressTimelineProps = {
  actualProgressPct: number;
  milestones: ProjectMilestone[];
  timeline: ProjectTimelineItem[];
  activeMilestoneId: string | null;
  onItemEnter: (milestoneId: string) => void;
  onItemLeave: () => void;
  onItemSelect: (milestoneId: string) => void;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const ProjectProgressTimeline: React.FC<ProjectProgressTimelineProps> = ({
  actualProgressPct,
  milestones,
  timeline,
  activeMilestoneId,
  onItemEnter,
  onItemLeave,
  onItemSelect
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pct = useMemo(() => clamp(actualProgressPct, 0, 100), [actualProgressPct]);
  const milestoneById = useMemo(() => new Map(milestones.map(m => [m.id, m])), [milestones]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = Array.from(root.querySelectorAll('[data-timeline-card]')) as HTMLElement[];
    gsap.killTweensOf(cards);
    gsap.set(cards, { opacity: 0, y: 10 });
    const tween = gsap.to(cards, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.05 });
    return () => {
      tween.kill();
      gsap.killTweensOf(cards);
    };
  }, [timeline.length]);

  return (
    <div
      ref={rootRef}
      className="border-4 border-[#334155] bg-[#0B0B1A] shadow-[8px_8px_0px_rgba(51,65,85,0.75)]"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-[#334155] bg-black/20 px-3 py-2 shadow-[4px_4px_0px_rgba(51,65,85,0.8)]">
              <span className="font-['PressStart2P'] text-[12px] text-[#94A3B8]">QUEST LOG</span>
              <span className="text-[#94A3B8] text-[12px]">剧情推进</span>
            </div>
            <div className="mt-4 text-[#E2E8F0] text-xl md:text-2xl font-bold">
              <span className="font-['PressStart2P']">Timeline</span> / Milestones
            </div>
          </div>
          <div className="hidden md:block text-right text-[#94A3B8] text-sm">
            当前进度：<span className="font-['PressStart2P'] text-[#E2E8F0]">{pct}%</span>
          </div>
        </div>

        <div className="mt-7 grid gap-4">
          {timeline.map(item => {
            const milestone = milestoneById.get(item.milestoneId);
            const milestonePct = milestone?.pct ?? 0;
            const unlocked = pct >= milestonePct;
            const active = activeMilestoneId === item.milestoneId;
            return (
              <button
                key={item.id}
                type="button"
                className="relative pl-8 text-left"
                onMouseEnter={() => onItemEnter(item.milestoneId)}
                onMouseLeave={onItemLeave}
                onFocus={() => onItemEnter(item.milestoneId)}
                onBlur={onItemLeave}
                onClick={() => onItemSelect(item.milestoneId)}
              >
                <div className="absolute left-[10px] top-0 bottom-0 w-[2px] bg-[#334155]" />
                <div
                  className={[
                    'absolute left-0 top-[14px] grid h-6 w-6 place-items-center border-2 bg-[#0F0F23] shadow-[3px_3px_0px_rgba(124,58,237,0.45)]',
                    unlocked ? 'border-[#22C55E] text-[#86EFAC]' : 'border-[#334155] text-[#94A3B8] grayscale',
                    active ? 'shadow-[4px_4px_0px_rgba(244,63,94,0.55)]' : ''
                  ].join(' ')}
                >
                  {unlocked ? '✓' : '🔒'}
                </div>

                <div
                  data-timeline-card
                  className={[
                    'border-2 bg-[#0F0F23] p-5 shadow-[4px_4px_0px_rgba(124,58,237,0.55)] transition-transform duration-150',
                    'hover:-translate-y-[1px]',
                    unlocked ? 'border-[#7C3AED]' : 'border-[#334155] grayscale brightness-75',
                    active ? 'shadow-[4px_4px_0px_rgba(244,63,94,0.55)]' : ''
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[#E2E8F0] font-semibold truncate">{item.title}</div>
                      <div className="mt-1 text-[12px] text-[#94A3B8]">
                        <span className="font-['PressStart2P'] text-[10px] text-[#A78BFA]">
                          {milestone?.label ?? 'MILESTONE'}
                        </span>
                        <span className="ml-2">{item.date}</span>
                        <span className="ml-2">
                          目标 <span className="font-['PressStart2P']">{milestonePct}%</span>
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 border-2 border-[#334155] bg-black/20 px-3 py-2 text-[11px] text-[#94A3B8] shadow-[3px_3px_0px_rgba(51,65,85,0.75)]">
                      {unlocked ? '查看' : '查看'}
                    </div>
                  </div>

                  <div className="mt-3 text-[13px] leading-relaxed text-[#CBD5E1]">{item.detail}</div>
                  {item.result ? (
                    <div className="mt-4 border-l-2 border-[#F43F5E] pl-4 text-[13px] text-[#E2E8F0]">
                      <span className="font-['PressStart2P'] text-[10px] text-[#FCA5A5]">RESULT</span>
                      <span className="ml-2">{item.result}</span>
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressTimeline;

