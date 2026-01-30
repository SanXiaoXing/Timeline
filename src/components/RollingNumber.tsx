import { motion, AnimatePresence } from 'motion/react';
import React, { useMemo } from 'react';

interface RollingNumberProps {
  value: number | string;
  decimals?: number;
  unit?: string;
  className?: string;
}

export const RollingNumber = ({ value, decimals = 1, unit = '%', className }: RollingNumberProps) => {
  const formatted = typeof value === 'number' ? value.toFixed(decimals) + unit : value;
  const chars = formatted.split('');

  return (
    <div className={`inline-flex items-center overflow-hidden ${className}`}>
      {chars.map((char, index) => {
        // 判断是否为数字（包含数字0-9），如果是，则进行滚动动画
        const isNumber = /[0-9]/.test(char);
        
        // 非数字字符直接渲染，不做滚动
        if (!isNumber) {
          return (
            <span key={`static-${index}-${char}`} className="relative inline-block">
              {char}
            </span>
          );
        }

        // 数字字符做滚动动画
        return (
          <span key={index} className="relative inline-flex flex-col items-center justify-center h-[1.4em] tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={`${index}-${char}`}
                initial={{ y: '100%', filter: 'blur(2px)', opacity: 0 }}
                animate={{ y: '0%', filter: 'blur(0px)', opacity: 1 }}
                exit={{ y: '-100%', filter: 'blur(2px)', opacity: 0 }}
                transition={{
                   type: "spring",
                   stiffness: 150,
                   damping: 12,
                   mass: 0.8
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {char}
              </motion.span>
            </AnimatePresence>
            {/* 隐形占位符，确保宽度和高度撑开 */}
            <span className="invisible">{char}</span>
          </span>
        );
      })}
    </div>
  );
};
