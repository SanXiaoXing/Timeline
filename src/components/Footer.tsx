import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!footerRef.current || !contentRef.current) return;

      // Logo floating animation
      if (logoRef.current) {
        gsap.to(logoRef.current, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      }

      // Background glow pulse
      gsap.to(".footer-glow", {
        opacity: 0.6,
        scale: 1.1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Footer Reveal Animation (Sticky/Fixed Effect)
      // Note: We use yPercent to create the unfolding effect
      gsap.fromTo(contentRef.current, 
        { yPercent: -30, opacity: 0 },
        { 
          yPercent: 0, 
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom", 
            end: "bottom bottom", 
            scrub: true,
            invalidateOnRefresh: true,
          }
        }
      );

      // Trae.cn Style: Clip-Path Wipe Reveal
      // Animate the polygon from a "hidden/closed" state to "fully open"
      gsap.fromTo(footerRef.current,
        { 
          clipPath: 'inset(100% 0% 0% 0%)',
          y: 50,
          scale: 0.95
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "top 60%", // finish the wipe quickly
            scrub: 1,
          }
        }
      );

    }, footerRef);

    return () => ctx.revert();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      ref={footerRef}
      className="relative w-full h-[600px] md:h-[450px] overflow-hidden bg-zinc-950/90 backdrop-blur-xl z-10 border-t border-white/10"
      style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
    >
      <div className="sticky bottom-0 left-0 w-full h-full flex flex-col justify-end pb-12 px-6">
        {/* Decorative Background Elements */}
        <div className="footer-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none opacity-30"></div>
        
        <div ref={contentRef} className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div 
              ref={logoRef}
              className="text-3xl font-bold mb-6 [font-family:'Emblema_One'] text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500"
            >
              SanXiaoXing
            </div>
            <p className="text-zinc-400 max-w-sm leading-relaxed font-light">
              在星空下记录成长的每一个瞬间。无论是代码的跃动，还是生活的灵感，每一份记录都是通往未来的基石。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest mb-6 font-['Press_Start_2P'] text-[10px]">
              导航
            </h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-zinc-400 hover:text-indigo-400 transition-colors duration-300 font-light">主页</a></li>
              <li><a href="/projects" className="text-zinc-400 hover:text-indigo-400 transition-colors duration-300 font-light">项目</a></li>
              <li><a href="/achievements" className="text-zinc-400 hover:text-indigo-400 transition-colors duration-300 font-light">成就</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest mb-6 font-['Press_Start_2P'] text-[10px]">
              联系
            </h4>
            <ul className="space-y-4">
              <li><a href="https://github.com/SanXiaoXing" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-400 transition-colors duration-300 font-light">Github</a></li>
              <li><a href="mailto:sanxiaoxing@qq.com" className="text-zinc-400 hover:text-indigo-400 transition-colors duration-300 font-light">Email</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-indigo-400 transition-colors duration-300 font-light">Twitter</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-zinc-500 text-xs font-light">
            © {currentYear} SanXiaoXing. Built with Astro & React.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-medium">
              System Online
            </span>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
