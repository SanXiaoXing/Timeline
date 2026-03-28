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
