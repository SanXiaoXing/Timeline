import React, { useMemo, useState } from 'react';
import type { Project, ProjectMilestone, ProjectTimelineItem, ProjectStatus } from '../contents/projects';
import { projectStatusLabel } from '../contents/projects';
import { achievementCategoryLabels } from '../contents/achievements';
import ProjectProgressBar from './ProjectProgressBar';
import ProjectProgressTimeline from './ProjectProgressTimeline';

const statusTheme: Record<ProjectStatus, { border: string; text: string; bg: string }> = {
  in_progress: { border: '#22C55E', text: '#86EFAC', bg: 'rgba(34,197,94,0.10)' },
  paused: { border: '#F59E0B', text: '#FCD34D', bg: 'rgba(245,158,11,0.10)' },
  completed: { border: '#38BDF8', text: '#7DD3FC', bg: 'rgba(56,189,248,0.10)' }
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

const getMilestoneById = (milestones: ProjectMilestone[], id: string | null) =>
  id ? milestones.find(m => m.id === id) ?? null : null;

const getTimelineByMilestoneId = (timeline: ProjectTimelineItem[], milestoneId: string | null) =>
  milestoneId ? timeline.find(t => t.milestoneId === milestoneId) ?? null : null;

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
    () => selectedMilestoneId ?? hoverMilestoneId ?? currentMilestoneId,
    [selectedMilestoneId, hoverMilestoneId, currentMilestoneId]
  );

  const displayPct = useMemo(() => {
    if (!selectedMilestoneId) return actualPct;
    const milestone = getMilestoneById(sortedMilestones, selectedMilestoneId);
    return milestone ? clamp(milestone.pct, 0, 100) : actualPct;
  }, [selectedMilestoneId, actualPct, sortedMilestones]);

  const unlockedCount = useMemo(
    () => sortedMilestones.filter(m => actualPct >= m.pct).length,
    [sortedMilestones, actualPct]
  );

  const stepsBorderWidth = useMemo(() => {
    const ratio = sortedMilestones.length > 0 ? unlockedCount / sortedMilestones.length : 0;
    return Math.round(clamp(2 + ratio * 4, 2, 6));
  }, [sortedMilestones.length, unlockedCount]);

  const currentBorderWidth = useMemo(() => Math.round(clamp(2 + (actualPct / 100) * 4, 2, 6)), [actualPct]);

  const selectedMilestone = useMemo(
    () => getMilestoneById(sortedMilestones, selectedMilestoneId),
    [sortedMilestones, selectedMilestoneId]
  );
  const selectedTimeline = useMemo(
    () => getTimelineByMilestoneId(project.timeline, selectedMilestoneId),
    [project.timeline, selectedMilestoneId]
  );
  const selectedLocked = useMemo(
    () => (selectedMilestone ? actualPct < selectedMilestone.pct : false),
    [selectedMilestone, actualPct]
  );

  const closeInspect = () => setSelectedMilestoneId(null);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:pt-32">
      <header className="mb-10 border-4 border-[#7C3AED] bg-[#0B0B1A] p-6 shadow-[8px_8px_0px_#7C3AED] md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 border-2 border-[#334155] bg-black/20 px-3 py-2 shadow-[4px_4px_0px_rgba(51,65,85,0.8)]">
              <span className="font-['PressStart2P'] text-[12px] text-[#A78BFA]">PROJECT</span>
              <span className="text-[#94A3B8] text-[12px]">单项目进度</span>
            </div>
            <h1 className="mt-6 text-3xl md:text-5xl font-bold text-[#E2E8F0] drop-shadow-[4px_4px_0px_rgba(124,58,237,0.85)]">
              <span className="font-['PressStart2P'] tracking-tight">{project.name}</span>
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center border-2 px-3 py-2 shadow-[4px_4px_0px_rgba(51,65,85,0.75)]"
                style={{ borderColor: status.border, color: status.text, backgroundColor: status.bg }}
              >
                <span className="font-['PressStart2P'] text-[12px]">{projectStatusLabel[project.status]}</span>
              </span>
              {project.achievementTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 border-2 border-[#334155] bg-black/20 px-3 py-2 shadow-[4px_4px_0px_rgba(51,65,85,0.75)]"
                >
                  <span className="font-['PressStart2P'] text-[11px] text-[#A78BFA]">TAG</span>
                  <span className="text-[12px] text-[#94A3B8]">{achievementCategoryLabels[tag]}</span>
                </span>
              ))}
              <span className="border-2 border-[#334155] bg-black/20 px-3 py-2 text-[#94A3B8] shadow-[4px_4px_0px_rgba(51,65,85,0.75)]">
                当前剧情：<span className="text-[#E2E8F0]">{project.currentStage}</span>
              </span>
              <a
                href="/"
                className="border-2 border-[#334155] bg-black/10 px-3 py-2 text-[#94A3B8] shadow-[4px_4px_0px_rgba(51,65,85,0.65)] transition-transform duration-150 hover:-translate-y-[1px]"
              >
                返回主页
              </a>
              <a
                href="/projects"
                className="border-2 border-[#334155] bg-black/10 px-3 py-2 text-[#94A3B8] shadow-[4px_4px_0px_rgba(51,65,85,0.65)] transition-transform duration-150 hover:-translate-y-[1px]"
              >
                返回项目页
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div
              className="border border-[#334155] bg-black/20 p-4 shadow-[4px_4px_0px_rgba(51,65,85,0.75)]"
              style={{ borderWidth: `${stepsBorderWidth}px` }}
            >
              <div className="font-['PressStart2P'] text-[11px] text-[#94A3B8]">STEPS</div>
              <div className="mt-2 text-2xl font-bold text-[#E2E8F0] tabular-nums font-['PressStart2P']">
                {unlockedCount}/{sortedMilestones.length}
              </div>
            </div>
            <div
              className="border border-[#334155] bg-black/20 p-4 shadow-[4px_4px_0px_rgba(51,65,85,0.75)]"
              style={{ borderWidth: `${currentBorderWidth}px` }}
            >
              <div className="font-['PressStart2P'] text-[11px] text-[#94A3B8]">CURRENT</div>
              <div className="mt-2 text-2xl font-bold text-[#E2E8F0] tabular-nums font-['PressStart2P']">
                {actualPct}%
              </div>
            </div>
            <div className="border-2 border-[#F59E0B] bg-black/20 p-4 shadow-[4px_4px_0px_rgba(245,158,11,0.55)]">
              <div className="font-['PressStart2P'] text-[11px] text-[#FCD34D]">STAGE</div>
              <div className="mt-2 text-[#E2E8F0] text-sm leading-relaxed">
                <span className="font-['PressStart2P'] text-[12px]">
                  {getMilestoneById(sortedMilestones, currentMilestoneId)?.label ?? 'UNKNOWN'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-6">
          <ProjectProgressBar
            actualProgressPct={actualPct}
            displayProgressPct={displayPct}
            milestones={sortedMilestones}
            activeMilestoneId={activeMilestoneId}
            onMilestoneEnter={id => {
              if (selectedMilestoneId) return;
              setHoverMilestoneId(id);
            }}
            onMilestoneLeave={() => {
              if (selectedMilestoneId) return;
              setHoverMilestoneId(null);
            }}
          />

          {selectedMilestoneId ? (
            <div className="border-4 border-[#F59E0B] bg-[#0B0B1A] shadow-[8px_8px_0px_rgba(245,158,11,0.55)]">
              <div className="flex items-start justify-between gap-6 p-6 md:p-7">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 border-2 border-[#F59E0B] bg-black/20 px-3 py-2 shadow-[4px_4px_0px_rgba(245,158,11,0.35)]">
                    <span className="font-['PressStart2P'] text-[12px] text-[#FCD34D]">INSPECT</span>
                    <span className="text-[#94A3B8] text-[12px]">阶段详情</span>
                    {selectedLocked ? (
                      <span className="ml-2 border-2 border-[#334155] bg-black/20 px-2 py-1 text-[#94A3B8] shadow-[2px_2px_0px_rgba(51,65,85,0.55)]">
                        <span className="font-['PressStart2P'] text-[10px]">LOCKED</span>
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 text-2xl md:text-3xl font-bold text-[#E2E8F0]">
                    <span className="font-['PressStart2P']">{selectedMilestone?.label ?? 'STAGE'}</span>
                    <span className="ml-3 text-[#FCD34D] font-['PressStart2P'] tabular-nums text-lg md:text-xl">
                      {selectedMilestone?.pct ?? displayPct}%
                    </span>
                  </div>

                  <div className="mt-3 text-[#CBD5E1] leading-relaxed">{selectedMilestone?.description}</div>

                  {selectedTimeline ? (
                    <div className="mt-5 border-2 border-[#334155] bg-black/15 p-4 shadow-[4px_4px_0px_rgba(51,65,85,0.55)]">
                      <div className="text-[#E2E8F0] font-semibold">{selectedTimeline.title}</div>
                      <div className="mt-1 text-[12px] text-[#94A3B8]">{selectedTimeline.date}</div>
                      <div className="mt-3 text-[13px] leading-relaxed text-[#CBD5E1]">{selectedTimeline.detail}</div>
                      {selectedTimeline.result ? (
                        <div className="mt-4 border-l-2 border-[#F43F5E] pl-4 text-[13px] text-[#E2E8F0]">
                          <span className="font-['PressStart2P'] text-[10px] text-[#FCA5A5]">RESULT</span>
                          <span className="ml-2">{selectedTimeline.result}</span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="shrink-0 grid gap-3">
                  <button
                    type="button"
                    onClick={closeInspect}
                    className="border-2 border-[#E2E8F0] bg-black/10 px-4 py-3 text-[#E2E8F0] shadow-[4px_4px_0px_rgba(226,232,240,0.25)] transition-transform duration-150 hover:-translate-y-[1px]"
                  >
                    <span className="font-['PressStart2P'] text-[12px]">返回当前</span>
                  </button>
                  <a
                    href="/projects"
                    className="border-2 border-[#334155] bg-black/10 px-4 py-3 text-[#94A3B8] shadow-[4px_4px_0px_rgba(51,65,85,0.65)] transition-transform duration-150 hover:-translate-y-[1px]"
                  >
                    <span className="font-['PressStart2P'] text-[12px]">项目列表</span>
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </div>

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
            setSelectedMilestoneId(id);
          }}
        />
      </div>
    </div>
  );
};

export default ProjectProgressHUD;
