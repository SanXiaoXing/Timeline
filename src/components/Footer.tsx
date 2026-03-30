import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!footerRef.current || !contentRef.current) return;

      // Logo floating animation
      if (logoRef.current) {
        gsap.to(logoRef.current, {
          y: -8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // Background glow pulse - softer for light theme
      gsap.to(".footer-glow", {
        opacity: 0.4,
        scale: 1.05,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Content stagger animation
      const contentElements = contentRef.current.querySelectorAll('.footer-animate-item');
      gsap.set(contentElements, { y: 30, opacity: 0 });
      
      // Footer Reveal Animation - Natural fade up
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.to(contentElements, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
          });
        },
        once: true
      });

      // Parallax effect for footer background
      gsap.to(".footer-bg-shape", {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1
        }
      });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: '主页', href: '/' },
    { label: '项目', href: '/projects' },
    { label: '成就', href: '/achievements' },
  ];

  const socialLinks = [
    { label: 'Github', href: 'https://github.com/SanXiaoXing' },
    { label: 'Email', href: 'mailto:sanxiaoxing@qq.com' },
    { label: 'Twitter', href: '#' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-neutral-50/50 to-white z-10"
    >
      {/* Decorative Background Elements */}
      <div className="footer-bg-shape absolute -top-20 left-1/4 w-[600px] h-[300px] bg-indigo-200/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="footer-bg-shape absolute top-20 right-1/4 w-[400px] h-[200px] bg-cyan-200/15 blur-[80px] rounded-full pointer-events-none"></div>
      <div className="footer-glow absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-300/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Top wave decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200/50 to-transparent"></div>

      <div className="relative z-10 pt-20 pb-8 px-6">
        <div ref={contentRef} className="max-w-6xl mx-auto w-full">
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* Brand Section - Takes more space */}
            <div className="md:col-span-5 footer-animate-item">
              <div
                ref={logoRef}
                className="text-3xl font-bold mb-4 [font-family:'Emblema_One'] text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600"
              >
                SanXiaoXing
              </div>
              <p className="text-neutral-500 max-w-sm leading-relaxed font-light text-sm">
                在星空下记录成长的每一个瞬间。无论是代码的跃动，还是生活的灵感，每一份记录都是通往未来的基石。
              </p>
              
              {/* Status indicator */}
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                <span className="text-neutral-400 text-xs uppercase tracking-[0.15em] font-medium">
                  System Online
                </span>
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden md:block md:col-span-2"></div>

            {/* Quick Links */}
            <div className="md:col-span-2 footer-animate-item">
              <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-[0.15em] mb-5">
                导航
              </h4>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center text-neutral-600 hover:text-indigo-600 transition-all duration-300 font-normal text-base"
                      data-magnetic
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="md:col-span-3 footer-animate-item">
              <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-[0.15em] mb-5">
                联系
              </h4>
              <ul className="space-y-4">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group inline-flex items-center gap-2 text-neutral-600 hover:text-indigo-600 transition-all duration-300 font-normal text-base"
                      data-magnetic
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                      {link.href.startsWith('http') && (
                        <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-animate-item pt-8 border-t border-neutral-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-neutral-400 text-xs font-light">
              © {currentYear} SanXiaoXing. Built with <span className="text-indigo-500">Astro</span> & <span className="text-cyan-500">React</span>.
            </div>
            
            {/* Back to top button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-neutral-200/50 text-neutral-500 hover:text-indigo-600 hover:border-indigo-300/50 hover:bg-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-md"
              data-magnetic
            >
              <span>回到顶部</span>
              <svg className="w-3 h-3 transform group-hover:-translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
