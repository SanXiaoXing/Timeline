import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

export type QuoteItem = {
  date: string;
  items: string[];
};

export type XingQuotesProps = {
  quotes: QuoteItem[];
};

const XingQuotes: React.FC<XingQuotesProps> = ({ quotes }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const timeline = timelineRef.current;
    if (!container || !timeline) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.fromTo(
          item,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.08,
          }
        );
      });

      const line = timeline.querySelector('.timeline-line');
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timeline,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 1,
            },
          }
        );
      }
    }, container);

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
    };
  }, [quotes]);

  const setItemRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) itemsRef.current[index] = el;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    return { year, month, day, weekday, full: `${year}-${month}-${day}` };
  };

  return (
    <div ref={containerRef} className="relative min-h-screen py-12 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-16">
        {/* Back Button */}
        <div className="mb-8 md:mb-12">
          <a
            href="/"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 border border-neutral-200/50 text-neutral-600 hover:text-indigo-600 hover:border-indigo-400/30 hover:bg-white transition-all duration-500 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-indigo-100/50"
            data-magnetic
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium tracking-wide relative z-10">返回首页</span>
          </a>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-200/50 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-sm font-medium text-indigo-600">兴兴语录</span>
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold text-neutral-800 mb-4"
            style={{ fontFamily: "'Emblema One', cursive" }}
          >
            Xing&apos;s Quotes
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            记录每一天的思考、学习与成长，用文字留下时间的痕迹
          </p>
        </div>
      </div>

      {/* Timeline Container - Single Side Layout */}
      <div ref={timelineRef} className="relative max-w-5xl mx-auto">
        {/* Timeline Line - Left Side */}
        <div className="absolute left-24 md:left-32 top-0 bottom-0 w-px">
          <div className="timeline-line absolute inset-0 bg-gradient-to-b from-indigo-300 via-indigo-400 to-indigo-300" />
        </div>

        {/* Quote Items */}
        <div className="space-y-6 md:space-y-8">
          {quotes.map((quote, index) => {
            const dateInfo = formatDate(quote.date);
            const isActive = activeIndex === index;

            return (
              <div
                key={quote.date}
                ref={setItemRef(index)}
                className="relative flex items-start gap-4 md:gap-8"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Date Column - Left Side */}
                <div className="flex-shrink-0 w-20 md:w-28 text-right pt-4">
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                        isActive ? 'text-indigo-500' : 'text-neutral-400'
                      }`}
                      style={{ fontFamily: "'Emblema One', cursive" }}
                    >
                      {dateInfo.month}.{dateInfo.day}
                    </span>
                    <span className="text-xs md:text-sm text-neutral-400 mt-1">
                      {dateInfo.year}
                    </span>
                    <span className="text-xs text-neutral-300 mt-0.5">
                      {dateInfo.weekday}
                    </span>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="flex-shrink-0 relative z-10 pt-5">
                  <div
                    className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-indigo-500 border-indigo-500 scale-125 shadow-lg shadow-indigo-500/30'
                        : 'bg-white border-indigo-300'
                    }`}
                  />
                </div>

                {/* Content Card - Right Side with Glassmorphism */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`group relative rounded-2xl border p-5 md:p-6 transition-all duration-500 ${
                      isActive
                        ? 'bg-white/40 border-indigo-300/40 shadow-2xl shadow-indigo-500/15 scale-[1.01]'
                        : 'bg-white/25 border-white/40 shadow-lg shadow-neutral-200/30 hover:bg-white/40 hover:border-indigo-200/50 hover:shadow-xl hover:shadow-indigo-500/10'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    }}
                  >
                    {/* Glass Shine Effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                      }}
                    />

                    {/* Quote Icon */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                      <FaQuoteLeft className="w-3 h-3 md:w-4 md:h-4" />
                    </div>

                    {/* Quote Items */}
                    <div className="space-y-3 md:space-y-4 pt-2">
                      {quote.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="relative flex items-start gap-3"
                        >
                          <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-indigo-400/60" />
                          <p className="text-neutral-700 leading-relaxed text-sm md:text-base">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Decoration */}
                    <div className="absolute bottom-3 right-4 text-indigo-300/40">
                      <FaQuoteRight className="w-5 h-5 md:w-6 md:h-6" />
                    </div>

                    {/* Subtle Border Glow on Active */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl border border-indigo-400/20 pointer-events-none" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline End */}
        <div className="relative mt-16 flex items-center gap-4 md:gap-8">
          <div className="flex-shrink-0 w-20 md:w-28" />
          <div className="flex-shrink-0 relative z-10">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-500/30" />
          </div>
          <div className="flex-1">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-neutral-400"
              style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.3)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              继续书写中...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XingQuotes;
