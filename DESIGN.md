# Design System — SanXiaoXing Timeline

## Product Context
- **What this is:** SanXiaoXing 的个人专业作品集网站，以杂志编辑风格呈现项目、人生节点和思考。
- **Who it's for:** 招聘者、技术面试官、同行开发者。
- **Space/industry:** 个人品牌 / 开发者作品集。
- **Project type:** 编辑型作品集网站（Editorial Portfolio）。
- **Memorable thing:** "这个人的品味不像程序员，他做的项目比简历上写的更有意思。"

## Aesthetic Direction
- **Direction:** 手工现代主义 (Crafted Modernism) — Instrument Serif 的锐利 + 深灰绿的沉稳 + 陶土红的温暖。
- **Decoration level:** 极简 — 排版本身承担所有装饰功能。无粒子、无渐变、无 box-shadow。
- **Mood:** 像一个做手工的现代设计师的工作室。温暖但不甜腻，锐利但不冷漠。
- **Reference:** Instrument (type foundry aesthetic), Kinfolk (editorial pacing), Marie O'Connor (quiet confidence).

## Typography
- **Display/Hero:** Instrument Serif (OFL) — 锐利现代衬线，有「高定时装杂志」的精致感，但不是传统出版社的保守。
- **Body (English):** DM Sans (OFL) — 温暖的人文无衬线，不是冷冰冰的几何体。与 Instrument Serif 形成「衬线标题 + 无衬线正文」的经典搭配。
- **Body (Chinese):** Noto Sans SC (OFL) — 思源黑体，匹配无衬线正文方向。字重齐全，长时间阅读舒适。
- **Code:** JetBrains Mono (OFL) — 经典开发者选择，连字支持好，辨识度高。
- **Loading:** 自托管 + font-display: swap。中文子集化只保留常用 3500 字以控制体积。
- **Scale:** 使用 modular scale (1.25 ratio):
  - xs: 0.75rem (12px)
  - sm: 0.875rem (14px)
  - base: 1rem (16px)
  - lg: 1.125rem (18px)
  - xl: 1.25rem (20px)
  - 2xl: 1.5rem (24px)
  - 3xl: 1.875rem (30px)
  - 4xl: 2.25rem (36px)
  - 5xl: 3rem (48px)
  - 6xl: 3.75rem (60px)
- **Line height:** 标题 1.2, 正文 1.8.

## Color
- **Approach:** 克制型 — 7 个颜色，每多一个颜色出现都是事件。
- **Primary text:** #2C3639 — 深灰绿，不是纯黑。更柔和，有「手工陶艺」的质感。
- **Secondary text:** #7A7A72 — 暖灰，不是冷灰。
- **Background:** #F6F2EB — 暖纸色，手工陶艺感。
- **Surface/Card:** #F0EBE3 — 比背景深一层，像叠了硫酸纸。
- **Accent:** #D45D4A — 陶土红，全站只出现 3-5 次。出现即事件。
- **Link:** #4A6B5F — 鼠尾草绿，温和的引导色。
- **Divider:** #E5DFD6 — 几乎看不见的水印线。
- **Dark mode:** 背景 #1E1F1D, 卡片 #292A27, 主文字 #E5DFD6, 辅文字 #9E9A93, 强调色 #E07B6A, 链接 #6B9A82, 分割线 #3A3833。配色饱和度降低 10-15%。

## Spacing
- **Base unit:** 8px
- **Density:** 舒适型 (spacious)
- **Scale:**
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px
  - 2xl: 48px
  - 3xl: 64px
  - 4xl: 96px

## Layout
- **Approach:** 混合型 — 桌面端 12 列杂志网格（不对称排版），移动端单列流式。
- **Grid:** 12 列, 桌面端列间距 24px, 移动端 16px。
- **Max content width:** 1200px (含内边距)。
- **Border radius:** 无圆角 — 所有元素直角。与 Instrument Serif 的锐利气质一致。

## Motion
- **Approach:** 克制功能型 — 只服务于内容理解，不装饰。
- **Easing:** enter (ease-out), exit (ease-in), move (ease-in-out).
- **Duration:**
  - micro: 50-100ms (hover)
  - short: 150-250ms (fade, toggle)
  - medium: 250-400ms (page transition)
  - long: 400-700ms (不需要)
- **Scroll reveal:** 内容块从下方 20px 上浮，stagger 80ms。prefers-reduced-motion 时全部关闭。
- **No:** ScrollTrigger, parallax, decorative animation.

## Design Tokens (Tailwind)
```js
// tailwind.config.mjs
colors: {
  paper:    '#F6F2EB',
  card:     '#F0EBE3',
  primary:  '#2C3639',
  muted:    '#7A7A72',
  accent:   '#D45D4A',
  link:     '#4A6B5F',
  divider:  '#E5DFD6',
},
fontFamily: {
  display:  ['Instrument Serif', 'Noto Serif SC', 'serif'],
  body:     ['DM Sans', 'Noto Sans SC', 'sans-serif'],
  mono:     ['JetBrains Mono', 'monospace'],
},
```

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-06 | Initial design system created | Created by /design-consultation based on product context (developer portfolio), competitive research, and outside voice proposal. |
| 2026-06-06 | Display: Instrument Serif | User chose over Fraunces — sharper, more modern, "fashion magazine" feel over "literary magazine". |
| 2026-06-06 | Body: Serif heading + Sans-serif body | User chose over all-serif — modern magazine convention, reduces "too traditional" feel. |
| 2026-06-06 | Code: JetBrains Mono | User chose over Geist Mono — classic developer choice, better ligature support. |
| 2026-06-06 | Color: Warm paper + deep gray-green + terracotta | User chose over pure paper tones — more organic, "handmade pottery studio" warmth. |