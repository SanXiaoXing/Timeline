import React, { useState, useRef, useCallback } from 'react';

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logoText?: string;
  items: CardNavItem[];
}

const cn = (...classes: (string | undefined | null | boolean)[]): string =>
  classes.filter(Boolean).join(' ');

const CardNav: React.FC<CardNavProps> = ({
  logoText,
  items,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[99] top-[1.5em] md:top-[2.5em]">
      <nav
        ref={navRef}
        className="relative overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: '#F0EBE3',
          borderBottom: '1px solid #E5DFD6',
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between h-[56px] px-5">
          <button
            onClick={toggleMenu}
            className="group flex flex-col items-center justify-center gap-[5px] p-2 cursor-pointer"
            aria-label={isExpanded ? '关闭菜单' : '打开菜单'}
            tabIndex={0}
          >
            <div
              className={cn(
                'w-[24px] h-[2px] transition-all duration-300',
                isExpanded ? 'translate-y-[3.5px] rotate-45' : '',
              )}
              style={{ backgroundColor: '#2C3639' }}
            />
            <div
              className={cn(
                'w-[24px] h-[2px] transition-all duration-300',
                isExpanded ? '-translate-y-[3.5px] -rotate-45' : '',
              )}
              style={{ backgroundColor: '#2C3639' }}
            />
          </button>
          <span
            className="font-brand text-2xl text-primary"
            style={{ letterSpacing: '0.015em', lineHeight: 1.1 }}
          >
            {logoText}
          </span>
        </div>

        {/* Expandable content */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out',
            isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="flex flex-col md:flex-row md:items-stretch gap-0 p-4 pt-0">
            {items.slice(0, 3).map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <div
                  key={`${item.label}-${idx}`}
                  className={cn(
                    'flex-1 min-w-0 p-5 transition-colors duration-200 cursor-default',
                    isHovered ? 'bg-card' : '',
                  )}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div
                    className={cn(
                      'font-display text-2xl md:text-3xl tracking-tight mb-4 transition-colors duration-200',
                      isHovered ? 'text-accent' : 'text-primary',
                    )}
                  >
                    {item.label}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {item.links?.map((lnk, i) => (
                      <a
                        key={`${lnk.label}-${i}`}
                        className="group/link inline-flex items-center gap-2 text-sm text-muted hover:text-link transition-colors duration-200 py-1"
                        href={lnk.href}
                        aria-label={lnk.ariaLabel}
                      >
                        <span className="w-1 h-1" style={{ backgroundColor: '#D45D4A' }} />
                        <span>{lnk.label}</span>
                        <svg
                          className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-all duration-200 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CardNav;