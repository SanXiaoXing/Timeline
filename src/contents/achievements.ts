export type AchievementCategory = 'life' | 'study' | 'career' | 'skill' | 'mindset';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type Achievement = {
  id: string;
  icon: string;
  name: string;
  description: string;
  category: AchievementCategory[];
  rarity: AchievementRarity;
  progressPct: number;
  unlocked: boolean;
  unlockedAt?: string;
};

export const achievementCategoryLabels: Record<AchievementCategory, string> = {
  life: '人生',
  study: '学业',
  career: '职业',
  skill: '技能',
  mindset: '心态 / 自我成长'
};

export const achievementRarityLabels: Record<AchievementRarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说'
};

export const achievements: Achievement[] = [
  {
    id: 'life-01',
    icon: '🧭',
    name: '人生主线：开启',
    description: '第一次明确记录自己的阶段目标与长期计划。',
    category: ['life'],
    rarity: 'common',
    progressPct: 100,
    unlocked: true,
    unlockedAt: '2025-12-01 21:10'
  },
  {
    id: 'study-01',
    icon: '📚',
    name: 'Astro框架学习',
    description: '学习Astro框架，搭建个人博客以及主页。',
    category: ['study'],
    rarity: 'rare',
    progressPct: 100,
    unlocked: true,
    unlockedAt: '2025-03-08 09:22'
  },
  {
    id: 'career-01',
    icon: '🧑‍💻',
    name: '完成一次项目开发及交付',
    description: '完成公司内一个重大项目交付，以及功能开发。',
    category: ['career'],
    rarity: 'epic',
    progressPct: 45,
    unlocked: false
  },
  {
    id: 'career-02',
    icon: '🛠️',
    name: '独立开发者',
    description: '独立完成一个可用产品：设计、开发、部署与迭代。',
    category: ['career'],
    rarity: 'epic',
    progressPct: 58,
    unlocked: false
  },
  {
    id: 'skill-01',
    icon: '⚙️',
    name: '完整装机',
    description: '从机箱到内存、显卡等配件，完整安装属于自己的主机。',
    category: ['skill'],
    rarity: 'rare',
    progressPct: 100,
    unlocked: true,
    unlockedAt: '2024-10-30 18:40'
  },
  {
    id: 'mindset-01',
    icon: '🧘',
    name: '心态：稳定输出',
    description: '在压力下依然保持节奏：每天输出一个小成果，连续 14 天。',
    category: ['mindset'],
    rarity: 'rare',
    progressPct: 24,
    unlocked: false
  },
  {
    id: 'life-02',
    icon: '🏆',
    name: '人生终章：自由阶段',
    description: '拥有可持续的时间与选择权，并持续创造自己想要的作品。',
    category: ['life', 'mindset'],
    rarity: 'legendary',
    progressPct: 6,
    unlocked: false
  }
];
