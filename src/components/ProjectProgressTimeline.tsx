import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import type { ProjectMilestone, ProjectTimelineItem } from '../contents/projects/types';

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
      className="rounded-2xl border border-white/10 bg-zinc-900/30 backdrop-blur-sm overflow-hidden flex flex-col"
    >
      <div className="p-6 md:p-8 border-b border-white/5 bg-zinc-900/50">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 mb-4">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Quest Log</span>
            </div>
            <div className="text-2xl font-bold text-zinc-100 tracking-tight">
              Timeline <span className="text-zinc-600 font-light">/ Milestones</span>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Current Progress</div>
            <div className="text-2xl font-bold text-indigo-400" style={{ fontFamily: "'Emblema One', cursive" }}>{pct}%</div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-10 flex-1 overflow-y-auto">
        <div className="relative border-l border-zinc-800/50 ml-32 md:ml-48 space-y-12 pb-8">
          {timeline.map((item, index) => {
            const milestone = milestoneById.get(item.milestoneId);
            const milestonePct = milestone?.pct ?? 0;
            const unlocked = pct >= milestonePct;
            const active = activeMilestoneId === item.milestoneId;
            return (
              <button
                key={item.id}
                type="button"
                className="relative pl-8 md:pl-12 text-left w-full group outline-none"
                onMouseEnter={() => onItemEnter(item.milestoneId)}
                onMouseLeave={onItemLeave}
                onFocus={() => onItemEnter(item.milestoneId)}
                onBlur={onItemLeave}
                onClick={() => onItemSelect(item.milestoneId)}
              >
                {/* Date on the Left */}
                <div className="absolute -left-32 md:-left-48 top-0.5 w-28 md:w-44 text-right pr-4 md:pr-10">
                  <div 
                    className={`text-sm md:text-lg tracking-tight transition-all duration-300 leading-none whitespace-nowrap ${active ? 'text-indigo-400 scale-110 origin-right' : 'text-zinc-600'}`}
                    style={{ fontFamily: "'Emblema One', cursive" }}
                  >
                    {item.date}
                  </div>
                </div>

                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[13px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 bg-zinc-950 z-10 ${
                    unlocked ? 'border-emerald-400' : 'border-zinc-700'
                  } ${active ? 'scale-125 ring-4 ring-indigo-500/20 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'group-hover:scale-110'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${unlocked ? 'bg-emerald-400' : 'bg-zinc-700'} ${active ? 'bg-indigo-400' : ''}`} />
                </div>

                <div
                  data-timeline-card
                  className={`rounded-xl border p-5 md:p-6 transition-all duration-300 ${
                    unlocked ? 'border-white/10 bg-white/5' : 'border-white/5 bg-transparent opacity-60'
                  } ${active ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'group-hover:border-white/20 group-hover:bg-white/10'}`}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="min-w-0 flex-1">
                      <div className={`font-bold text-lg md:text-xl truncate transition-colors duration-300 ${active ? 'text-indigo-300' : 'text-zinc-100'}`}>
                        {item.title}
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs md:text-sm text-zinc-500 uppercase tracking-wider font-semibold">
                        <span className={active ? 'text-indigo-400' : 'text-zinc-400'}>
                          {milestone?.label ?? 'MILESTONE'}
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span className="text-indigo-400/80" style={{ fontFamily: "'Emblema One', cursive" }}>{milestonePct}%</span>
                      </div>
                    </div>
                    <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                      active ? 'border-indigo-500/50 text-indigo-400 bg-indigo-500/20 rotate-90' : 'border-white/10 text-zinc-500 group-hover:text-zinc-300 group-hover:border-white/30'
                    }`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  <div className={`grid transition-all duration-500 ease-in-out ${active ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="border-t border-white/5 pt-6 space-y-6">
                        {milestone?.description ? (
                          <div className="text-sm md:text-base text-indigo-300/90 leading-relaxed italic bg-indigo-500/5 p-4 rounded-lg border border-indigo-500/10">
                            {milestone.description}
                          </div>
                        ) : null}
                        
                        <div className="text-base md:text-lg leading-relaxed text-zinc-300 font-light">
                          {item.detail}
                        </div>
                        
                        {item.result ? (
                          <div className="mt-6 border-l-4 border-indigo-500/50 pl-4 py-2 text-base md:text-lg text-zinc-200 bg-indigo-500/5 rounded-r-lg">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Result</span>
                            {item.result}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
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

