import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { Achievement, AchievementRarity } from './AchievementCard';
import { achievementRarityLabels } from './AchievementCard';

type AchievementModalProps = {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
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
    particleColor: string;
  }
> = {
  common: {
    border: 'rgba(16, 185, 129, 0.6)',
    glow: 'rgba(16, 185, 129, 0.3)',
    pulseGlow: 'rgba(16, 185, 129, 0.5)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeText: '#059669',
    gradient: 'from-emerald-400/20 to-teal-400/20',
    particleColor: '#10b981'
  },
  rare: {
    border: 'rgba(14, 165, 233, 0.6)',
    glow: 'rgba(14, 165, 233, 0.3)',
    pulseGlow: 'rgba(14, 165, 233, 0.5)',
    badgeBg: 'rgba(14, 165, 233, 0.15)',
    badgeText: '#0284c7',
    gradient: 'from-sky-400/20 to-cyan-400/20',
    particleColor: '#0ea5e9'
  },
  epic: {
    border: 'rgba(139, 92, 246, 0.6)',
    glow: 'rgba(139, 92, 246, 0.3)',
    pulseGlow: 'rgba(139, 92, 246, 0.5)',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    badgeText: '#7c3aed',
    gradient: 'from-violet-400/20 to-purple-400/20',
    particleColor: '#8b5cf6'
  },
  legendary: {
    border: 'rgba(245, 158, 11, 0.8)',
    glow: 'rgba(245, 158, 11, 0.4)',
    pulseGlow: 'rgba(245, 158, 11, 0.6)',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    badgeText: '#d97706',
    gradient: 'from-amber-400/30 to-orange-400/30',
    particleColor: '#f59e0b'
  }
};

const Particles: React.FC<{ rarity: AchievementRarity; count: number }> = ({ rarity, count }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 2}s`,
    size: rarity === 'legendary' ? `${3 + Math.random() * 3}px` : `${2 + Math.random() * 2}px`,
    opacity: 0.4 + Math.random() * 0.4
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: rarityTheme[rarity].particleColor,
            opacity: p.opacity,
            animation: `particleFall ${p.duration} ease-in-out ${p.delay} infinite`,
            boxShadow: `0 0 6px ${rarityTheme[rarity].particleColor}`
          }}
        />
      ))}
      <style>{`
        @keyframes particleFall {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(400px) translateX(${rarity === 'legendary' ? '20px' : '10px'}) rotate(${rarity === 'legendary' ? '360deg' : '180deg'});
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isOpen || !achievement) return;

    const theme = rarityTheme[achievement.rarity];

    timelineRef.current?.kill();

    const tl = gsap.timeline();

    tl.fromTo(backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' }
    )
    .fromTo(modalRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.4)' },
      '-=0.1'
    )
    .fromTo(iconRef.current,
      { scale: 1 },
      { scale: 1.3, duration: 0.2, ease: 'power2.out' },
      '-=0.1'
    )
    .to(iconRef.current,
      { scale: 1, duration: 0.2, ease: 'power2.in' }
    )
    .fromTo(modalRef.current,
      { boxShadow: `0 0 0 ${theme.glow}` },
      { boxShadow: `0 0 40px ${theme.glow}, 0 0 80px ${theme.glow}`, duration: 0.3, ease: 'power2.out' },
      '-=0.2'
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [isOpen, achievement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !achievement) return null;

  const theme = rarityTheme[achievement.rarity];
  const particleCount = achievement.rarity === 'legendary' ? 30 : achievement.rarity === 'epic' ? 15 : achievement.rarity === 'rare' ? 8 : 0;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-md rounded-2xl border-2 backdrop-blur-md overflow-hidden ${
          achievement.unlocked
            ? `bg-gradient-to-br ${theme.gradient}`
            : 'bg-neutral-200/90 grayscale'
        }`}
        style={{
          borderColor: achievement.unlocked ? theme.border : 'rgba(0,0,0,0.2)',
          boxShadow: achievement.unlocked
            ? `0 0 20px ${theme.glow}`
            : '0 4px 20px rgba(0,0,0,0.1)',
          opacity: 1,
          scale: 1
        }}
        onClick={e => e.stopPropagation()}
      >
        {achievement.unlocked && particleCount > 0 && (
          <Particles rarity={achievement.rarity} count={particleCount} />
        )}

        <div className="relative z-10 p-6">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center text-center">
            <div
              ref={iconRef}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-2 mb-4 ${
                achievement.unlocked ? 'bg-white/80' : 'bg-neutral-300/50'
              }`}
              style={{
                borderColor: achievement.unlocked ? theme.border : 'rgba(0,0,0,0.1)',
                boxShadow: achievement.unlocked ? `0 0 30px ${theme.glow}` : 'none'
              }}
            >
              <span style={!achievement.unlocked ? { filter: 'grayscale(100%)', opacity: 0.5 } : {}}>
                {achievement.icon}
              </span>
            </div>

            <h2 className={`text-xl font-bold mb-2 ${achievement.unlocked ? 'text-neutral-800' : 'text-neutral-500'}`}>
              {achievement.name}
            </h2>

            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-4"
              style={{
                borderColor: achievement.unlocked ? theme.border : 'rgba(0,0,0,0.1)',
                color: achievement.unlocked ? theme.badgeText : '#999',
                backgroundColor: achievement.unlocked ? theme.badgeBg : 'rgba(0,0,0,0.05)',
                opacity: achievement.unlocked ? 1 : 0.5
              }}
            >
              {achievementRarityLabels[achievement.rarity]}
            </span>

            <div className={`w-full h-px my-4 ${achievement.unlocked ? 'bg-neutral-200/50' : 'bg-neutral-300/50'}`} />

            <p className={`text-sm leading-relaxed mb-4 ${achievement.unlocked ? 'text-neutral-600' : 'text-neutral-400'}`}>
              {achievement.description}
            </p>

            <div className={`text-xs ${achievement.unlocked ? 'text-neutral-500' : 'text-neutral-400'}`}>
              {achievement.unlocked && achievement.unlockedAt ? (
                <div className="flex items-center justify-center gap-2">
                  <span>解锁时间</span>
                  <span className="font-mono">{achievement.unlockedAt.split(' ')[0]}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>当前进度</span>
                  <span className="font-mono font-bold" style={{ color: theme.badgeText }}>{achievement.progressPct}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes particleFall {
            0% {
              transform: translateY(-10px) translateX(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(400px) translateX(10px) rotate(180deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AchievementModal;
