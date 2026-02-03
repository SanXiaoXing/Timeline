import type { Project } from './types';

export const project: Project = {
  slug: 'timeline',
  name: '人生时间轴Idea落地',
  status: 'completed',
  achievementTags: ['skill'],
  currentStage: '完成发布',
  progressPct: 100,
  milestones: [
    { id: 'm1', label: '立项', pct: 10, description: '项目是天马行空想出来的，想为自己做一个时间轴作为项目的初始，并为项目进度以及个人心情作为一个记录点。' },
    { id: 'm2', label: '像素化 HUD', pct: 30, description: '确定页面信息架构与组件边界，搭建 Astro + React 基础：划分首页、时间轴、成就墙三大核心路由；定义通用卡片、进度条、像素按钮等原子组件；配置 Astro 的静态输出与 React 的客户端水合策略，确保首屏秒开且交互流畅；同时引入 UnoCSS 实现原子化样式，统一设计 tokens（色板、圆角、阴影），为后续像素游戏风格奠定可扩展的技术底座。' },
    { id: 'm3', label: '时间进度系统', pct: 50, description: '进度条缓动、滚动数字、周进度卡片与布局修复，完成日/月/年/周进度与滚动数字动效，增强沉浸感。' },
    { id: 'm4', label: '成就墙', pct: 65, description: '经过讨论与脑洞风暴过后，采取用成就系统来记录个人的关键节点，并且督促自己完成这些节点，从而提升自己的效率与质量。' },
    { id: 'm5', label: '副本进度页', pct: 80, description: '新增单项目进度条与时间轴联动页面，里程碑与剧情节点一一对应，为单项目提供任务进度条与剧情日志联动页面。' },
    { id: 'm6', label: '发布', pct: 100, description: '最终整理：内容校对、动效节奏统一、性能与无障碍优化，整理内容与性能优化，发布稳定版本。' }
  ],
  timeline: [
    {
      id: 't1',
      milestoneId: 'm1',
      title: '天马行空',
      date: '2025-11-10',   
      detail: 'Idea 无意间行程',
      result: 'Idea 成型'
    },
    {
      id: 't2',
      milestoneId: 'm2',
      title: '想法落地',
      date: '2025-11-20',
      detail: '根据 Idea 确定页面信息架构与组件边界，搭建 Astro + React 基础。',
      result: '框架搭建起来并实施一部分'
    },
    {
      id: 't3',
      milestoneId: 'm3',
      title: '时间进度系统完成',
      date: '2025-12-29',
      detail: '进度条缓动、滚动数字、周进度卡片与布局修复。',
      result: '仪表盘可用'
    },
    {
      id: 't4',
      milestoneId: 'm4',
      title: '成就墙系统上线',
      date: '2026-02-01',
      detail: '成就墙实现锁定/解锁视觉、稀有度与筛选功能。',
      result: '任务系统成型'
    },
    {
      id: 't5',
      milestoneId: 'm5',
      title: '副本进度页',
      date: '2026-02-02',
      detail: '新增单项目进度条与时间轴联动页面，里程碑与剧情节点一一对应。',
      result: '副本进度页可用'
    },
    {
      id: 't6',
      milestoneId: 'm6',
      title: '发布',
      date: '2026-02-03',
      detail: '最终整理：内容校对、动效节奏统一、性能与无障碍优化。',
      result: '项目发布，完成时间轴的出版设计，以及内容的基本完善。'
    }
  ]
};
