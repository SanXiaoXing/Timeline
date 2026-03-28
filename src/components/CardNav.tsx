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
        stagger: 0.04 
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
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 shadow-md relative overflow-hidden will-change-[height]`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2 md:order-none`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            style={{ color: menuColor || '#000' }}
          >
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''
              } group-hover:opacity-75`}
            />
          </div>

          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none">
            {logo ? (
              <img src={logo} alt={logoAlt} className="logo h-[28px]" />
            ) : (
              <span 
                ref={logoRef}
                className="logo-text text-2xl font-bold tracking-tighter"
                style={{ fontFamily: logoFont || "'Emblema One', cursive" }}
              >
                {logoText}
              </span>
            )}
          </div>
        </div>

        <div
          ref={contentRef}
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 p-[16px_20px] min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 md:flex-[1_1_0%] border border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/10"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor, fontFamily: "'Emblema One', cursive" }}
            >
              <div 
                className="nav-card-label font-bold tracking-tight text-[24px] md:text-[28px]"
                style={{ fontFamily: "'Emblema One', cursive" }}
              >
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[4px]">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-[8px] no-underline cursor-pointer transition-colors duration-300 text-zinc-400 hover:text-zinc-100 text-[16px] md:text-[18px]"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                    style={{ fontFamily: "'Emblema One', cursive" }}
                  >
                    <GoArrowUpRight className="nav-card-link-icon shrink-0" aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
