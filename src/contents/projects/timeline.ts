import type { Project } from './types';

export const project: Project = {
  slug: 'timeline',
  name: '时间轴项目（Timeline Dungeon）',
  status: 'in_progress',
  currentStage: 'UI/动效与任务系统迭代中',
  progressPct: 68,
  milestones: [
    { id: 'm1', label: '立项', pct: 10, description: '确定主题与信息结构，完成基础页面骨架。' },
    { id: 'm2', label: '像素化 HUD', pct: 30, description: '统一深色像素游戏风格：硬边框、硬阴影与霓虹描边。' },
    { id: 'm3', label: '时间进度系统', pct: 50, description: '完成日/月/年/周进度与滚动数字动效，增强沉浸感。' },
    { id: 'm4', label: '成就墙', pct: 65, description: '实现成就页：锁定/解锁视觉、稀有度与筛选。' },
    { id: 'm5', label: '副本进度页', pct: 80, description: '为单项目提供任务进度条与剧情日志联动页面。' },
    { id: 'm6', label: '发布', pct: 100, description: '整理内容与性能优化，发布稳定版本。' }
  ],
  timeline: [
    {
      id: 't1',
      milestoneId: 'm1',
      title: '任务接取：立项',
      date: '2026-01-20',
      detail: '确定页面信息架构与组件边界，搭建 Astro + React 基础。',
      result: '站点骨架可运行'
    },
    {
      id: 't2',
      milestoneId: 'm2',
      title: '像素 HUD 风格落地',
      date: '2026-01-24',
      detail: '统一配色与边框/阴影语言，加入 CRT 扫描线氛围。',
      result: '视觉一致性提升'
    },
    {
      id: 't3',
      milestoneId: 'm3',
      title: '时间进度系统完成',
      date: '2026-01-29',
      detail: '进度条缓动、滚动数字、周进度卡片与布局修复。',
      result: '仪表盘可用'
    },
    {
      id: 't4',
      milestoneId: 'm4',
      title: '成就墙系统上线',
      date: '2026-02-02',
      detail: '成就页与首页轮播落地，锁定/解锁与稀有度视觉完成。',
      result: '任务系统成型'
    },
    {
      id: 't5',
      milestoneId: 'm5',
      title: '副本进度页（当前任务）',
      date: '2026-02-03',
      detail: '新增单项目进度条与时间轴联动页面，里程碑与剧情节点一一对应。'
    },
    {
      id: 't6',
      milestoneId: 'm6',
      title: '发布（锁定）',
      date: '????-??-??',
      detail: '最终整理：内容校对、动效节奏统一、性能与无障碍优化。'
    }
  ]
};

