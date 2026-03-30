import React, { useMemo, useState } from 'react';
import type { Project, ProjectMilestone, ProjectStatus } from '../contents/projects/types';
import { projectStatusLabel } from '../contents/projects/types';
import { achievementCategoryLabels } from '../contents/achievements';
import ProjectProgressTimeline from './ProjectProgressTimeline';

const statusTheme: Record<ProjectStatus, { border: string; text: string; bg: string }> = {
  in_progress: { border: 'border-emerald-400/40', text: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  paused: { border: 'border-amber-400/40', text: 'text-amber-600', bg: 'bg-amber-500/10' },
  completed: { border: 'border-sky-400/40', text: 'text-sky-600', bg: 'bg-sky-500/10' }
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const sortMilestones = (milestones: ProjectMilestone[]) => [...milestones].sort((a, b) => a.pct - b.pct);

const findCurrentMilestoneId = (progressPct: number, milestones: ProjectMilestone[]) => {
  const pct = clamp(progressPct, 0, 100);
  const sorted = sortMilestones(milestones);
  let current: ProjectMilestone | null = null;
  for (const m of sorted) {
    if (m.pct <= pct) current = m;
  }
  return current?.id ?? sorted[0]?.id ?? null;
};

export type ProjectProgressHUDProps = {
  project: Project;
};

const ProjectProgressHUD: React.FC<ProjectProgressHUDProps> = ({ project }) => {
  const [hoverMilestoneId, setHoverMilestoneId] = useState<string | null>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  const actualPct = useMemo(() => clamp(project.progressPct, 0, 100), [project.progressPct]);
  const status = useMemo(() => statusTheme[project.status], [project.status]);

  const sortedMilestones = useMemo(() => sortMilestones(project.milestones), [project.milestones]);
  const currentMilestoneId = useMemo(
    () => findCurrentMilestoneId(actualPct, sortedMilestones),
    [actualPct, sortedMilestones]
  );

  const activeMilestoneId = useMemo(
    () => selectedMilestoneId ?? hoverMilestoneId,
    [selectedMilestoneId, hoverMilestoneId]
  );

  const unlockedCount = useMemo(
    () => sortedMilestones.filter(m => actualPct >= m.pct).length,
    [sortedMilestones, actualPct]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 pb-32 pt-28 md:pt-32 min-h-screen flex flex-col">
      <header className="mb-16 md:mb-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            {/* Back Button */}
            <div className="mb-8 md:mb-12">
              <a
                href="/projects"
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 border border-neutral-200/50 text-neutral-600 hover:text-indigo-600 hover:border-indigo-400/30 hover:bg-white transition-all duration-500 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-indigo-100/50"
                data-magnetic
              >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium tracking-wide relative z-10">返回列表</span>
              </a>
            </div>

            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 tracking-tight">
                  {project.name}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${status.bg} ${status.text} ${status.border}`}
                  >
                    {projectStatusLabel[project.status]}
                  </span>
                  <span className="text-neutral-300 mx-1">•</span>
                  <span className="text-sm text-neutral-500">
                    当前阶段：<span className="text-neutral-700 font-medium">{project.currentStage}</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 ml-2">
                    {project.achievementTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded bg-neutral-100/80 text-neutral-500 text-[10px] border border-neutral-200/50"
                      >
                        {achievementCategoryLabels[tag as keyof typeof achievementCategoryLabels]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-8 pb-2">
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-light text-neutral-800 tracking-tight tabular-nums">
                    {unlockedCount}<span className="text-lg md:text-xl text-neutral-400 font-normal">/{sortedMilestones.length}</span>
                  </span>
                  <span className="text-xs text-neutral-400 mt-2 font-medium tracking-wider uppercase">里程碑</span>
                </div>
                <div className="w-px h-10 bg-neutral-200"></div>
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-light text-indigo-500 tracking-tight tabular-nums" style={{ fontFamily: "'Emblema One', cursive" }}>
                    {actualPct}%
                  </span>
                  <span className="text-xs text-neutral-400 mt-2 font-medium tracking-wider uppercase">总进度</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <ProjectProgressTimeline
        actualProgressPct={actualPct}
        milestones={sortedMilestones}
        timeline={project.timeline}
        activeMilestoneId={activeMilestoneId}
        onItemEnter={id => {
          if (selectedMilestoneId) return;
          setHoverMilestoneId(id);
        }}
        onItemLeave={() => {
          if (selectedMilestoneId) return;
          setHoverMilestoneId(null);
        }}
        onItemSelect={id => {
          setHoverMilestoneId(null);
          setSelectedMilestoneId(prev => (prev === id ? null : id));
        }}
      />
    </div>
  );
};

export default ProjectProgressHUD;
