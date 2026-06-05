import React, { useCallback } from 'react';

export type BackButtonProps = {
  /** Link target. When provided, renders as <a>. When omitted, defaults to history.back(). */
  href?: string;
  /** Button label text. */
  children?: React.ReactNode;
  /** Extra class names appended to the wrapper. */
  className?: string;
  /** Custom click handler. Overrides default history.back() behavior. */
  onClick?: (e: React.MouseEvent) => void;
};

/**
 * Unified back button — ink painting brush-stroke arrow.
 * Used across all pages for navigating back or to parent routes.
 */
const BackButton: React.FC<BackButtonProps> = ({
  href,
  children = '返回',
  className = '',
  onClick,
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (onClick) {
        onClick(e);
        return;
      }
      if (!href) {
        e.preventDefault();
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/';
        }
      }
    },
    [href, onClick],
  );

  const sharedClasses =
    `inline-flex items-center gap-2 text-sm text-muted hover:text-link transition-colors duration-300 group ${className}`;

  const ArrowIcon = (
    <svg
      className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );

  const content = (
    <>
      {ArrowIcon}
      <span className="relative">
        {children}
        {/* Ink-brush underline on hover */}
        <span
          className="absolute left-0 -bottom-0.5 h-px w-0 group-hover:w-full transition-all duration-500 ease-out"
          style={{
            background: 'linear-gradient(to right, transparent, #4A6B5F, transparent)',
          }}
        />
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={sharedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={sharedClasses}>
      {content}
    </button>
  );
};

export default BackButton;