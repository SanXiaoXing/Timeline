import React, { useId, useMemo, useRef } from 'react';

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

export const achievementRarityLabels: Record<AchievementRarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说'
};

/** 国画颜料色系 — ink painting palette */
const rarityTheme: Record<
  AchievementRarity,
  { ink: string; lightInk: string; seal: string; sealBg: string; name: string }
> = {
  common: {
    ink: '#5B6B5A',       // 墨绿 — pine ink green
    lightInk: 'rgba(91,107,90,0.12)',
    seal: '#8B5E4B',      // 赭石 — ochre
    sealBg: 'rgba(139,94,75,0.10)',
    name: '普通',
  },
  rare: {
    ink: '#4A5F7A',       // 靛青 — indigo
    lightInk: 'rgba(74,95,122,0.12)',
    seal: '#5B6B8A',      // 石青 — azurite
    sealBg: 'rgba(91,107,138,0.10)',
    name: '稀有',
  },
  epic: {
    ink: '#6B4A7A',       // 紫矿 — purple mineral
    lightInk: 'rgba(107,74,122,0.12)',
    seal: '#7A5A6B',      // 胭脂 — rouge
    sealBg: 'rgba(122,90,107,0.10)',
    name: '史诗',
  },
  legendary: {
    ink: '#8B3A3A',       // 朱砂 — cinnabar
    lightInk: 'rgba(139,58,58,0.12)',
    seal: '#C43A3A',      // 大红 — vermillion
    sealBg: 'rgba(196,58,58,0.10)',
    name: '传说',
  },
};

export type AchievementCardProps = {
  achievement: Achievement;
  index?: number;
  onCardClick?: (achievement: Achievement) => void;
};

/* ── 国画印章 SVG ── */
const SealStamp: React.FC<{ text: string; color: string; locked: boolean }> = ({ text, color, locked }) => (
  <div
    className="absolute select-none pointer-events-none"
    style={{
      top: '12px',
      right: '14px',
      width: '44px',
      height: '44px',
      transform: 'rotate(8deg)',
      opacity: locked ? 0.25 : 0.85,
      transition: 'opacity 0.5s ease',
    }}
  >
    <svg viewBox="0 0 44 44" width="44" height="44">
      <rect
        x="3" y="3" width="38" height="38"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        rx="1"
      />
      <rect
        x="6" y="6" width="32" height="32"
        fill="none"
        stroke={color}
        strokeWidth="0.6"
        rx="0.5"
      />
      <text
        x="22" y="27"
        textAnchor="middle"
        fill={color}
        fontSize="14"
        fontWeight="700"
        fontFamily="'Noto Serif SC', 'Instrument Serif', serif"
        letterSpacing="0.15em"
      >
        {text}
      </text>
    </svg>
  </div>
);

/* ── 水墨笔触装饰线 ── */
const InkStroke: React.FC<{ color: string; locked: boolean }> = ({ color, locked }) => (
  <svg
    className="absolute left-0 right-0 pointer-events-none"
    style={{ bottom: '0', height: '6px', opacity: locked ? 0.15 : 0.6 }}
    preserveAspectRatio="none"
    viewBox="0 0 400 6"
  >
    <filter id={`ink-stroke-${color.replace('#', '')}`}>
      <feTurbulence type="fractalNoise" baseFrequency="0.04 0.8" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <line
      x1="0" y1="3" x2="400" y2="3"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      filter={`url(#ink-stroke-${color.replace('#', '')})`}
      opacity="0.5"
    />
  </svg>
);

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index = 0, onCardClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = useMemo(() => rarityTheme[achievement.rarity], [achievement.rarity]);
  const progressPct = useMemo(() => Math.min(100, Math.max(0, achievement.progressPct)), [achievement.progressPct]);

  const handleClick = () => {
    onCardClick?.(achievement);
  };

  return (
    <div
      ref={cardRef}
      className="relative cursor-pointer group"
      onClick={handleClick}
      data-achievement-id={achievement.id}
      style={{
        width: '100%',
        height: '100%',
        opacity: 0,
        transform: 'translateY(24px)',
        animation: `cardEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.07}s forwards`,
      }}
    >
      {/* ── 宣纸底色 + 纤维纹理 ── */}
      <div
        className="relative w-full h-full overflow-hidden transition-all duration-500"
        style={{
          backgroundColor: achievement.unlocked ? '#F8F3EB' : '#F3EFE8',
          boxShadow: achievement.unlocked
            ? '0 2px 12px rgba(80,60,40,0.06), 0 1px 3px rgba(80,60,40,0.04)'
            : '0 1px 4px rgba(80,60,40,0.03)',
        }}
      >
        {/* 宣纸纤维纹理 — 水平纤维 + 细微颗粒 + 墨色晕染 */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.65 }}>
          {/* 水平纸纤维 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(180,160,130,0.03) 2px,
                  rgba(180,160,130,0.03) 3px
                ),
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 7px,
                  rgba(160,140,110,0.02) 7px,
                  rgba(160,140,110,0.02) 8px
                )
              `,
            }}
          />
          {/* 细微颗粒噪点 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '100px 100px',
              opacity: 0.35,
              mixBlendMode: 'multiply',
            }}
          />
          {/* 墨色晕染斑块 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='stain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.003' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.6 0 0 0 0 0.55 0 0 0 0 0.5 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23stain)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '400px 400px',
              opacity: 0.5,
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        {/* ── 印章 — 稀有度标记 ── */}
        <SealStamp
          text={theme.name}
          color={theme.seal}
          locked={!achievement.unlocked}
        />

        {/* ── 卡片内容 ── */}
        <div className="relative z-10 h-full flex flex-col p-5 pt-4">
          {/* 图标 — 水墨画心 */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className="transition-all duration-500"
              style={{
                fontSize: '3.25rem',
                lineHeight: 1,
                opacity: achievement.unlocked ? 0.85 : 0.25,
                filter: achievement.unlocked
                  ? 'none'
                  : 'grayscale(100%) blur(1px)',
                transform: achievement.unlocked ? 'scale(1)' : 'scale(0.92)',
              }}
            >
              {achievement.icon}
            </div>
          </div>

          {/* 分隔 — 水墨细线 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1" style={{ height: '1px', background: `linear-gradient(to right, transparent, ${achievement.unlocked ? theme.ink : '#D0CBC3'}, transparent)` }} />
            <div
              className="w-1 h-1"
              style={{
                backgroundColor: achievement.unlocked ? theme.ink : '#D0CBC3',
                opacity: achievement.unlocked ? 0.6 : 0.3,
              }}
            />
            <div className="flex-1" style={{ height: '1px', background: `linear-gradient(to left, transparent, ${achievement.unlocked ? theme.ink : '#D0CBC3'}, transparent)` }} />
          </div>

          {/* 名称 — 画题 */}
          <h3
            className="font-display text-center leading-tight line-clamp-2 transition-all duration-500"
            style={{
              color: achievement.unlocked ? '#3A3430' : '#B0A89F',
              fontSize: '1.05rem',
              letterSpacing: '0.02em',
              marginBottom: achievement.unlocked ? '0.75rem' : '0.5rem',
            }}
          >
            {achievement.name}
          </h3>

          {/* 进度 — 水墨渗透 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-[3px] overflow-hidden" style={{ backgroundColor: 'rgba(180,160,130,0.2)' }}>
              <div
                className="h-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: achievement.unlocked ? theme.ink : '#D0CBC3',
                  opacity: achievement.unlocked ? 0.7 : 0.4,
                  boxShadow: achievement.unlocked ? `0 0 4px ${theme.lightInk}` : 'none',
                }}
              />
            </div>
            <span
              className="font-mono text-[10px] tabular-nums"
              style={{ color: achievement.unlocked ? theme.ink : '#C0B8AD', opacity: achievement.unlocked ? 0.8 : 0.5 }}
            >
              {progressPct}%
            </span>
          </div>
        </div>

        {/* ── 水墨笔触底边 ── */}
        <InkStroke color={theme.ink} locked={!achievement.unlocked} />

        {/* ── Hover: 宣纸加深 ── */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(180deg, ${achievement.unlocked ? theme.lightInk : 'rgba(180,160,130,0.06)'} 0%, transparent 60%)`,
          }}
        />
      </div>

      <style>{`
        @keyframes cardEnter {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AchievementCard;