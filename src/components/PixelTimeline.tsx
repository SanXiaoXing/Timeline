import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EVENTS } from '../contents/timelineEvents';

gsap.registerPlugin(ScrollTrigger);

export default function PixelTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 遍历每个时间轴项目添加动画
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        // 初始状态设置：向下偏移且透明
        gsap.set(item, { 
          y: 100, 
          opacity: 0,
          filter: 'blur(4px)'
        });

        // 动画：向上滑动并淡入
        gsap.to(item, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%', // 当元素顶部到达视口 85% 处触发
            end: 'bottom 20%',
            toggleActions: 'play none none reverse', // 向上滚动时反向播放
            // markers: true, // 调试用
          }
        });
      });

      // 连接线动画（可选，如果需要更复杂的效果）
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el) itemsRef.current[index] = el;
  };

  return (
    <section ref={containerRef} className="mx-auto max-w-5xl px-4 py-20 relative">
        <h2 className="text-center text-3xl md:text-4xl text-[#A78BFA] mb-16 font-['Press_Start_2P'] drop-shadow-[4px_4px_0px_#4C1D95]">
            <span className="inline-block border-b-4 border-[#F43F5E] pb-4">Timeline</span>
        </h2>

      {/* 垂直连接线 */}
      <div className="absolute left-8 md:left-1/2 top-40 bottom-20 w-1 bg-[#1E1E3F] md:-ml-0.5 border-l-2 border-r-2 border-[#7C3AED] z-0"></div>

      <div className="relative z-10 flex flex-col gap-12 md:gap-24">
        {EVENTS.map((event, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={event.id}
              ref={(el) => addToRefs(el, index)}
              className={`flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} group`}
            >
              {/* 时间列 (在移动端在上方，桌面端在左侧或右侧) */}
              <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-start' : 'md:justify-end'} mb-4 md:mb-0 px-4 pl-16 md:pl-4`}>
                <div className={`
                    inline-block py-2 px-4 
                    bg-[#0F0F23] border-2 border-[#F43F5E] shadow-[4px_4px_0px_#F43F5E]
                    text-[#F43F5E] font-['Press_Start_2P'] text-xs md:text-sm
                    group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_#F43F5E] 
                    transition-all duration-200
                `}>
                  {event.date}
                </div>
              </div>

              {/* 中心点 */}
              <div className="absolute left-8 md:left-1/2 w-6 h-6 -ml-3 bg-[#0F0F23] border-4 border-[#A78BFA] z-20 shadow-[0_0_10px_#7C3AED] transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-45"></div>

              {/* 内容卡片 */}
              <div className={`w-full md:w-1/2 px-4 ${isEven ? 'md:text-right' : 'md:text-left'} pl-16 md:pl-4`}>
                <div className={`
                    relative p-6 bg-[#1A1A2E] border-4 border-[#7C3AED] shadow-[8px_8px_0px_#7C3AED]
                    group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[4px_4px_0px_#7C3AED]
                    transition-all duration-200
                `}>
                    {/* 装饰性角标 */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#F43F5E] border-2 border-[#0F0F23]"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#F43F5E] border-2 border-[#0F0F23]"></div>

                  <h3 className="text-lg md:text-xl text-[#E2E8F0] font-['Press_Start_2P'] mb-4 leading-normal">
                    {event.title}
                  </h3>
                  <p className="text-[#94A3B8] font-['VT323'] text-xl leading-relaxed mb-4">
                    {event.description}
                  </p>
                  <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                    {event.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-[#2E1065] text-[#A78BFA] px-2 py-1 font-['Press_Start_2P'] border border-[#4C1D95]">
                        # {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
