import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import type { Achievement, AchievementRarity } from '../contents/achievements';
import { achievementRarityLabels } from '../contents/achievements';

const rarityTheme: Record<
  AchievementRarity,
  { border: string; glow: string; badgeBg: string; badgeText: string }
> = {
  common: {
    border: '#22C55E',
    glow: 'rgba(34,197,94,0.55)',
    badgeBg: 'rgba(34,197,94,0.12)',
    badgeText: '#86EFAC'
  },
  rare: {
    border: '#38BDF8',
    glow: 'rgba(56,189,248,0.55)',
    badgeBg: 'rgba(56,189,248,0.12)',
    badgeText: '#7DD3FC'
  },
  epic: {
    border: '#A78BFA',
    glow: 'rgba(167,139,250,0.62)',
    badgeBg: 'rgba(167,139,250,0.12)',
    badgeText: '#C4B5FD'
  },
  legendary: {
    border: '#F59E0B',
    glow: 'rgba(245,158,11,0.62)',
    badgeBg: 'rgba(245,158,11,0.12)',
    badgeText: '#FCD34D'
  }
};

export type AchievementCardProps = {
  achievement: Achievement;
  maskDirection?: 'up' | 'right';
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, maskDirection = 'up' }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prevUnlockedRef = useRef<boolean>(achievement.unlocked);
  const prevProgressRef = useRef<number>(achievement.progressPct);
  const maskTweenRef = useRef<gsap.core.Tween | null>(null);
  const completeTweenRef = useRef<gsap.core.Timeline | null>(null);

  const theme = useMemo(() => rarityTheme[achievement.rarity], [achievement.rarity]);
  const progressPct = useMemo(() => Math.min(100, Math.max(0, achievement.progressPct)), [achievement.progressPct]);
  const lockPct = useMemo(() => 100 - progressPct, [progressPct]);
  const lock = useMemo(() => lockPct / 100, [lockPct]);
  const isComplete = useMemo(() => progressPct >= 100, [progressPct]);

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

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const prev = Math.min(100, Math.max(0, prevProgressRef.current));
    prevProgressRef.current = progressPct;

    const start = Number(el.style.getPropertyValue('--achv-lock-pct') || String(100 - prev));
    const target = lockPct;
    const step = 4;

    if (maskTweenRef.current) maskTweenRef.current.kill();
    const state = { v: start };
    maskTweenRef.current = gsap.to(state, {
      v: target,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        const snapped = Math.max(0, Math.min(100, Math.round(state.v / step) * step));
        el.style.setProperty('--achv-lock-pct', String(snapped));
        el.style.setProperty('--achv-lock', String(snapped / 100));
      },
      onComplete: () => {
        el.style.setProperty('--achv-lock-pct', String(target));
        el.style.setProperty('--achv-lock', String(lock));
      }
    });

    if (prev < 100 && progressPct >= 100) {
      const flash = el.querySelector('.achv-flash') as HTMLElement | null;
      if (completeTweenRef.current) completeTweenRef.current.kill();
      completeTweenRef.current = gsap.timeline();
      el.classList.add('achv-unlocking');
      completeTweenRef.current.set(el, { willChange: 'transform, filter, box-shadow' });
      if (flash) {
        completeTweenRef.current.fromTo(
          flash,
          { opacity: 0 },
          { opacity: 0.9, duration: 0.08, ease: 'power1.out', yoyo: true, repeat: 1 }
        );
      }
      completeTweenRef.current.to(el, { boxShadow: `0 0 0 2px ${theme.border} inset, 0 0 26px ${theme.glow}`, duration: 0.12 });
      completeTweenRef.current.to(el, { boxShadow: `0 0 0 2px ${theme.border} inset, 0 0 46px ${theme.glow}`, duration: 0.18, ease: 'power2.out' }, '<');
      completeTweenRef.current.to(el, { boxShadow: '', duration: 0.12 });
      completeTweenRef.current.set(el, { willChange: 'auto' });
      completeTweenRef.current.call(() => {
        el.classList.remove('achv-unlocking');
      });
    }

    return () => {
      if (maskTweenRef.current) maskTweenRef.current.kill();
      if (completeTweenRef.current) completeTweenRef.current.kill();
    };
  }, [progressPct, lockPct, lock, theme.border, theme.glow]);

  return (
    <div
      ref={cardRef}
      data-achievement-id={achievement.id}
      className={[
        'group relative overflow-hidden border-2 bg-[#0B0B1A] px-4 py-4 md:px-5 md:py-5 min-h-[208px] md:min-h-[200px]',
        'shadow-[6px_6px_0px_rgba(124,58,237,0.55)] transition-transform duration-200',
        'hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_rgba(244,63,94,0.55)] hover:scale-[1.01]',
      ].join(' ')}
      style={{
        borderColor: achievement.unlocked ? theme.border : 'rgba(148,163,184,0.35)',
        ['--achv-lock' as any]: lock,
        ['--achv-lock-pct' as any]: lockPct
      }}
      aria-label={achievement.unlocked ? `成就：${achievement.name}` : `未解锁成就：${achievement.name}`}
    >
      <div
        className={[
          'achv-mask pointer-events-none absolute',
          maskDirection === 'right' ? 'left-0 top-0 bottom-0' : 'bottom-0 left-0 right-0',
          isComplete ? 'opacity-0' : 'opacity-100'
        ].join(' ')}
        data-dir={maskDirection}
        aria-hidden="true"
      >
        <div className="achv-mask-edge" aria-hidden="true" />
      </div>
      <div className="achv-flash pointer-events-none absolute inset-0 opacity-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <div
          className="absolute -left-16 top-6 h-24 w-40 rotate-[-14deg]"
          style={{
            background:
              'linear-gradient(90deg, rgba(124,58,237,0) 0%, rgba(124,58,237,0.55) 50%, rgba(124,58,237,0) 100%)',
            filter: 'blur(10px)'
          }}
        />
        <div
          className="absolute -right-16 bottom-8 h-24 w-40 rotate-[12deg]"
          style={{
            background:
              'linear-gradient(90deg, rgba(244,63,94,0) 0%, rgba(244,63,94,0.55) 50%, rgba(244,63,94,0) 100%)',
            filter: 'blur(10px)'
          }}
        />
      </div>

      <div className="relative flex items-start gap-3">
        <div
          className="h-12 w-12 shrink-0 border-2 bg-[#0F0F23] shadow-[3px_3px_0px_rgba(124,58,237,0.65)] grid place-items-center text-2xl"
          style={{ borderColor: achievement.unlocked ? theme.border : 'rgba(148,163,184,0.35)' }}
          aria-hidden="true"
        >
          {achievement.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[15px] md:text-[16px] font-semibold text-[#E2E8F0]">
                {achievement.name}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-[#94A3B8]">
                <span
                  className="inline-flex items-center gap-1 border px-2 py-1 font-['PressStart2P']"
                  style={{
                    borderColor: achievement.unlocked ? theme.border : 'rgba(148,163,184,0.25)',
                    backgroundColor: achievement.unlocked ? theme.badgeBg : 'rgba(148,163,184,0.08)',
                    color: achievement.unlocked ? theme.badgeText : '#94A3B8'
                  }}
                >
                  {achievementRarityLabels[achievement.rarity]}
                </span>
                {achievement.unlockedAt ? (
                  <span className="truncate">解锁：{achievement.unlockedAt}</span>
                ) : (
                  <span className="truncate">{achievement.unlocked ? '已解锁' : '未解锁'}</span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!achievement.unlocked ? (
                <span className="grid h-9 w-9 place-items-center border-2 border-[#334155] bg-black/30 text-[#94A3B8] shadow-[2px_2px_0px_rgba(124,58,237,0.55)]">
                  🔒
                </span>
              ) : (
                <span
                  className="grid h-9 w-9 place-items-center border-2 bg-black/30 shadow-[2px_2px_0px_rgba(124,58,237,0.55)]"
                  style={{ borderColor: theme.border, color: theme.badgeText }}
                >
                  ✓
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 text-[13px] leading-relaxed text-[#94A3B8]">
            <span className="line-clamp-2 min-h-[2.6em] block">{achievement.description}</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.14),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent p-4 transition-transform duration-200 group-hover:translate-y-0 group-focus-within:translate-y-0">
          <div className="text-[12px] text-[#E2E8F0] font-['PressStart2P']">详情</div>
          <div className="mt-2 text-[13px] leading-relaxed text-[#CBD5E1]">{achievement.description}</div>
        </div>
      </div>

      <span className="achv-burst pointer-events-none absolute inset-0 opacity-0" aria-hidden="true" />

      <style>{`
        .achv-mask {
          opacity: calc((var(--achv-lock-pct) / 100) * 0.96);
          background:
            linear-gradient(180deg, rgba(2,6,23,0.08) 0%, rgba(2,6,23,0.62) 22%, rgba(2,6,23,0.92) 100%),
            repeating-linear-gradient(180deg, rgba(148,163,184,0.09) 0 1px, rgba(2,6,23,0) 1px 4px),
            repeating-linear-gradient(90deg, rgba(148,163,184,0.03) 0 6px, rgba(2,6,23,0) 6px 12px),
            radial-gradient(ellipse at 50% 0%, rgba(148,163,184,0.20), transparent 62%);
          transition: opacity 240ms ease;
          animation: achvMaskFlicker 1100ms steps(8) infinite;
          image-rendering: pixelated;
          overflow: hidden;
          box-shadow: 0 -1px 0 rgba(148,163,184,0.22) inset;
        }
        .achv-mask[data-dir="up"] {
          height: calc(var(--achv-lock-pct) * 1%);
        }
        .achv-mask[data-dir="right"] {
          width: calc(var(--achv-lock-pct) * 1%);
        }
        .group:hover .achv-mask {
          opacity: calc((var(--achv-lock-pct) / 100) * 0.86);
        }
        @supports ((backdrop-filter: grayscale(1))) or (-webkit-backdrop-filter: grayscale(1)) {
          .achv-mask {
            backdrop-filter: grayscale(1) brightness(0.78);
            -webkit-backdrop-filter: grayscale(1) brightness(0.78);
          }
        }
        .achv-flash {
          background: linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.05));
          mix-blend-mode: screen;
          filter: blur(0.2px);
        }
        .achv-mask-edge {
          position: absolute;
          opacity: 0.9;
          filter: blur(0.15px);
        }
        .achv-mask[data-dir="up"] .achv-mask-edge {
          left: 0;
          right: 0;
          top: -10px;
          height: 14px;
          background:
            repeating-linear-gradient(90deg, rgba(15,23,42,0.96) 0 7px, rgba(15,23,42,0.46) 7px 10px),
            linear-gradient(180deg, rgba(148,163,184,0.35), rgba(2,6,23,0));
          mask-image: repeating-linear-gradient(90deg, #000 0 9px, transparent 9px 12px);
          -webkit-mask-image: repeating-linear-gradient(90deg, #000 0 9px, transparent 9px 12px);
        }
        .achv-mask[data-dir="right"] .achv-mask-edge {
          top: 0;
          bottom: 0;
          right: -10px;
          width: 14px;
          background:
            repeating-linear-gradient(180deg, rgba(15,23,42,0.96) 0 7px, rgba(15,23,42,0.46) 7px 10px),
            linear-gradient(90deg, rgba(148,163,184,0.35), rgba(2,6,23,0));
          mask-image: repeating-linear-gradient(180deg, #000 0 9px, transparent 9px 12px);
          -webkit-mask-image: repeating-linear-gradient(180deg, #000 0 9px, transparent 9px 12px);
        }
        .achv-mask::before,
        .achv-mask::after {
          content: '';
          position: absolute;
          inset: -22%;
          background-repeat: no-repeat;
          pointer-events: none;
          will-change: transform, opacity, filter;
        }
        .achv-mask::before {
          opacity: 0.72;
          filter: blur(0.35px);
          background-image:
            radial-gradient(circle at 12% 18%, rgba(148,163,184,0.55) 0 1px, transparent 2px),
            radial-gradient(circle at 28% 44%, rgba(148,163,184,0.45) 0 1px, transparent 2px),
            radial-gradient(circle at 46% 22%, rgba(148,163,184,0.52) 0 1px, transparent 2px),
            radial-gradient(circle at 62% 36%, rgba(148,163,184,0.42) 0 1px, transparent 2px),
            radial-gradient(circle at 74% 18%, rgba(148,163,184,0.50) 0 1px, transparent 2px),
            radial-gradient(circle at 18% 78%, rgba(148,163,184,0.40) 0 1px, transparent 2px),
            radial-gradient(circle at 52% 72%, rgba(148,163,184,0.46) 0 1px, transparent 2px),
            radial-gradient(circle at 82% 70%, rgba(148,163,184,0.48) 0 1px, transparent 2px),
            radial-gradient(circle at 34% 62%, rgba(148,163,184,0.44) 0 1px, transparent 2px),
            radial-gradient(circle at 92% 44%, rgba(148,163,184,0.40) 0 1px, transparent 2px);
          animation: achvDustA 1400ms ease-out infinite;
        }
        .achv-mask::after {
          opacity: 0.55;
          filter: blur(0.6px);
          mix-blend-mode: screen;
          background-image:
            radial-gradient(circle at 22% 30%, rgba(167,139,250,0.25) 0 1px, transparent 3px),
            radial-gradient(circle at 48% 14%, rgba(56,189,248,0.18) 0 1px, transparent 3px),
            radial-gradient(circle at 70% 30%, rgba(245,158,11,0.16) 0 1px, transparent 3px),
            radial-gradient(circle at 62% 70%, rgba(244,63,94,0.14) 0 1px, transparent 3px),
            radial-gradient(circle at 38% 78%, rgba(34,197,94,0.14) 0 1px, transparent 3px);
          animation: achvDustB 2000ms ease-out infinite;
        }
        @keyframes achvMaskFlicker {
          0% { opacity: calc((var(--achv-lock-pct) / 100) * 0.82); transform: translate(0px, 0px); }
          25% { opacity: calc((var(--achv-lock-pct) / 100) * 0.98); transform: translate(0px, -1px); }
          50% { opacity: calc((var(--achv-lock-pct) / 100) * 0.86); transform: translate(1px, 0px); }
          100% { opacity: calc((var(--achv-lock-pct) / 100) * 0.92); transform: translate(0px, 0px); }
        }
        @keyframes achvDustA {
          0% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.46;
          }
          45% {
            transform: translate(calc(var(--achv-lock) * -14px), calc(var(--achv-lock) * 10px)) scale(1.08);
            opacity: 0.76;
          }
          100% {
            transform: translate(calc(var(--achv-lock) * -26px), calc(var(--achv-lock) * 18px)) scale(1.16);
            opacity: 0.02;
          }
        }
        @keyframes achvDustB {
          0% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.12;
          }
          35% {
            transform: translate(calc(var(--achv-lock) * 10px), calc(var(--achv-lock) * -8px)) scale(1.06);
            opacity: 0.38;
          }
          100% {
            transform: translate(calc(var(--achv-lock) * 22px), calc(var(--achv-lock) * -16px)) scale(1.14);
            opacity: 0;
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
