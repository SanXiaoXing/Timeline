import type { Project } from './types';

export const project: Project = {
  slug: 'pixel-quest',
  name: '像素任务板（Pixel Quest Board）',
  status: 'paused',
  currentStage: '等待下一次迭代：整理任务与性能优化',
  progressPct: 42,
  milestones: [
    { id: 'm1', label: '立项', pct: 10, description: '确定任务板信息结构：任务、阶段、奖励与状态。' },
    { id: 'm2', label: 'UI 组件', pct: 25, description: '完成任务卡片、筛选、标签与 HUD 头部组件。' },
    { id: 'm3', label: '动效系统', pct: 40, description: '统一进入/切换/数值变化动效节奏，建立动效基线。' },
    { id: 'm4', label: '数据驱动', pct: 60, description: '任务来自 TS/JSON，支持状态与筛选联动。' },
    { id: 'm5', label: '发布', pct: 100, description: '打磨交互与可读性，完成发布版本。' }
  ],
  timeline: [
    {
      id: 't1',
      milestoneId: 'm1',
      title: '任务接取：像素任务板',
      date: '2026-01-10',
      detail: '定义任务/阶段/奖励的数据模型与页面骨架。'
    },
    {
      id: 't2',
      milestoneId: 'm2',
      title: 'HUD 组件搭建',
      date: '2026-01-12',
      detail: '完成卡片布局、霓虹描边与锁定态视觉规范。',
      result: 'UI 基线可复用'
    },
    {
      id: 't3',
      milestoneId: 'm3',
      title: '动效节奏统一',
      date: '2026-01-15',
      detail: '引入 ease-out 动效并规范 hover/enter 的时长与发光强度。'
    },
    {
      id: 't4',
      milestoneId: 'm4',
      title: '数据驱动（锁定）',
      date: '????-??-??',
      detail: '把任务状态与筛选完全数据化，支持多项目复用。'
    },
    {
      id: 't5',
      milestoneId: 'm5',
      title: '发布（锁定）',
      date: '????-??-??',
      detail: '性能与可访问性优化，输出稳定版本。'
    }
  ]
};

