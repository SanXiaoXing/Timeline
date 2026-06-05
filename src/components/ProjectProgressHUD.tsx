import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Project, ProjectMilestone, ProjectStatus } from '../contents/projects/types';
import { projectStatusLabel } from '../contents/projects/types';
import { achievementCategoryLabels } from '../contents/achievements';
import BackButton from './BackButton';
import ProjectProgressTimeline from './ProjectProgressTimeline';

const statusTheme: Record<ProjectStatus, { border: string; text: string; bg: string }> = {
  in_progress: { border: '#059669', text: '#059669', bg: 'rgba(16,185,129,0.08)' },
  paused:      { border: '#d97706', text: '#d97706', bg: 'rgba(245,158,11,0.08)' },
  completed:   { border: '#0284c7', text: '#0284c7', bg: 'rgba(14,165,233,0.08)' }
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
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const actualPct = useMemo(() => clamp(project.progressPct, 0, 100), [project.progressPct]);
  const status = useMemo(() => statusTheme[project.status], [project.status]);

  const sortedMilestones = useMemo(() => sortMilestones(project.milestones), [project.milestones]);
  const currentMilestoneId = useMemo(
    () => findCurrentMilestoneId(actualPct, sortedMilestones),
    [actualPct, sortedMilestones]
  );

  const unlockedCount = useMemo(
    () => sortedMilestones.filter(m => actualPct >= m.pct).length,
    [sortedMilestones, actualPct]
  );

  // Header entrance animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHeaderVisible(true);
      return;
    }
    const timer = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-content px-4 md:px-8 pb-32 pt-28 md:pt-32 min-h-screen flex flex-col">
      <header
        ref={headerRef}
        className="mb-16 md:mb-24"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <div className="mb-8 md:mb-12">
              <BackButton href="/projects">返回列表</BackButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8">
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">Project</p>
                <h1 className="font-display text-4xl md:text-6xl text-primary font-normal leading-[1.1]">
                  {project.name}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide font-mono"
                    style={{ color: status.text, backgroundColor: status.bg }}
                  >
                    {projectStatusLabel[project.status]}
                  </span>
                  <span className="text-muted text-sm">|</span>
                  <span className="text-sm text-muted">
                    当前阶段：<span className="text-primary font-medium">{project.currentStage}</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 ml-2">
                    {project.achievementTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 text-[10px] text-muted"
                        style={{ borderBottom: '1px solid #E5DFD6' }}
                      >
                        {achievementCategoryLabels[tag as keyof typeof achievementCategoryLabels]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 md:col-start-10 flex items-end gap-8 pb-2">
                <div className="flex flex-col">
                  <span className="font-display text-3xl md:text-4xl text-primary tabular-nums">
                    {unlockedCount}<span className="text-lg text-muted font-body">/{sortedMilestones.length}</span>
                  </span>
                  <span className="text-xs text-muted mt-2 font-medium uppercase tracking-wider">里程碑</span>
                </div>
                <div className="w-px h-10 bg-divider" />
                <div className="flex flex-col">
                  <span className="font-display text-3xl md:text-4xl text-primary tabular-nums">
                    {actualPct}%
                  </span>
                  <span className="text-xs text-muted mt-2 font-medium uppercase tracking-wider">总进度</span>
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
        activeMilestoneId={selectedMilestoneId}
        onItemSelect={id => {
          setSelectedMilestoneId(prev => (prev === id ? null : id));
        }}
      />
    </div>
  );
};

export default ProjectProgressHUD;