import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECT_EVENTS } from '../contents/projectEvents';

gsap.registerPlugin(ScrollTrigger);

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    completed: 'bg-[#10B981] text-[#064E3B] border-[#064E3B]',
    'in-progress': 'bg-[#F59E0B] text-[#78350F] border-[#78350F]',
    planned: 'bg-[#6366F1] text-[#312E81] border-[#312E81]',
    paused: 'bg-[#EF4444] text-[#7F1D1D] border-[#7F1D1D]',
  };
  
  const labels = {
    completed: 'DONE',
    'in-progress': 'ACTIVE',
    planned: 'TODO',
    paused: 'HALT',
  };

  return (
    <span className={`
      inline-block px-2 py-1 text-[10px] font-['Press_Start_2P'] border-2
      ${colors[status as keyof typeof colors] || colors.planned}
      uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,0.5)]
    `}>
      [{labels[status as keyof typeof labels] || 'UNK'}]
    </span>
  );
};

export default function ProjectQuestLog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 装饰性：背景扫描线动画
      gsap.to('.scan-line', {
        y: '100%',
        duration: 3,
        ease: 'linear',
        repeat: -1
      });

      // 主时间轴线动画
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: 'top' },
          {
            scaleY: 1,
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%'
            }
          }
        );
      }

      // 列表项动画
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        const content = item.querySelector('.quest-content');
        const date = item.querySelector('.quest-date');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });

        // 1. 日期滑入
        tl.fromTo(date,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4 }
        );

        // 2. 内容卡片展开
        tl.fromTo(content,
          { scaleY: 0, opacity: 0, transformOrigin: 'top' },
          { scaleY: 1, opacity: 1, duration: 0.5, ease: 'circ.out' },
          "-=0.2"
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el) itemsRef.current[index] = el;
  };

  return (
    <section ref={containerRef} className="max-w-6xl mx-auto px-4 py-16 relative">
      <div className="relative">
        <div
          ref={lineRef}
          className="absolute left-28 md:left-36 top-2 bottom-2 w-[3px] bg-[#F43F5E] shadow-[0_0_12px_rgba(244,63,94,0.55)] z-0"
        />

        <div className="flex flex-col gap-12 relative z-10">
        {PROJECT_EVENTS.map((event, index) => (
          <div 
            key={event.id}
            ref={(el) => addToRefs(el, index)}
            className="relative grid grid-cols-[7rem_1fr] md:grid-cols-[9rem_1fr] gap-6 group"
          >
            <div
              className={`absolute left-28 md:left-36 top-4 h-[2px] w-6 ${
                event.status === 'completed'
                  ? 'bg-[#10B981]'
                  : event.status === 'in-progress'
                    ? 'bg-[#F59E0B]'
                    : event.status === 'paused'
                      ? 'bg-[#EF4444]'
                      : 'bg-[#6366F1]'
              } z-10`}
              style={{ transform: 'translateX(0)' }}
            />
            <div className="absolute left-28 md:left-36 top-2 z-20" style={{ transform: 'translateX(-50%)' }}>
              <div
                className={`h-5 w-5 rotate-45 border-2 bg-[#0F0F23] ${
                  event.status === 'completed'
                    ? 'border-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.65)]'
                    : event.status === 'in-progress'
                      ? 'border-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.65)] animate-pulse'
                      : event.status === 'paused'
                        ? 'border-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                        : 'border-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                }`}
              />
            </div>

            {/* 时间显示 (现在是内容的一部分，不再绝对定位到左侧) */}
            <div className="quest-date flex items-start justify-end pt-1 pr-0">
              <div className="inline-block bg-[#0F0F23] border-2 border-[#A78BFA] px-2 py-1 shadow-[2px_2px_0px_#A78BFA] text-right">
                <span className="text-[#F43F5E] font-['Press_Start_2P'] text-xs whitespace-nowrap">{event.date}</span>
              </div>
            </div>

            {/* 右侧内容卡片 */}
            <div className="quest-content flex-grow">
              <div className="relative bg-[#1A1A2E] border-2 border-[#4C1D95] p-1 shadow-[6px_6px_0px_#4C1D95] group-hover:shadow-[4px_4px_0px_#7C3AED] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-200">
                  {/* 内部容器 (终端风格) */}
                  <div className="bg-[#0D0D1F] border border-[#2E1065] p-5 relative overflow-hidden">
                    {/* 扫描线效果 */}
                    <div className="scan-line absolute inset-x-0 h-1 bg-white/5 pointer-events-none z-0"></div>
                    
                    {/* 头部：标题与状态 */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4 relative z-10">
                      <h3 className="text-lg md:text-xl text-[#E2E8F0] font-['Press_Start_2P'] leading-relaxed">
                        <span className="text-[#F43F5E] mr-2">{event.title}</span>
                        
                      </h3>
                      <StatusBadge status={event.status} />
                    </div>

                    {/* 描述 */}
                    <p className="text-[#94A3B8] font-['VT323'] text-xl mb-6 leading-relaxed border-l-2 border-[#4C1D95] pl-4">
                      {event.description}
                    </p>

                    {/* 底部：进度与技术栈 */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                      {/* 进度条 */}
                      <div className="w-full md:w-1/2">
                         <div className="flex justify-between text-[10px] font-['Press_Start_2P'] text-[#A78BFA] mb-2">
                           <span>PROGRESS</span>
                           <span>{event.progress}%</span>
                         </div>
                         <div className="h-3 bg-[#1E1E3F] border border-[#4C1D95] p-0.5">
                            <div 
                              className="h-full bg-gradient-to-r from-[#7C3AED] to-[#F43F5E]" 
                              style={{ width: `${event.progress}%` }}
                            ></div>
                         </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 justify-start">
                        {event.techStack.map(tech => (
                          <span key={tech} className="px-2 py-1 text-[10px] bg-[#1E1E3F] text-[#E2E8F0] font-['VT323'] border border-[#4C1D95] uppercase tracking-wider">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
