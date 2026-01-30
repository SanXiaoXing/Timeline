export interface ProjectEvent {
  id: string;
  date: string;
  status: 'completed' | 'in-progress' | 'planned' | 'paused';
  title: string;
  description: string;
  techStack: string[];
  progress: number; // 0-100
  link?: string;
}

export const PROJECT_EVENTS: ProjectEvent[] = [
  {
    id: 'p1',
    date: '2023-11',
    status: 'completed',
    title: '个人博客初始化',
    description: '搭建 Astro + React 基础架构，配置 TailwindCSS 和基础路由。',
    techStack: ['Astro', 'React', 'Tailwind'],
    progress: 100
  },
  {
    id: 'p2',
    date: '2023-12',
    status: 'completed',
    title: '像素风格重构',
    description: '确立 8-bit 视觉语言，引入 Press Start 2P 字体，实现 CRT 屏幕效果。',
    techStack: ['CSS', 'Design'],
    progress: 100
  },
  {
    id: 'p3',
    date: '2024-01',
    status: 'completed',
    title: '时间轴组件开发',
    description: '开发 PixelTimeline 和 ProjectQuestLog 组件，实现基于 GSAP 的滚动动画。',
    techStack: ['GSAP', 'React'],
    progress: 100
  },
  {
    id: 'p4',
    date: 'NOW',
    status: 'in-progress',
    title: 'AI 助手集成',
    description: '正在探索将 LLM 能力集成到博客中，实现自动摘要和智能问答功能。',
    techStack: ['OpenAI', 'Vercel AI SDK'],
    progress: 45
  },
  {
    id: 'p5',
    date: 'FUTURE',
    status: 'planned',
    title: 'Web3 身份认证',
    description: '计划支持 ENS 登录和 NFT 徽章展示功能。',
    techStack: ['Ethers.js', 'Solidity'],
    progress: 0
  }
];
