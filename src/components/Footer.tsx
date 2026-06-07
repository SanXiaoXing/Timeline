import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

// --- Animation variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut' as const,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 10,
    },
  },
};

// --- Data ---
const navLinks = [
  { label: '主页', href: '/' },
  { label: '项目', href: '/projects' },
  { label: '成就', href: '/achievements' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/SanXiaoXing' },
  { label: 'Email', href: 'mailto:sanxiaoxing@qq.com' },
];

// --- Sub-components ---
const NavSection: React.FC<{ title: string; links: typeof navLinks; index: number }> = ({
  title,
  links,
  index,
}) => (
  <motion.div variants={itemVariants} className="flex flex-col gap-2">
    <motion.h3
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
      className="mb-2 text-xs font-medium text-primary uppercase tracking-[0.15em] border-b border-divider pb-1"
    >
      {title}
    </motion.h3>
    {links.map((link) => (
      <motion.a
        key={link.href}
        variants={linkVariants}
        href={link.href}
        whileHover={{
          x: 8,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        className="text-sm text-muted hover:text-link transition-colors duration-300 font-body group relative"
      >
        <span className="relative">
          {link.label}
          <motion.span
            className="absolute bottom-0 left-0 h-0.5 bg-link"
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        </span>
      </motion.a>
    ))}
  </motion.div>
);

const SocialLink: React.FC<{
  href: string;
  label: string;
  icon: React.ReactNode;
}> = ({ href, label, icon }) => (
  <motion.a
    variants={socialVariants}
    href={href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    whileHover={{
      scale: 1.2,
      rotate: 12,
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    }}
    whileTap={{ scale: 0.9 }}
    className="w-8 h-8 md:w-10 md:h-10 bg-card hover:bg-link flex items-center justify-center transition-colors duration-300 group"
    aria-label={label}
  >
    <motion.span
      className="text-sm md:text-base text-muted group-hover:text-paper"
      whileHover={{ scale: 1.1 }}
    >
      {icon}
    </motion.span>
  </motion.a>
);

// --- Main Footer ---
const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();
  const [reduceMotion, setReduceMotion] = useState(false);

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setReduceMotion(true);
    }
  }, []);

  const motionProps = reduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-100px' },
        variants: containerVariants,
      };

  return (
    <footer
      ref={footerRef}
      className="relative w-full z-10"
      style={{ backgroundColor: '#F6F2EB' }}
    >
      {/* Sticky footer reveal wrapper */}
      <div className="relative h-[30vh]" style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}>
        <div className="relative h-[calc(100vh+30vh)] -top-[100vh]">
          <div className="h-[30vh] sticky top-[calc(100vh-30vh)]">
            <motion.div
              {...motionProps}
              className="bg-paper py-6 md:py-12 px-6 md:px-12 h-full w-full flex flex-col justify-between relative overflow-hidden"
            >
              {/* Animated background blobs */}
              {!reduceMotion && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent pointer-events-none" />

                  <motion.div
                    className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-accent/5 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  <motion.div
                    className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-link/5 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1,
                    }}
                  />
                </>
              )}

              {/* Divider */}
              <div className="absolute top-0 left-6 right-6 md:left-12 md:right-12">
                <div className="h-px" style={{ backgroundColor: '#E5DFD6' }} />
              </div>

              {/* Navigation */}
              <motion.div
                {...(reduceMotion ? {} : { variants: containerVariants })}
                className="relative z-10 pt-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12">
                  {/* Brand */}
                  <div className="col-span-2 md:col-span-5">
                    <div
                      className="font-brand text-3xl md:text-4xl text-primary mb-3"
                      style={{ letterSpacing: '0.02em', lineHeight: 1.15 }}
                    >
                      SanXiaoXing
                    </div>
                    <p className="text-muted max-w-sm leading-relaxed text-sm">
                      在星空下记录成长的每一个瞬间。代码的跃动，生活的灵感，每一份记录都是通往未来的基石。
                    </p>
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block md:col-span-2" />

                  {/* Nav */}
                  <div className="md:col-span-2">
                    <NavSection title="导航" links={navLinks} index={0} />
                  </div>

                  {/* Social */}
                  <div className="md:col-span-3">
                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col gap-2"
                    >
                      <motion.h3
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-2 text-xs font-medium text-primary uppercase tracking-[0.15em] border-b border-divider pb-1"
                      >
                        联系
                      </motion.h3>
                      <div className="flex gap-3 mt-1">
                        {socialLinks.map((link) => (
                          <SocialLink
                            key={link.label}
                            href={link.href}
                            label={link.label}
                            icon={
                              link.label === 'GitHub' ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              )
                            }
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Bottom bar */}
              <motion.div
                initial={reduceMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                className="relative z-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
                style={{ borderTop: '1px solid #E5DFD6' }}
              >
                <div className="text-xs text-muted">
                  &copy; {currentYear} SanXiaoXing. Built with Astro &amp; React.
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
                  className="group flex items-center gap-2 px-4 py-2 text-xs text-muted hover:text-link transition-colors duration-200"
                >
                  <span>回到顶部</span>
                  <svg
                    className="w-3 h-3 transform group-hover:-translate-y-0.5 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;