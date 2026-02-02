import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import type { ProjectMilestone } from '../contents/projects';

export type ProjectProgressBarProps = {
  actualProgressPct: number;
  displayProgressPct: number;
  milestones: ProjectMilestone[];
  activeMilestoneId: string | null;
  onMilestoneEnter: (milestoneId: string) => void;
  onMilestoneLeave: () => void;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  actualProgressPct,
  displayProgressPct,
  milestones,
  activeMilestoneId,
  onMilestoneEnter,
  onMilestoneLeave
}) => {
  const barFillRef = useRef<HTMLDivElement | null>(null);
  const didInitRef = useRef(false);

  const actualPct = useMemo(() => clamp(actualProgressPct, 0, 100), [actualProgressPct]);
  const displayPct = useMemo(() => clamp(displayProgressPct, 0, 100), [displayProgressPct]);
  const isPreview = displayPct !== actualPct;

  useLayoutEffect(() => {
    const fill = barFillRef.current;
    if (!fill) return;

    const target = displayPct / 100;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fill.style.transform = `scaleX(${target})`;
      return;
    }

    gsap.killTweensOf(fill);
    gsap.set(fill, { transformOrigin: '0% 50%' });

    if (!didInitRef.current) {
      didInitRef.current = true;
      gsap.set(fill, { scaleX: 0 });
      const tl = gsap.timeline();
      tl.to(fill, { scaleX: target, duration: 0.85, ease: 'power3.out' });
      return () => {
        tl.kill();
      };
    }

    gsap.to(fill, { scaleX: target, duration: 0.6, ease: 'power2.out' });
  }, [displayPct]);

  return (
    <div className="border-4 border-[#7C3AED] bg-[#0B0B1A] shadow-[8px_8px_0px_#7C3AED]">
      <div className="flex items-start justify-between gap-6 p-6 md:p-8">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 border-2 border-[#334155] bg-black/20 px-3 py-2 shadow-[4px_4px_0px_rgba(51,65,85,0.8)]">
            <span className="font-['PressStart2P'] text-[12px] text-[#A78BFA]">PROGRESS</span>
            <span className="text-[#94A3B8] text-[12px]">任务完成度</span>
            {isPreview ? (
              <span className="ml-2 border-2 border-[#F59E0B] bg-black/20 px-2 py-1 text-[#FCD34D] shadow-[2px_2px_0px_rgba(245,158,11,0.35)]">
                <span className="font-['PressStart2P'] text-[10px]">PREVIEW</span>
              </span>
            ) : null}
          </div>
          <div className="mt-5 text-3xl md:text-4xl font-bold text-[#E2E8F0] drop-shadow-[4px_4px_0px_rgba(124,58,237,0.85)]">
            <span className="font-['PressStart2P'] tabular-nums">{displayPct}</span>
            <span className="ml-2 font-['PressStart2P'] text-lg md:text-xl text-[#A78BFA]">%</span>
          </div>
          <div className="mt-2 text-[#94A3B8] text-sm md:text-base leading-relaxed">
            Hover 节点同步高亮；点击时间轴进入阶段预览并查看详情。
          </div>
        </div>

        <div className="hidden md:block border-2 border-[#F43F5E] bg-black/20 px-4 py-3 shadow-[4px_4px_0px_rgba(244,63,94,0.55)]">
          <div className="font-['PressStart2P'] text-[11px] text-[#FCA5A5]">NEXT</div>
          <div className="mt-2 text-[#E2E8F0] text-sm">{milestones.find(m => actualPct < m.pct)?.label ?? 'BOSS CLEAR'}</div>
        </div>
      </div>

      <div className="px-6 pb-7 md:px-8 md:pb-9">
        <div className="relative h-8 overflow-hidden border-2 border-[#7C3AED] bg-[#0F0F23]">
          <div className="absolute inset-0 opacity-[0.20] bg-[linear-gradient(90deg,rgba(124,58,237,0.0)_0%,rgba(124,58,237,0.35)_35%,rgba(244,63,94,0.20)_70%,rgba(244,63,94,0.0)_100%)]" />
          <div
            ref={barFillRef}
            className="relative h-full bg-[#F43F5E] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.55)]"
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30" />
          </div>

          {milestones.map(m => {
            const unlocked = actualPct >= m.pct;
            const active = activeMilestoneId === m.id;
            const left = `${clamp(m.pct, 0, 100)}%`;
            return (
              <div key={m.id} className="absolute top-1/2 -translate-y-1/2" style={{ left }}>
                <div
                  className={[
                    'relative grid h-8 w-8 -translate-x-1/2 place-items-center border-2 shadow-[3px_3px_0px_rgba(124,58,237,0.55)] transition-transform duration-150',
                    unlocked
                      ? 'border-[#22C55E] bg-[#0B0B1A] text-[#86EFAC]'
                      : 'border-[#334155] bg-black/30 text-[#94A3B8] grayscale',
                    active ? 'scale-[1.08] shadow-[4px_4px_0px_rgba(244,63,94,0.55)]' : ''
                  ].join(' ')}
                  onMouseEnter={() => onMilestoneEnter(m.id)}
                  onMouseLeave={onMilestoneLeave}
                  aria-label={`${m.label}：${unlocked ? '已完成' : '锁定'}`}
                >
                  {unlocked ? '✓' : '🔒'}

                  <div
                    className={[
                      'pointer-events-none absolute left-1/2 top-full mt-3 w-[240px] -translate-x-1/2 border-2 bg-[#0B0B1A] px-3 py-3 text-left shadow-[4px_4px_0px_rgba(124,58,237,0.65)]',
                      'opacity-0 translate-y-1 transition-[opacity,transform] duration-150',
                      active ? 'opacity-100 translate-y-0' : ''
                    ].join(' ')}
                  >
                    <div className="font-['PressStart2P'] text-[11px] text-[#A78BFA] truncate">{m.label}</div>
                    <div className="mt-2 text-[13px] leading-relaxed text-[#CBD5E1]">{m.description}</div>
                    <div className="mt-2 text-[12px] text-[#94A3B8]">
                      目标：<span className="font-['PressStart2P']">{m.pct}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 md:grid-cols-6">
          {milestones.map(m => {
            const unlocked = actualPct >= m.pct;
            const active = activeMilestoneId === m.id;
            return (
              <div
                key={`${m.id}-chip`}
                className={[
                  'border-2 px-3 py-2 shadow-[3px_3px_0px_rgba(51,65,85,0.75)] transition-transform duration-150',
                  unlocked ? 'border-[#22C55E] bg-black/20 text-[#E2E8F0]' : 'border-[#334155] bg-black/10 text-[#94A3B8] grayscale',
                  active ? 'translate-y-[-1px] shadow-[3px_3px_0px_rgba(244,63,94,0.55)]' : ''
                ].join(' ')}
                onMouseEnter={() => onMilestoneEnter(m.id)}
                onMouseLeave={onMilestoneLeave}
              >
                <div className="font-['PressStart2P'] text-[10px] truncate">{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressBar;
