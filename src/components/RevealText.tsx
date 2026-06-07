import React, { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

/*
 * RevealText — paragraph-level scroll-triggered fade / rise.
 * Use for subhead, body copy, captions. Each sentence rises on its own
 * delay so the eye reads through the text naturally as it enters view.
 *
 * Usage:
 *   <RevealText
 *     text="记录生活、工作与学习中的每一个重要里程碑..."
 *     className="text-muted text-base leading-relaxed max-w-[50ch]"
 *     as="p"
 *   />
 */

type RevealTextProps = {
  text: string;
  /** Tag — defaults to p. */
  as?: 'p' | 'span' | 'div' | 'h2' | 'h3' | 'h4';
  /** Tailwind classes for the container. */
  className?: string;
  /** Split granularity: 'sentence' (default) or 'word' or 'none' (whole block). */
  splitBy?: 'sentence' | 'word' | 'none';
  /** Stagger between pieces, in seconds. */
  stagger?: number;
  /** Initial delay. */
  delay?: number;
  /** How much of the element must be visible. 0..1. */
  amount?: number;
  /** Vertical travel distance in px. */
  distance?: number;
  /** Duration of each piece. */
  duration?: number;
  /** Fire once or every scroll-in. */
  once?: boolean;
};

/** Split text into sentences using CJK + Latin punctuation, then words. */
const splitSentences = (text: string): string[] => {
  // Keep delimiters attached to the preceding piece for natural reading.
  const pieces = text.split(/(?<=[。！？.!?])\s*/g);
  return pieces.map(p => p.trim()).filter(Boolean);
};

const splitWords = (text: string): string[] => {
  // For CJK, also split by punctuation so a long sentence breathes.
  return text.split(/(\s+|(?<=[，。；：、,.;:!?！？]))/g).filter(s => s.trim().length > 0);
};

const cn = (...c: Array<string | undefined | null | false>): string =>
  c.filter(Boolean).join(' ');

const RevealText: React.FC<RevealTextProps> = ({
  text,
  as: Tag = 'p',
  className = '',
  splitBy = 'sentence',
  stagger = 0.06,
  delay = 0,
  amount = 0.3,
  distance = 16,
  duration = 0.7,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, amount });
  const reduce = useReducedMotion();

  const pieces = useMemo(() => {
    if (splitBy === 'none') return [text];
    if (splitBy === 'word') return splitWords(text);
    return splitSentences(text);
  }, [text, splitBy]);

  const visible = reduce ? true : inView;

  return (
    <Tag
      ref={ref as unknown as React.Ref<HTMLDivElement>}
      className={cn('reveal-text', className)}
    >
      {pieces.map((piece, i) => (
        <motion.span
          key={`piece-${i}`}
          initial={{ opacity: 0, y: distance }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
          transition={{
            duration,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + i * stagger,
          }}
          style={{
            display: 'inline-block',
            marginRight: splitBy === 'word' ? '0.25em' : '0',
            willChange: 'transform, opacity',
          }}
        >
          {piece}
          {splitBy === 'sentence' && i < pieces.length - 1 ? ' ' : null}
        </motion.span>
      ))}
      {/* sr-only copy for accessibility / SEO */}
      <span className="sr-only">{text}</span>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .reveal-text > span {
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </Tag>
  );
};

export default RevealText;
