import type { AchievementCategory } from '../achievements';

export type ProjectStatus = 'in_progress' | 'paused' | 'completed';

export type ProjectMilestone = {
  id: string;
  label: string;
  pct: number;
  description: string;
};

export type ProjectTimelineItem = {
  id: string;
  milestoneId: string;
  title: string;
  date: string;
  detail: string;
  result?: string;
};

export type Project = {
  slug: string;
  name: string;
  status: ProjectStatus;
  achievementTags: AchievementCategory[];
  currentStage: string;
  progressPct: number;
  milestones: ProjectMilestone[];
  timeline: ProjectTimelineItem[];
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  in_progress: '进行中',
  paused: '暂停',
  completed: '已完成'
};