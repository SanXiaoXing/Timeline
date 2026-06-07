import React, { useRef, useState } from 'react';
import BackButton from './BackButton';
import KineticHeadline from './KineticHeadline';
import RevealText from './RevealText';

export type QuoteItem = {
  date: string;
  items: string[];
};

export type XingQuotesProps = {
  quotes: QuoteItem[];
};

const XingQuotes: React.FC<XingQuotesProps> = ({ quotes }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
      <div className="max-w-content mx-auto mb-16">
        <div className="mb-8 md:mb-12">
          <BackButton href="/">返回首页</BackButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          <div className="md:col-span-7">
            <p className="t-folio mb-4">Quotes</p>
            <KineticHeadline
              as="h1"
              text="Xing's Quotes"
              className="font-display text-4xl md:text-5xl t-track-headline t-rhythm-tight text-primary font-normal"
              stagger={0.05}
              delay={0.1}
            />
            <RevealText
              text="记录每一天的思考、学习与成长，用文字留下时间的痕迹。"
              as="p"
              className="mt-4 block text-muted text-base t-rhythm-relaxed max-w-[50ch]"
              splitBy="sentence"
              stagger={0.08}
              delay={0.4}
            />
          </div>
        </div>
      </div>

      {/* Timeline with magazine treatment */}
      <div className="relative max-w-content mx-auto">
        {/* Timeline line */}
        <div className="absolute left-24 md:left-32 top-0 bottom-0 w-px bg-divider" />

        <div className="space-y-6 md:space-y-8">
          {quotes.map((quote, index) => {
            const dateInfo = formatDate(quote.date);
            const isActive = activeIndex === index;

            return (
              <div
                key={quote.date}
                className="relative flex items-start gap-4 md:gap-8"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Date — magazine folio style */}
                <div className="flex-shrink-0 w-20 md:w-28 text-right pt-3">
                  <div className="flex flex-col items-end">
                    <span
                      className="font-display text-2xl md:text-3xl leading-none tabular-nums transition-colors duration-300"
                      style={{ color: isActive ? '#D45D4A' : '#2C3639' }}
                    >
                      {dateInfo.month}.{dateInfo.day}
                    </span>
                    <span className="text-[10px] text-muted mt-1.5 font-mono tracking-wider uppercase">
                      {dateInfo.year}
                    </span>
                    <span className="text-[10px] text-muted mt-0.5 opacity-50">
                      {dateInfo.weekday}
                    </span>
                  </div>
                </div>

                {/* Node */}
                <div className="flex-shrink-0 relative z-10 pt-4">
                  <div
                    className="transition-all duration-400"
                    style={{
                      width: isActive ? '16px' : '8px',
                      height: isActive ? '16px' : '8px',
                      backgroundColor: isActive ? '#D45D4A' : '#F6F2EB',
                      border: isActive ? '2px solid #D45D4A' : '2px solid #E5DFD6',
                      marginTop: '4px',
                    }}
                  />
                </div>

                {/* Content — magazine pull-quote style */}
                <div className="flex-1 min-w-0">
                  <div
                    className="group relative transition-all duration-400"
                    style={{
                      backgroundColor: isActive ? '#F0EBE3' : 'transparent',
                      padding: isActive ? '1.5rem 1.75rem' : '0.5rem 0',
                    }}
                  >
                    {/* Large decorative quote mark */}
                    {isActive && (
                      <div
                        className="absolute left-0 top-0 select-none pointer-events-none leading-none"
                        style={{
                          fontFamily: 'Instrument Serif, serif',
                          fontSize: '5rem',
                          color: '#D45D4A',
                          opacity: 0.12,
                          transform: 'translate(-0.15em, -0.25em)',
                        }}
                      >
                        &ldquo;
                      </div>
                    )}

                    {/* Grain texture on hover */}
                    {isActive && (
                      <div
                        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'repeat',
                          backgroundSize: '128px 128px',
                        }}
                      />
                    )}

                    {/* Active left accent */}
                    <div
                      className="absolute left-0 top-0 bottom-0 transition-all duration-400"
                      style={{
                        width: isActive ? '3px' : '0px',
                        backgroundColor: '#D45D4A',
                      }}
                    />

                    <div className="relative z-10 space-y-4 md:space-y-5">
                      {quote.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="relative flex items-start gap-4">
                          {/* Item number — magazine list style */}
                          <span
                            className="flex-shrink-0 font-mono text-xs tabular-nums leading-relaxed mt-0.5 transition-colors duration-300"
                            style={{
                              color: isActive ? '#D45D4A' : '#E5DFD6',
                              fontWeight: isActive ? 600 : 400,
                              minWidth: '1.5em',
                            }}
                          >
                            {String(itemIndex + 1).padStart(2, '0')}
                          </span>
                          <p
                            className="text-primary leading-relaxed text-sm md:text-base transition-colors duration-300"
                            style={{
                              color: isActive ? '#2C3639' : '#7A7A72',
                              maxWidth: '55ch',
                            }}
                          >
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* End marker */}
        <div className="relative mt-16 flex items-center gap-4 md:gap-8">
          <div className="flex-shrink-0 w-20 md:w-28" />
          <div className="flex-shrink-0 relative z-10">
            <div
              className="w-3 h-3 md:w-4 md:h-4"
              style={{ backgroundColor: '#D45D4A', border: '2px solid #D45D4A' }}
            />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted font-display italic">
              继续书写中...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XingQuotes;