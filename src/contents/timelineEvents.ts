export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
}

export const EVENTS: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-01-15',
    title: '项目启动',
    description: '确立了以复古像素风格为核心的设计语言，完成了初步的技术选型（Astro + React + Tailwind）。',
    tags: ['Kickoff', 'Design']
  },
  {
    id: '2',
    date: '2024-02-01',
    title: '核心组件开发',
    description: '完成了 TimeProgress 和 RollingNumber 组件的开发，实现了基于时间的动态进度展示。',
    tags: ['Dev', 'React']
  },
  {
    id: '3',
    date: '2024-02-20',
    title: '视觉风格重构',
    description: '全站进行像素化改造，引入 CRT 扫描线效果、Press Start 2P 字体以及 NES.css 风格的 UI 元素。',
    tags: ['UI/UX', 'Pixel Art']
  },
  {
    id: '4',
    date: '2024-03-10',
    title: '动画交互优化',
    description: '引入 GSAP ScrollTrigger 实现丝滑的滚动动画，优化了数字滚动的回弹效果。',
    tags: ['Animation', 'GSAP']
  },
  {
    id: '5',
    date: '2024-03-25',
    title: '发布 v1.0',
    description: '正式上线第一个版本，集成了博客、时间轴和个人展示页。',
    tags: ['Release', 'Milestone']
  }
];
