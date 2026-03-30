import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
// use your own icon import if react-icons is not available
import { GoArrowUpRight } from 'react-icons/go';

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo?: string;
  logoText?: string;
  logoFont?: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoText,
  logoFont,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const logoRef = useRef<HTMLSpanElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const navEl = navRef.current;
      if (!navEl) return;

      const calcHeight = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
          const contentEl = contentRef.current;
          if (contentEl) {
            const clone = contentEl.cloneNode(true) as HTMLElement;
            Object.assign(clone.style, {
              position: 'absolute',
              visibility: 'hidden',
              height: 'auto',
              width: contentEl.offsetWidth + 'px',
              display: 'flex',
              flexDirection: 'column'
            });
            document.body.appendChild(clone);
            const h = clone.offsetHeight;
            document.body.removeChild(clone);
            return 60 + h + 16;
          }
        }
        return 260;
      };

      gsap.set(navEl, { height: 60, overflow: 'hidden' });
      gsap.set(cardsRef.current, { y: 20, opacity: 0 });
      gsap.set(contentRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({ 
        paused: true,
        defaults: { ease: 'expo.out', duration: 0.5, force3D: true }
      });

      tl.to(navEl, {
        height: calcHeight,
      })
      .to(contentRef.current, { 
        autoAlpha: 1, 
        duration: 0.3 
      }, '<')
      .to(cardsRef.current, { 
        y: 0, 
        opacity: 1, 
        stagger: 0.06 
      }, '-=0.3');

      tlRef.current = tl;
    }, navRef);

    return () => ctx.revert();
  }, [items]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play();
    } else {
      setIsHamburgerOpen(false);
      tl.reverse().eventCallback('onReverseComplete', () => setIsExpanded(false));
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`card-nav-container absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[99] top-[1.2em] md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 relative overflow-hidden will-change-[height] rounded-3xl transition-shadow duration-500 ${isExpanded ? 'shadow-2xl shadow-indigo-500/20' : 'shadow-lg shadow-neutral-200/50 hover:shadow-xl hover:shadow-neutral-300/50'}`}
        style={{ 
          backgroundColor: baseColor,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)'
        }}
      >
        {/* Glass shine effect */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-700"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.2) 100%)'
          }}
        />

        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2 md:order-none p-2 rounded-xl transition-all duration-300 hover:bg-neutral-100/50`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            style={{ color: menuColor || '#000' }}
          >
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-all duration-300 ease-out [transform-origin:50%_50%] ${
                isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''
              } group-hover:w-[26px]`}
            />
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-all duration-300 ease-out [transform-origin:50%_50%] ${
                isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''
              } group-hover:w-[26px]`}
            />
          </div>

          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none">
            {logo ? (
              <img src={logo} alt={logoAlt} className="logo h-[28px]" />
            ) : (
              <span 
                ref={logoRef}
                className="logo-text text-2xl font-bold tracking-tighter transition-all duration-300 hover:scale-105 cursor-default"
                style={{ fontFamily: logoFont || "'Emblema One', cursive" }}
              >
                {logoText}
              </span>
            )}
          </div>
        </div>

        <div
          ref={contentRef}
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-3 flex flex-col items-stretch gap-3 justify-start z-[1] md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => {
            const isHovered = hoveredCard === idx;
            return (
              <div
                key={`${item.label}-${idx}`}
                className={`nav-card select-none relative flex flex-col gap-3 p-5 min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 md:flex-[1_1_0%] border rounded-3xl transition-all duration-500 overflow-hidden ${
                  isHovered 
                    ? 'bg-white/60 border-indigo-300/40 shadow-xl shadow-indigo-500/10 scale-[1.02]' 
                    : 'bg-white/40 border-white/30 shadow-md shadow-neutral-200/20 hover:bg-white/50 hover:border-indigo-200/40 hover:shadow-lg hover:shadow-indigo-500/5'
                }`}
                ref={setCardRef(idx)}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ 
                  color: item.textColor, 
                  fontFamily: "'Emblema One', cursive",
                  backdropFilter: 'blur(10px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(150%)'
                }}
              >
                {/* Card shine effect */}
                <div 
                  className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%, rgba(99,102,241,0.05) 100%)'
                  }}
                />

                <div 
                  className="nav-card-label font-bold tracking-tight text-[24px] md:text-[28px] relative z-10 transition-transform duration-300"
                  style={{ 
                    fontFamily: "'Emblema One', cursive",
                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
                  }}
                >
                  {item.label}
                </div>
                <div className="nav-card-links mt-auto flex flex-col gap-[8px] relative z-10">
                  {item.links?.map((lnk, i) => (
                    <a
                      key={`${lnk.label}-${i}`}
                      className="nav-card-link group/link inline-flex items-center gap-[10px] no-underline cursor-pointer transition-all duration-300 text-zinc-500 hover:text-indigo-500 text-[16px] md:text-[17px] py-2 px-3 -mx-3 rounded-2xl hover:bg-indigo-50/60"
                      href={lnk.href}
                      aria-label={lnk.ariaLabel}
                      style={{ fontFamily: "'Emblema One', cursive" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/40 group-hover/link:bg-indigo-500 transition-colors duration-300" />
                      <span className="flex-1">{lnk.label}</span>
                      <GoArrowUpRight className="nav-card-link-icon shrink-0 w-4 h-4 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:text-indigo-500" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
