import React, { useId, useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

/*
 * KineticHeadline — magazine-grade title reveal.
 * Splits a string into per-word, per-line blocks; each word rises into place
 * with a small stagger. Works for both English and CJK (CJK characters stay
 * inside the same word block; the stagger is per-word, not per-glyph, so the
 * effect stays editorial and not gimmicky).
 *
 * Usage:
 *   <KineticHeadline
 *     as="h1"
 *     text="成就记录"
 *     className="font-display text-5xl"
 *     stagger={0.06}
 *   />
 */

type KineticHeadlineProps = {
  /** The visible text. \n forces a line break. */
  text: string;
  /** Render-as tag. Defaults to h2. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  /** Container className (Tailwind). */
  className?: string;
  /** Stagger between words, in seconds. */
  stagger?: number;
  /** Delay before the first word, in seconds. */
  delay?: number;
  /** Reveal trigger: 'mount' fires once on mount, 'inView' waits for scroll. */
  trigger?: 'mount' | 'inView';
  /** Animate once or every time the element enters view. */
  once?: boolean;
  /** Mask color — covers the word while it slides in. Defaults to paper. */
  maskColor?: string;
  /** Optional line accent that draws under each line on reveal. */
  underline?: boolean;
};

const cn = (...c: Array<string | undefined | null | false>): string =>
  c.filter(Boolean).join(' ');

const splitWords = (text: string): string[][] => {
  // Split by newline into lines, then by spaces into words.
  // For CJK strings without spaces, the whole line is treated as one word
  // so we don't end up animating one stroke at a time.
  return text.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return [];
    if (/[一-龥]/.test(trimmed) && !/\s/.test(trimmed)) {
      return [trimmed];
    }
    return trimmed.split(/\s+/);
  });
};

const KineticHeadline: React.FC<KineticHeadlineProps> = ({
  text,
  as: Tag = 'h2',
  className = '',
  stagger = 0.05,
  delay = 0,
  trigger = 'inView',
  once = true,
  maskColor = '#F6F2EB',
  underline = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, margin: '-10% 0px -10% 0px' });
  const reduce = useReducedMotion();
  const reactId = useId();

  const lines = useMemo(() => splitWords(text), [text]);

  // Decide whether to show the animation. With trigger='mount' the
  // effect runs immediately on hydration, so we just defer one frame.
  const shouldAnimate = reduce
    ? false
    : trigger === 'mount'
      ? true
      : inView;

  // Line index lookup for each word (for stagger within a line being tighter
  // than across lines, and for the underline accent to know which line is which).
  const wordMeta = useMemo(() => {
    const meta: Array<{ word: string; line: number; indexInLine: number }> = [];
    lines.forEach((line, li) => {
      line.forEach((word, wi) => {
        meta.push({ word, line: li, indexInLine: wi });
      });
    });
    return meta;
  }, [lines]);

  const elementProps = {
    ref: ref as unknown as React.Ref<HTMLElement>,
    className: cn('kinetic-headline', className),
    style: { lineHeight: 1.15 } as React.CSSProperties,
  };

  return (
    <Tag {...(elementProps as React.HTMLAttributes<HTMLElement>)}>
      {lines.map((line, lineIdx) => (
        <span
          key={`${reactId}-line-${lineIdx}`}
          className="kinetic-headline-line block"
        >
          {line.map((word, wordIdx) => {
            const flatIndex = wordMeta.findIndex(
              m => m.line === lineIdx && m.indexInLine === wordIdx
            );
            const wordDelay = delay + flatIndex * stagger;

            return (
              <span
                key={`${reactId}-w-${lineIdx}-${wordIdx}`}
                className="kinetic-headline-word-wrap"
                aria-hidden="true"
                style={{ marginRight: '0.28em' }}
              >
                <motion.span
                  className="kinetic-headline-word"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={
                    shouldAnimate
                      ? { y: '0%', opacity: 1 }
                      : { y: '110%', opacity: 0 }
                  }
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: wordDelay,
                  }}
                  style={{
                    display: 'inline-block',
                    willChange: 'transform, opacity',
                  }}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
          {/* Line-end underline accent */}
          {underline && (
            <motion.span
              className="kinetic-headline-underline"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={shouldAnimate ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: delay + (wordMeta.filter(m => m.line === lineIdx).length) * stagger + 0.1,
              }}
              style={{
                display: 'block',
                height: '1px',
                marginTop: '0.45em',
                transformOrigin: 'left center',
                backgroundColor: '#D45D4A',
              }}
            />
          )}
        </span>
      ))}

      {/* Accessible copy for screen readers — same as visible text, no animation. */}
      <span className="sr-only">{text}</span>

      <style>{`
        .kinetic-headline { display: block; }
        .kinetic-headline-line { display: block; overflow: hidden; padding-bottom: 0.06em; margin-bottom: -0.06em; }
        .kinetic-headline-word-wrap { display: inline-block; overflow: hidden; padding-bottom: 0.06em; margin-bottom: -0.06em; vertical-align: bottom; }
        .kinetic-headline-word { display: inline-block; will-change: transform, opacity; }
        @media (prefers-reduced-motion: reduce) {
          .kinetic-headline-word {
            transform: none !important;
            opacity: 1 !important;
          }
          .kinetic-headline-underline {
            transform: scaleX(1) !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </Tag>
  );
};

export default KineticHeadline;
