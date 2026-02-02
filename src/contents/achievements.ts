export type AchievementCategory = 'life' | 'study' | 'career' | 'skill' | 'mindset';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type Achievement = {
  id: string;
  icon: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
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
    category: 'life',
    rarity: 'common',
    unlocked: true,
    unlockedAt: '2025-12-01 21:10'
  },
  {
    id: 'study-01',
    icon: '📚',
    name: '知识树：点亮一格',
    description: '连续 7 天保持学习输入，并完成一次总结输出。',
    category: 'study',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'career-01',
    icon: '🧑‍💻',
    name: '初级工程师',
    description: '完成一次从需求到上线的完整交付闭环。',
    category: 'career',
    rarity: 'common',
    unlocked: true,
    unlockedAt: '2026-01-08 09:22'
  },
  {
    id: 'career-02',
    icon: '🛠️',
    name: '独立开发者',
    description: '独立完成一个可用产品：设计、开发、部署与迭代。',
    category: 'career',
    rarity: 'epic',
    unlocked: false
  },
  {
    id: 'skill-01',
    icon: '⚙️',
    name: '动效工程师',
    description: '将页面动效系统化：进入、滚动、数值变化统一节奏与曲线。',
    category: 'skill',
    rarity: 'rare',
    unlocked: true,
    unlockedAt: '2026-01-30 18:40'
  },
  {
    id: 'skill-02',
    icon: '🎮',
    name: '像素美术：入门',
    description: '完成一套像素 HUD 风格的界面组件，并在项目中落地。',
    category: 'skill',
    rarity: 'epic',
    unlocked: true,
    unlockedAt: '2026-01-31 02:05'
  },
  {
    id: 'mindset-01',
    icon: '🧘',
    name: '心态：稳定输出',
    description: '在压力下依然保持节奏：每天输出一个小成果，连续 14 天。',
    category: 'mindset',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'life-02',
    icon: '🏆',
    name: '人生终章：自由阶段',
    description: '拥有可持续的时间与选择权，并持续创造自己想要的作品。',
    category: 'life',
    rarity: 'legendary',
    unlocked: false
  }
];

