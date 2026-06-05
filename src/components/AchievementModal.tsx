import React, { useEffect, useRef } from 'react';
import type { Achievement, AchievementRarity } from './AchievementCard';
import { achievementRarityLabels } from './AchievementCard';

type AchievementModalProps = {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
};

const rarityTheme: Record<AchievementRarity, { border: string; bg: string; text: string }> = {
  common:    { border: '#059669', bg: 'rgba(16,185,129,0.06)', text: '#059669' },
  rare:      { border: '#0284c7', bg: 'rgba(14,165,233,0.06)', text: '#0284c7' },
  epic:      { border: '#7c3aed', bg: 'rgba(139,92,246,0.06)', text: '#7c3aed' },
  legendary: { border: '#d97706', bg: 'rgba(245,158,11,0.06)', text: '#d97706' },
};

const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(44, 54, 57, 0.65)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg overflow-hidden"
        style={{
          backgroundColor: '#F6F2EB',
          borderTop: `3px solid ${theme.border}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Grain texture */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        <div className="relative z-10 p-8 md:p-10">
          {/* Close button — editorial style */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-colors duration-200 hover:bg-card group"
            aria-label="Close"
          >
            <svg className="w-4 h-4 text-muted group-hover:text-primary transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Rarity folio marker */}
          <div className="mb-8">
            <span
              className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5"
              style={{
                color: theme.text,
                backgroundColor: theme.bg,
                borderBottom: `1px solid ${theme.border}`,
                opacity: achievement.unlocked ? 1 : 0.5,
              }}
            >
              {achievementRarityLabels[achievement.rarity]}
            </span>
          </div>

          {/* Icon — large editorial display */}
          <div
            className="mb-6"
            style={{
              fontSize: '4rem',
              lineHeight: 1,
              opacity: achievement.unlocked ? 1 : 0.5,
              filter: achievement.unlocked ? 'none' : 'grayscale(100%)',
            }}
          >
            {achievement.icon}
          </div>

          {/* Name — editorial headline */}
          <h2
            className="font-display text-2xl md:text-3xl text-primary font-normal leading-tight mb-4"
            style={{ letterSpacing: '-0.01em' }}
          >
            {achievement.name}
          </h2>

          {/* Divider */}
          <div className="w-full h-px my-6 bg-divider" />

          {/* Description — editorial body */}
          <p className="text-base text-muted leading-relaxed mb-8 max-w-[50ch]">
            {achievement.description}
          </p>

          {/* Bottom info — editorial footnote */}
          <div
            className="pt-6 flex items-center justify-between"
            style={{ borderTop: '1px solid #E5DFD6' }}
          >
            {achievement.unlocked && achievement.unlockedAt ? (
              <>
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: theme.text }}>
                  Unlocked
                </span>
                <span className="font-mono text-xs tabular-nums text-muted">
                  {achievement.unlockedAt.split(' ')[0]}
                </span>
              </>
            ) : (
              <>
                <span className="text-xs text-muted">当前进度</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-[2px] overflow-hidden" style={{ backgroundColor: '#E5DFD6' }}>
                    <div
                      className="h-full"
                      style={{
                        width: `${achievement.progressPct}%`,
                        backgroundColor: theme.border,
                        transition: 'width 0.7s ease-out',
                      }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold tabular-nums" style={{ color: theme.text }}>
                    {achievement.progressPct}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementModal;