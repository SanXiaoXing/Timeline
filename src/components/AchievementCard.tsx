import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

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

const rarityTheme: Record<
  AchievementRarity,
  {
    border: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
    pulseGlow: string;
    gradient: string;
    shadow: string;
  }
> = {
  common: {
    border: 'rgba(16, 185, 129, 0.5)',
    glow: 'rgba(16, 185, 129, 0.15)',
    pulseGlow: 'rgba(16, 185, 129, 0.3)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeText: '#059669',
    gradient: 'from-emerald-400/20 to-teal-400/20',
    shadow: 'shadow-emerald-200/50'
  },
  rare: {
    border: 'rgba(14, 165, 233, 0.5)',
    glow: 'rgba(14, 165, 233, 0.15)',
    pulseGlow: 'rgba(14, 165, 233, 0.3)',
    badgeBg: 'rgba(14, 165, 233, 0.15)',
    badgeText: '#0284c7',
    gradient: 'from-sky-400/20 to-cyan-400/20',
    shadow: 'shadow-sky-200/50'
  },
  epic: {
    border: 'rgba(139, 92, 246, 0.5)',
    glow: 'rgba(139, 92, 246, 0.15)',
    pulseGlow: 'rgba(139, 92, 246, 0.3)',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    badgeText: '#7c3aed',
    gradient: 'from-violet-400/20 to-purple-400/20',
    shadow: 'shadow-violet-200/50'
  },
  legendary: {
    border: 'rgba(245, 158, 11, 0.5)',
    glow: 'rgba(245, 158, 11, 0.15)',
    pulseGlow: 'rgba(245, 158, 11, 0.3)',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeText: '#d97706',
    gradient: 'from-amber-400/20 to-orange-400/20',
    shadow: 'shadow-amber-200/50'
  }
};

export type AchievementCardProps = {
  achievement: Achievement;
  index?: number;
  onCardClick?: (achievement: Achievement) => void;
};

const CircularProgress: React.FC<{ progress: number; color: string }> = ({ progress, color }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <svg
      className="absolute inset-0 w-full h-full -rotate-90"
      viewBox="0 0 64 64"
    >
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="3"
      />
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          filter: `drop-shadow(0 0 4px ${color})`,
          transition: 'stroke-dashoffset 0.5s ease-out'
        }}
      />
    </svg>
  );
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index = 0, onCardClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const prevUnlockedRef = useRef<boolean>(achievement.unlocked);

  const theme = useMemo(() => rarityTheme[achievement.rarity], [achievement.rarity]);
  const progressPct = useMemo(() => Math.min(100, Math.max(0, achievement.progressPct)), [achievement.progressPct]);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    gsap.fromTo(card,
      {
        scale: 0.8,
        opacity: 0,
        y: 50
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.08,
        ease: 'back.out(1.4)'
      }
    );
  }, [index]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const wasUnlocked = prevUnlockedRef.current;
    const isUnlocked = achievement.unlocked;
    prevUnlockedRef.current = isUnlocked;
    if (wasUnlocked || !isUnlocked) return;

    const tl = gsap.timeline();

    tl.to(el, {
      scale: 1.05,
      duration: 0.15,
      ease: 'power2.out'
    })
    .to(el, {
      scale: 1,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)'
    })
    .to(el, {
      boxShadow: `0 0 60px ${theme.pulseGlow}, 0 0 100px ${theme.glow}`,
      duration: 0.3
    }, '-=0.3')
    .to(el, {
      boxShadow: `0 0 20px ${theme.glow}`,
      duration: 0.5
    });

    return () => {
      tl.kill();
    };
  }, [achievement.unlocked, theme.glow, theme.pulseGlow]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });

    gsap.to(glowRef.current, {
      x: (x - centerX) / 2,
      y: (y - centerY) / 2,
      duration: 0.3
    });
  };

  const handleMouseEnter = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      y: -10,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current) return;

    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });

    gsap.to(glowRef.current, {
      x: 0,
      y: 0,
      duration: 0.3
    });
  };

  const handleClick = () => {
    onCardClick?.(achievement);
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full h-[180px] cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-achievement-id={achievement.id}
      data-magnetic
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      <div
        ref={glowRef}
        className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500 ${
          achievement.unlocked ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle at center, ${theme.glow}, transparent 70%)`,
          transform: 'translateZ(-10px)'
        }}
      />

      <div
        className={`relative w-full h-full rounded-2xl border-2 backdrop-blur-md overflow-hidden ${
          achievement.unlocked
            ? `bg-gradient-to-br ${theme.gradient} ${theme.shadow}`
            : 'bg-neutral-100/50 grayscale'
        }`}
        style={{
          borderColor: achievement.unlocked ? theme.border : 'rgba(0,0,0,0.1)',
          boxShadow: achievement.unlocked
            ? `0 4px 20px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`
            : 'none'
        }}
      >
        {achievement.unlocked && (
          <div
            className="absolute inset-0 rounded-2xl opacity-50"
            style={{
              background: `linear-gradient(135deg, transparent 40%, ${theme.glow} 50%, transparent 60%)`,
              backgroundSize: '200% 200%',
              animation: 'shimmer 3s ease-in-out infinite'
            }}
          />
        )}

        <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
          {!achievement.unlocked && (
            <span className="absolute top-2 left-2 text-lg opacity-40">🔒</span>
          )}

          <div className="relative mb-3">
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl border-2 ${
                achievement.unlocked
                  ? 'bg-white/80 shadow-lg'
                  : 'bg-neutral-200/50'
              }`}
              style={{
                borderColor: achievement.unlocked ? theme.border : 'rgba(0,0,0,0.1)',
                boxShadow: achievement.unlocked ? `0 0 20px ${theme.glow}` : 'none'
              }}
            >
              {!achievement.unlocked && (
                <CircularProgress progress={progressPct} color={theme.border.split(',')[0].replace('rgba(', '')} />
              )}
              <span style={!achievement.unlocked ? { filter: 'grayscale(100%)', opacity: 0.5 } : {}}>
                {achievement.icon}
              </span>
            </div>

            {achievement.unlocked && (
              <div
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                  backgroundSize: '200% 200%',
                  animation: 'shine 1s ease-in-out'
                }}
              />
            )}
          </div>

          <h3 className={`text-center font-bold text-base px-2 line-clamp-2 ${
            achievement.unlocked ? 'text-neutral-800' : 'text-neutral-400'
          }`}>
            {achievement.name}
          </h3>

          <span
            className={`mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
              achievement.unlocked ? '' : 'opacity-50'
            }`}
            style={{
              borderColor: theme.border,
              color: theme.badgeText,
              backgroundColor: theme.badgeBg
            }}
          >
            {achievementRarityLabels[achievement.rarity]}
          </span>

          {!achievement.unlocked && (
            <div className="mt-3 text-[11px] text-neutral-500 font-mono font-semibold">
              {progressPct}%
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
        @keyframes shine {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
      `}</style>
    </div>
  );
};

export default AchievementCard;
