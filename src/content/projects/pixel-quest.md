---
name: "游戏卡片成就墙"
status: "completed"
achievementTags: ["skill", "study"]
currentStage: "发布"
progressPct: 100
milestones:
  - id: "m1"
    label: "立项"
    pct: 10
    description: "确定任务板信息结构：任务、阶段、奖励与状态。参考游戏化任务系统，设计像素风格的视觉语言。"
  - id: "m2"
    label: "UI 组件"
    pct: 25
    description: "完成任务卡片、筛选、标签与 HUD 头部组件。采用霓虹描边与像素字体，营造复古游戏氛围。"
  - id: "m3"
    label: "动效系统"
    pct: 40
    description: "统一进入/切换/数值变化动效节奏，建立动效基线。引入 GSAP 实现流畅的进度条动画与卡片交互。"
  - id: "m4"
    label: "数据驱动"
    pct: 60
    description: "任务来自 TS/JSON，支持状态与筛选联动。实现里程碑解锁逻辑与时间轴联动展示。"
  - id: "m5"
    label: "发布"
    pct: 100
    description: "打磨交互与可读性，完成发布版本。优化性能与可访问性，确保多端兼容。"
timeline:
  - id: "t1"
    milestoneId: "m1"
    title: "任务接取：像素任务板"
    date: "2026-01-10"
    detail: "定义任务/阶段/奖励的数据模型与页面骨架。确定像素风格设计方向，调研复古游戏 UI 设计模式。"
    result: "项目立项文档完成，设计规范初稿"
  - id: "t2"
    milestoneId: "m2"
    title: "HUD 组件搭建"
    date: "2026-01-12"
    detail: "完成卡片布局、霓虹描边与锁定态视觉规范。使用 Tailwind CSS 实现响应式像素风格组件。"
    result: "UI 基线可复用，组件库初步成型"
  - id: "t3"
    milestoneId: "m3"
    title: "动效节奏统一"
    date: "2026-01-15"
    detail: "引入 ease-out 动效并规范 hover/enter 的时长与发光强度。GSAP 动画库集成完成，实现数字滚动与进度条缓动。"
    result: "动效规范文档，动画组件封装"
  - id: "t4"
    milestoneId: "m3"
    title: "里程碑时间轴"
    date: "2026-01-18"
    detail: "实现里程碑解锁逻辑与时间轴联动。左侧日期展示，右侧内容卡片，支持展开/收起详情。"
    result: "时间轴组件可用，交互流畅"
  - id: "t5"
    milestoneId: "m4"
    title: "数据驱动"
    date: "2026-03-30"
    detail: "把任务状态与筛选完全数据化，支持多项目复用。实现 Markdown 配置驱动页面渲染。"
    result: "数据驱动组件可用，支持多项目复用"
  - id: "t6"
    milestoneId: "m5"
    title: "发布"
    date: "2026-03-31"
    detail: "性能与可访问性优化，输出稳定版本。补充文档与使用说明。"
---

游戏成就风格的任务管理面板，带有游戏化体验。设计灵感来源于复古 RPG 游戏的任务系统，采用霓虹色系与像素字体，营造沉浸式的任务追踪体验。

## 核心特性

- **像素风格 UI**：霓虹描边、像素字体、复古配色
- **游戏化进度**：里程碑解锁、进度百分比、成就标签
- **时间轴展示**：左侧日期 + 右侧内容的双栏布局
- **流畅动效**：GSAP 驱动的数字滚动与卡片动画
- **数据驱动**：Markdown 配置即可创建新项目

## 技术栈

- Astro + React + TypeScript
- Tailwind CSS + GSAP
- 响应式设计，支持移动端

当前处于暂停状态，等待后续的优化和打磨。计划中的改进包括：性能优化、更多交互细节、以及可访问性提升。
