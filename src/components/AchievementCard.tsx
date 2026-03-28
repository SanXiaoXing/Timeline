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
  { border: string; glow: string; badgeBg: string; badgeText: string; pulseGlow: string }
> = {
  common: {
    border: 'rgba(52, 211, 153, 0.4)', // Emerald 400 with opacity
    glow: 'rgba(16, 185, 129, 0.15)',
    pulseGlow: 'rgba(16, 185, 129, 0.25)',
    badgeBg: 'rgba(16, 185, 129, 0.08)',
    badgeText: '#6EE7B7' // Emerald 300
  },
  rare: {
    border: 'rgba(56, 189, 248, 0.4)', // Sky 400 with opacity
    glow: 'rgba(14, 165, 233, 0.15)',
    pulseGlow: 'rgba(14, 165, 233, 0.25)',
    badgeBg: 'rgba(14, 165, 233, 0.08)',
    badgeText: '#7DD3FC' // Sky 300
  },
  epic: {
    border: 'rgba(167, 139, 250, 0.4)', // Violet 400 with opacity
    glow: 'rgba(139, 92, 246, 0.15)',
    pulseGlow: 'rgba(139, 92, 246, 0.25)',
    badgeBg: 'rgba(139, 92, 246, 0.08)',
    badgeText: '#C4B5FD' // Violet 300
  },
  legendary: {
    border: 'rgba(251, 191, 36, 0.4)', // Amber 400 with opacity
    glow: 'rgba(245, 158, 11, 0.15)',
    pulseGlow: 'rgba(245, 158, 11, 0.25)',
    badgeBg: 'rgba(245, 158, 11, 0.08)',
    badgeText: '#FCD34D' // Amber 300
  }
};

export type AchievementCardProps = {
  achievement: Achievement;
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prevUnlockedRef = useRef<boolean>(achievement.unlocked);
  const completeTweenRef = useRef<gsap.core.Timeline | null>(null);

  const theme = useMemo(() => rarityTheme[achievement.rarity], [achievement.rarity]);
  const progressPct = useMemo(() => Math.min(100, Math.max(0, achievement.progressPct)), [achievement.progressPct]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const wasUnlocked = prevUnlockedRef.current;
    const isUnlocked = achievement.unlocked;
    prevUnlockedRef.current = isUnlocked;
    if (wasUnlocked || !isUnlocked) return;

    const baseShadow = `0 0 0 2px ${theme.border} inset, 0 0 18px ${theme.glow}, 0 0 44px rgba(244,63,94,0.14)`;

    const tl = gsap.timeline();
    el.classList.add('achv-unlocking');
    tl.set(el, { willChange: 'transform, filter, box-shadow' });
    tl.fromTo(
      el,
      { filter: 'grayscale(1) brightness(0.6)', boxShadow: 'none', scale: 0.98 },
      { filter: 'none', boxShadow: baseShadow, scale: 1, duration: 0.28, ease: 'power2.out' }
    );
    tl.to(el, { boxShadow: `0 0 0 2px ${theme.border} inset, 0 0 34px ${theme.glow}`, duration: 0.08 });
    tl.to(el, { boxShadow: baseShadow, duration: 0.1 });
    tl.to(el, { boxShadow: `0 0 0 2px ${theme.border} inset, 0 0 46px ${theme.glow}`, duration: 0.12 });
    tl.to(el, { boxShadow: baseShadow, duration: 0.16, ease: 'power2.out' });
    tl.set(el, { willChange: 'auto' });
    tl.call(() => {
      el.classList.remove('achv-unlocking');
    });

    return () => {
      tl.kill();
      el.classList.remove('achv-unlocking');
    };
  }, [achievement.unlocked, theme.border, theme.glow]);

  return (
    <div
      ref={cardRef}
      data-achievement-id={achievement.id}
      className={[
        'group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 backdrop-blur-md h-[140px] md:h-[160px] cursor-pointer',
        achievement.unlocked
          ? 'bg-zinc-900/40 hover:bg-zinc-900/60 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] achv-unlocked-card'
          : 'border-white/5 bg-zinc-950/50 opacity-70 grayscale-[0.6] hover:grayscale-[0.3]'
      ].join(' ')}
      style={{
        borderColor: achievement.unlocked ? theme.border : 'rgba(255,255,255,0.05)',
        '--achv-glow-color': theme.pulseGlow,
        '--achv-border-color': theme.border
      } as React.CSSProperties}
      aria-label={achievement.unlocked ? `成就：${achievement.name}` : `未解锁成就：${achievement.name}`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
      {achievement.unlocked && (
        <div 
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[3rem] opacity-0 group-hover:opacity-40 transition-opacity duration-700 z-0"
          style={{ backgroundColor: theme.glow }}
        ></div>
      )}

      {/* Progress Line for Locked Achievements */}
      {!achievement.unlocked && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-800/50 z-20">
          <div 
            className="h-full bg-indigo-500/50 transition-all duration-1000 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      <div className="achv-flash pointer-events-none absolute inset-0 opacity-0 z-10" aria-hidden="true" />

      {/* Default State: Centered Icon & Name */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-6 transition-all duration-500 group-hover:-translate-y-4 group-hover:opacity-0 group-focus-within:-translate-y-4 group-focus-within:opacity-0">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-zinc-900/90 text-3xl shadow-lg backdrop-blur-xl mb-4 transition-transform duration-500 group-hover:scale-110"
          style={{ borderColor: achievement.unlocked ? theme.border : 'rgba(255,255,255,0.1)' }}
          aria-hidden="true"
        >
          {achievement.icon}
        </div>
        <h3 className="text-center text-lg md:text-xl font-bold tracking-tight text-zinc-100 px-2 line-clamp-1">
          {achievement.name}
        </h3>
      </div>

      {/* Hover State: Detailed Description */}
      <div className="absolute inset-0 z-30 flex flex-col p-5 md:p-6 opacity-0 translate-y-8 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 bg-zinc-950/95 backdrop-blur-md">
        
        <p className="text-sm md:text-base leading-relaxed text-zinc-300 font-light flex-1 overflow-y-auto custom-scrollbar pr-2 mt-2">
          {achievement.description}
        </p>

        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col shrink-0 justify-end min-h-[24px]">
          {!achievement.unlocked ? (
            <div className="flex items-center gap-2 mt-auto">
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-indigo-400 w-8 text-right shrink-0">{progressPct}%</span>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-auto">
              <div className="flex gap-2">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border"
                  style={{ borderColor: theme.border, color: theme.badgeText, backgroundColor: theme.badgeBg }}
                >
                  {achievementRarityLabels[achievement.rarity]}
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 font-medium font-mono">
                {achievement.unlockedAt ? achievement.unlockedAt.split(' ')[0] : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      <span className="achv-burst pointer-events-none absolute inset-0 opacity-0 z-40" aria-hidden="true" />

      <style>{`
        .achv-unlocked-card {
          animation: achvPulseGlow 4s ease-in-out infinite alternate;
        }
        @keyframes achvPulseGlow {
          0% {
            box-shadow: 0 0 0 1px var(--achv-border-color) inset, 0 0 8px var(--achv-glow-color) inset, 0 0 4px transparent;
          }
          50% {
            box-shadow: 0 0 0 1px var(--achv-border-color) inset, 0 0 12px var(--achv-glow-color) inset, 0 0 12px var(--achv-glow-color);
          }
          100% {
            box-shadow: 0 0 0 1px var(--achv-border-color) inset, 0 0 8px var(--achv-glow-color) inset, 0 0 4px transparent;
          }
        }
        .achv-unlocking .achv-burst {
          opacity: 1;
          animation: achvBurst 820ms ease-out forwards;
        }
        @keyframes achvBurst {
          0% {
            transform: scale(0.92);
            filter: blur(0px);
            opacity: 0;
          }
          15% { opacity: 1; }
          100% {
            transform: scale(1.18);
            filter: blur(0.6px);
            opacity: 0;
          }
        }
        .achv-burst {
          background:
            radial-gradient(circle at 20% 30%, rgba(245,158,11,0.55) 0 2px, transparent 3px),
            radial-gradient(circle at 62% 18%, rgba(56,189,248,0.55) 0 2px, transparent 3px),
            radial-gradient(circle at 78% 44%, rgba(244,63,94,0.55) 0 2px, transparent 3px),
            radial-gradient(circle at 34% 70%, rgba(167,139,250,0.55) 0 2px, transparent 3px),
            radial-gradient(circle at 76% 82%, rgba(34,197,94,0.55) 0 2px, transparent 3px);
          background-repeat: no-repeat;
        }
      `}</style>
    </div>
  );
};

export default AchievementCard;
