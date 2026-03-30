import React, { useEffect, useMemo, useRef, useState } from 'react';
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
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const prevUnlockedRef = useRef<boolean>(achievement.unlocked);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const theme = useMemo(() => rarityTheme[achievement.rarity], [achievement.rarity]);
  const progressPct = useMemo(() => Math.min(100, Math.max(0, achievement.progressPct)), [achievement.progressPct]);

  // Card entrance animation
  useEffect(() => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    
    // Staggered entrance animation
    gsap.fromTo(card,
      { 
        scale: 0.8, 
        opacity: 0,
        y: 50,
        rotateY: -30
      },
      { 
        scale: 1, 
        opacity: 1,
        y: 0,
        rotateY: 0,
        duration: 0.6,
        delay: index * 0.08,
        ease: "back.out(1.4)"
      }
    );
  }, [index]);

  // Unlock celebration animation
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const wasUnlocked = prevUnlockedRef.current;
    const isUnlocked = achievement.unlocked;
    prevUnlockedRef.current = isUnlocked;
    if (wasUnlocked || !isUnlocked) return;

    const tl = gsap.timeline();
    
    // Celebration sequence
    tl.to(el, {
      scale: 1.05,
      duration: 0.15,
      ease: "power2.out"
    })
    .to(el, {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.5)"
    })
    .to(el, {
      boxShadow: `0 0 60px ${theme.pulseGlow}, 0 0 100px ${theme.glow}`,
      duration: 0.3
    }, "-=0.3")
    .to(el, {
      boxShadow: `0 0 20px ${theme.glow}`,
      duration: 0.5
    });

    return () => {
      tl.kill();
    };
  }, [achievement.unlocked, theme.glow, theme.pulseGlow]);

  // 3D tilt effect on hover (only when not flipped)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !innerRef.current || isFlipped) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(innerRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: "power2.out"
    });

    // Move glow with mouse
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: (x - centerX) / 2,
        y: (y - centerY) / 2,
        duration: 0.3
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!cardRef.current) return;
    
    gsap.to(cardRef.current, {
      y: -10,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current || !innerRef.current) return;

    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });

    // Only reset tilt when not flipped
    if (!isFlipped) {
      gsap.to(innerRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out"
      });

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: 0,
          y: 0,
          duration: 0.3
        });
      }
    }
  };

  const handleClick = () => {
    if (!innerRef.current) return;
    
    setIsFlipped(!isFlipped);
    
    gsap.to(innerRef.current, {
      rotateY: isFlipped ? 0 : 180,
      duration: 0.6,
      ease: "power2.inOut"
    });
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full h-[180px] perspective-1000 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-achievement-id={achievement.id}
      data-magnetic
      style={{ perspective: '1000px' }}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500 ${
          isHovered && achievement.unlocked ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle at center, ${theme.glow}, transparent 70%)`,
          transform: 'translateZ(-10px)'
        }}
      />

      {/* Card inner container for 3D flip */}
      <div
        ref={innerRef}
        className="relative w-full h-full transition-transform"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: 'rotateY(0deg)'
        }}
      >
        {/* Front face */}
        <div
          className={`absolute inset-0 rounded-2xl border-2 backdrop-blur-md overflow-hidden ${
            achievement.unlocked 
              ? `bg-gradient-to-br ${theme.gradient} ${theme.shadow}` 
              : 'bg-neutral-100/50 grayscale'
          }`}
          style={{
            borderColor: achievement.unlocked ? theme.border : 'rgba(0,0,0,0.1)',
            backfaceVisibility: 'hidden',
            boxShadow: achievement.unlocked 
              ? `0 4px 20px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.3)` 
              : 'none'
          }}
        >
          {/* Animated border glow for unlocked cards */}
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

          {/* Card content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
            {/* Icon container */}
            <div 
              className={`relative mb-3 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
            >
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
                {achievement.icon}
              </div>
              
              {/* Shine effect on icon */}
              {achievement.unlocked && (
                <div 
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                    backgroundSize: '200% 200%',
                    animation: isHovered ? 'shine 1s ease-in-out' : 'none'
                  }}
                />
              )}
            </div>

            {/* Name */}
            <h3 className={`text-center font-bold text-base px-2 line-clamp-2 ${
              achievement.unlocked ? 'text-neutral-800' : 'text-neutral-400'
            }`}>
              {achievement.name}
            </h3>

            {/* Rarity badge */}
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

            {/* Progress for locked - positioned below content */}
            {!achievement.unlocked && (
              <div className="mt-4 w-full px-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">进度</span>
                  <span className="text-[11px] text-neutral-500 font-mono font-semibold">{progressPct}%</span>
                </div>
                <div className="h-2 bg-neutral-200/80 rounded-full overflow-hidden border border-neutral-200/50">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Flip hint */}
            {achievement.unlocked && (
              <div className="absolute top-2 right-2 opacity-30">
                <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Back face */}
        <div
          className={`absolute inset-0 rounded-2xl border-2 backdrop-blur-md p-5 ${
            achievement.unlocked 
              ? `bg-white/90 ${theme.shadow}` 
              : 'bg-neutral-100/80 grayscale'
          }`}
          style={{
            borderColor: achievement.unlocked ? theme.border : 'rgba(0,0,0,0.1)',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: achievement.unlocked 
              ? `0 4px 20px ${theme.glow}` 
              : 'none'
          }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{achievement.icon}</span>
              <h4 className={`font-bold text-sm ${achievement.unlocked ? 'text-neutral-800' : 'text-neutral-400'}`}>
                {achievement.name}
              </h4>
            </div>

            {/* Description */}
            <p className={`text-xs leading-relaxed flex-1 overflow-y-auto custom-scrollbar ${
              achievement.unlocked ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              {achievement.description}
            </p>

            {/* Footer info */}
            <div className="mt-3 pt-3 border-t border-neutral-200/50">
              {achievement.unlocked && achievement.unlockedAt ? (
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400">解锁时间</span>
                  <span className="text-neutral-600 font-mono">{achievement.unlockedAt.split(' ')[0]}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400">进度</span>
                  <span className="text-indigo-500 font-mono">{progressPct}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
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
