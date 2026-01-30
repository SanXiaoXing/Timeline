import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';

type AppleIntroProps = {
  projectName: string;
  author: string;
};

const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif';

const monoStack =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const GlowBlob: React.FC<{ x: number; y: number; size: number; color: string; intensity?: number }> = ({
  x,
  y,
  size,
  color,
  intensity = 0.65
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, rgba(0,0,0,0) 62%)`,
        filter: `blur(${Math.max(18, size * 0.06)}px)`,
        opacity: intensity,
        transform: 'translateZ(0)'
      }}
    />
  );
};

const Panel: React.FC<{
  title: string;
  subtitle: string;
  chips: string[];
  accent: string;
  previewKind: 'progress' | 'timeline' | 'quests';
}> = ({ title, subtitle, chips, accent, previewKind }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({ fps, frame, config: { damping: 18, stiffness: 140, mass: 0.9 } });
  const y = interpolate(reveal, [0, 1], [26, 0]);
  const op = interpolate(reveal, [0, 1], [0, 1]);

  const bar = useMemo(() => {
    if (previewKind === 'progress') return 0.72;
    if (previewKind === 'timeline') return 0.58;
    return 0.42;
  }, [previewKind]);

  const barFill = interpolate(spring({ fps, frame: frame - 12, config: { damping: 22, stiffness: 120 } }), [0, 1], [
    0,
    bar
  ]);

  return (
    <div
      style={{
        width: 1160,
        borderRadius: 28,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
        padding: 34,
        transform: `translateY(${y}px)`,
        opacity: op,
        backdropFilter: 'blur(14px)'
      }}
    >
      <div style={{ display: 'flex', gap: 26, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: fontStack,
              fontWeight: 650,
              fontSize: 46,
              letterSpacing: -1.2,
              color: 'rgba(255,255,255,0.95)',
              lineHeight: 1.1
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: fontStack,
              fontWeight: 430,
              fontSize: 22,
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.35,
              maxWidth: 680
            }}
          >
            {subtitle}
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {chips.map(chip => (
              <div
                key={chip}
                style={{
                  fontFamily: monoStack,
                  fontSize: 15,
                  padding: '8px 12px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(0,0,0,0.22)',
                  color: 'rgba(255,255,255,0.78)'
                }}
              >
                {chip}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            width: 360,
            height: 210,
            borderRadius: 22,
            border: '1px solid rgba(255,255,255,0.12)',
            background:
              previewKind === 'timeline'
                ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(244,63,94,0.10))'
                : previewKind === 'quests'
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.14), rgba(16,185,129,0.08))'
                  : 'linear-gradient(135deg, rgba(124,58,237,0.14), rgba(59,130,246,0.10))',
            padding: 18,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -80,
              background:
                'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.11), rgba(0,0,0,0) 55%), radial-gradient(circle at 70% 75%, rgba(255,255,255,0.08), rgba(0,0,0,0) 60%)',
              transform: `rotate(${interpolate(frame, [0, 90], [0, 8])}deg)`
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontFamily: monoStack,
                fontSize: 13,
                letterSpacing: 1.3,
                color: 'rgba(255,255,255,0.72)',
                textTransform: 'uppercase'
              }}
            >
              预览
            </div>

            <div
              style={{
                marginTop: 12,
                height: 10,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.10)'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${barFill * 100}%`,
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.92))`,
                  boxShadow: `0 0 26px ${accent}`
                }}
              />
            </div>

            <div
              style={{
                marginTop: 18,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 52,
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(0,0,0,0.18)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC<{ projectName: string; author: string }> = ({ projectName, author }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ fps, frame, config: { damping: 18, stiffness: 120, mass: 0.9 } });
  const titleY = interpolate(enter, [0, 1], [40, 0]);
  const titleOp = interpolate(enter, [0, 1], [0, 1]);

  const kicker = spring({ fps, frame: frame - 10, config: { damping: 20, stiffness: 160 } });
  const kickerOp = interpolate(kicker, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ paddingLeft: 140, paddingRight: 140, paddingTop: 120 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div
            style={{
              fontFamily: monoStack,
              fontSize: 16,
              letterSpacing: 1.2,
              color: 'rgba(255,255,255,0.70)',
              opacity: kickerOp
            }}
          >
            项目设计概览
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: fontStack,
              fontWeight: 760,
              fontSize: 84,
              letterSpacing: -2.8,
              lineHeight: 0.98,
              color: 'rgba(255,255,255,0.95)',
              transform: `translateY(${titleY}px)`,
              opacity: titleOp
            }}
          >
            {projectName}
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: fontStack,
              fontSize: 26,
              fontWeight: 430,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 820,
              lineHeight: 1.35
            }}
          >
            像素游戏风格的个人站点，用 Apple 风格的叙事与节奏呈现页面设计与动效细节。
          </div>
        </div>

        <div
          style={{
            padding: '14px 18px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(0,0,0,0.18)',
            fontFamily: monoStack,
            fontSize: 14,
            color: 'rgba(255,255,255,0.78)'
          }}
        >
          作者：{author}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AppleIntro: React.FC<AppleIntroProps> = ({ projectName, author }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const bgShift = interpolate(frame, [0, 600], [0, 1]);
  const vignette = interpolate(frame, [0, 90], [0.55, 0.72]);
  const grain = spring({ fps, frame: frame - 8, config: { damping: 24, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#05050A' }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(1200px 700px at 24% 28%, rgba(255,255,255,0.09), rgba(0,0,0,0) 60%), radial-gradient(1000px 600px at 78% 64%, rgba(255,255,255,0.06), rgba(0,0,0,0) 58%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0))'
        }}
      />

      <GlowBlob x={width * 0.22} y={height * 0.30} size={560} color="rgba(124,58,237,0.95)" intensity={0.38} />
      <GlowBlob x={width * (0.76 - bgShift * 0.05)} y={height * 0.62} size={620} color="rgba(244,63,94,0.88)" intensity={0.32} />
      <GlowBlob x={width * 0.52} y={height * (0.76 - bgShift * 0.06)} size={720} color="rgba(59,130,246,0.72)" intensity={0.20} />

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          opacity: 0.18
        }}
      />

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, rgba(0,0,0,${vignette}), rgba(0,0,0,0.98) 72%)`
        }}
      />

      <AbsoluteFill style={{ opacity: 0.18 * grain, mixBlendMode: 'overlay' }}>
        <Img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E" />
      </AbsoluteFill>

      <Sequence from={0} durationInFrames={150}>
        <Hero projectName={projectName} author={author} />
      </Sequence>

      <Sequence from={120} durationInFrames={150}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 120 }}>
          <Panel
            title="页面设计：深色像素主题"
            subtitle="硬边框 + 硬阴影 + 复古网格 + CRT 扫描线，让整体更像一款可交互的像素游戏界面。"
            chips={['Dark Theme', 'Pixel Border', 'Hard Shadow', 'CRT']}
            accent="rgba(244,63,94,1)"
            previewKind="progress"
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={240} durationInFrames={150}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 120 }}>
          <Panel
            title="时间进度：信息密度与节奏"
            subtitle="日 / 周 / 月 / 年进度与数字滚动，让页面在“每一秒”都有变化，并保持顺滑的视觉节奏。"
            chips={['Progress', 'Rolling Numbers', 'GSAP', 'Motion']}
            accent="rgba(124,58,237,1)"
            previewKind="timeline"
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={360} durationInFrames={150}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 120 }}>
          <Panel
            title="项目页：纵向时间轴对齐"
            subtitle="时间右对齐到竖轴，内容左对齐；节点与连接线清晰分层，滚动时逐条出现，避免遮挡。"
            chips={['/projects', 'Timeline Axis', 'ScrollTrigger', 'Layout']}
            accent="rgba(245,158,11,1)"
            previewKind="quests"
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={480} durationInFrames={90}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 120 }}>
          <Panel
            title="任务卡片：层级与可读性"
            subtitle="状态徽章、进度条、技术栈标签统一节奏，让信息密度更高但依然清晰。"
            chips={['Badges', 'Progress Bar', 'Chips', 'Typography']}
            accent="rgba(16,185,129,1)"
            previewKind="quests"
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={570} durationInFrames={30}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              fontFamily: fontStack,
              fontWeight: 720,
              fontSize: 58,
              letterSpacing: -1.8,
              color: 'rgba(255,255,255,0.92)',
              textAlign: 'center',
              lineHeight: 1.1
            }}
          >
            用设计驱动体验
            <div style={{ marginTop: 10, fontWeight: 430, fontSize: 24, color: 'rgba(255,255,255,0.72)' }}>
              像素主题 • 页面布局 • 滚动动效
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
