# Achievement Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform achievement cards from flip-based interaction to click-to-modal, with Steam/PS-style achievement unlock feel, rarity-based visual effects tiers, and circular progress for locked achievements.

**Architecture:** AchievementCard becomes a single-sided display with click handler. New AchievementModal component handles detail popup with unlock replay animation and particle effects. Parent components (AchievementsWall, AchievementsCarousel) manage modal state.

**Tech Stack:** React + TypeScript + Tailwind CSS + GSAP + CSS animations

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/AchievementCard.tsx` | Modify | Remove flip, add circular progress SVG, lock icon, onClick callback prop |
| `src/components/AchievementModal.tsx` | Create | Detail popup with unlock replay animation and particle effects |
| `src/components/AchievementsWall.tsx` | Modify | Add modal state, pass onCardClick to cards |
| `src/components/AchievementsCarousel.tsx` | Modify | Add modal state for card clicks (optional - may not need modal in carousel) |

---

## Task 1: Modify AchievementCard.tsx — Remove Flip, Add Circular Progress

**Files:**
- Modify: `src/components/AchievementCard.tsx`

**Reference:** Spec Section 2 (Card Design) and Section 5.1

**Changes:**
- Remove `isFlipped` state and `handleClick` flip logic
- Remove `innerRef` (flip wrapper ref)
- Remove back face DOM (lines ~379-426)
- Remove flip hint SVG icon
- Add `onCardClick?: (achievement: Achievement) => void` prop
- Add lock icon (top-left, absolute positioned) for locked cards
- Add circular progress SVG for locked cards (surrounds icon)
- Update `handleClick` to call `onCardClick?.(achievement)` instead of flip
- Keep: `cardRef`, `glowRef`, 3D tilt logic, entrance animation, unlock celebration animation

**Key code sections to remove (based on current file):**
- Line 86: `const [isFlipped, setIsFlipped] = useState(false);`
- Lines ~154-182: `handleMouseMove` - modify to check `isFlipped` condition is removed
- Lines ~226-236: `handleClick` - replace flip logic with callback
- Lines ~263-269: `innerRef` wrapper div
- Lines ~379-426: Back face DOM
- Lines ~368-375: Flip hint

**Key code to add:**
```tsx
// New prop
export type AchievementCardProps = {
  achievement: Achievement;
  index?: number;
  onCardClick?: (achievement: Achievement) => void;
};

// Circular progress SVG for locked cards (around icon)
// SVG circle with stroke-dasharray/stroke-dashoffset driven by progressPct

// Lock icon: absolute positioned top-left, opacity: 0.4
// <span className="absolute top-2 left-2 text-lg opacity-40">🔒</span>
```

- [ ] **Step 1: Remove flip-related code from AchievementCard.tsx**
- [ ] **Step 2: Add onCardClick prop and update handleClick**
- [ ] **Step 3: Add lock icon for locked cards**
- [ ] **Step 4: Add circular progress SVG for locked cards**
- [ ] **Step 5: Verify card renders correctly (no flip, circular progress visible)**
- [ ] **Step 6: Commit**

---

## Task 2: Create AchievementModal.tsx — Detail Popup Component

**Files:**
- Create: `src/components/AchievementModal.tsx`

**Reference:** Spec Section 3 (Modal Design) and Section 5.2

**Component Structure:**
```tsx
type AchievementModalProps = {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
};
```

**Features:**
1. **Backdrop**: Fixed overlay with `backdrop-blur-sm` and semi-transparent black background, fade in animation
2. **Modal box**: Centered, max-width, rounded-2xl, rarity-colored border and glow
3. **Unlocked version**: Large icon + name + rarity badge + description + unlock time, particle effects
4. **Locked version**: Grayscale icon + name + rarity badge + description + progress percentage, no particles
5. **Unlock replay animation**: GSAP timeline as specified in spec Section 3.4
6. **Close button**: X button top-right
7. **ESC key handler**: useEffect with keydown listener
8. **Click backdrop to close**: onClick on backdrop

**Particle Effects (CSS-only):**
- Unlocked: 5-30 floating particles depending on rarity (CSS animation + pseudo-elements)
- Legendary: Gold particle rain effect

**Animation Timeline (per spec Section 3.4):**
```
t=0ms:    Backdrop opacity 0→1, 200ms, power2.out
t=100ms:  Modal scale(0.8)→1 + opacity 0→1, 300ms, back.out(1.4)
t=200ms:  Icon pulse (scale 1→1.3→1), 400ms
t=300ms:  Border glow opacity 0→1, 300ms
t=400ms+: Particle loop starts
```

- [ ] **Step 1: Create AchievementModal.tsx with basic structure**
- [ ] **Step 2: Implement backdrop and modal box with rarity theming**
- [ ] **Step 3: Add unlocked content (icon, name, description, time)**
- [ ] **Step 4: Add locked content (grayscale icon, progress)**
- [ ] **Step 5: Implement GSAP unlock replay animation timeline**
- [ ] **Step 6: Add CSS particle effects for each rarity tier**
- [ ] **Step 7: Add ESC key handler and backdrop click to close**
- [ ] **Step 8: Verify modal opens/closes correctly**
- [ ] **Step 9: Commit**

---

## Task 3: Integrate Modal in AchievementsWall.tsx

**Files:**
- Modify: `src/components/AchievementsWall.tsx`

**Reference:** Spec Section 5.3 (Data Flow)

**Changes:**
- Add state: `selectedAchievement: Achievement | null`
- Add state: `isModalOpen: boolean`
- Pass `onCardClick={(a) => { setSelectedAchievement(a); setIsModalOpen(true); }}` to AchievementCard
- Render `<AchievementModal isOpen={isModalOpen} achievement={selectedAchievement} onClose={() => setIsModalOpen(false)} />`

**Key code:**
```tsx
const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

// In JSX:
<AchievementCard
  achievement={item}
  onCardClick={(a) => {
    setSelectedAchievement(a);
    setIsModalOpen(true);
  }}
/>

<AchievementModal
  isOpen={isModalOpen}
  achievement={selectedAchievement}
  onClose={() => setIsModalOpen(false)}
/>
```

- [ ] **Step 1: Add modal state to AchievementsWall**
- [ ] **Step 2: Pass onCardClick prop to AchievementCard**
- [ ] **Step 3: Render AchievementModal**
- [ ] **Step 4: Verify modal opens when card is clicked**
- [ ] **Step 5: Commit**

---

## Task 4: Integrate Modal in AchievementsCarousel.tsx (Optional)

**Files:**
- Modify: `src/components/AchievementsCarousel.tsx`

**Decision:** The carousel shows unlocked achievements only (already filtered). Since these are already-unlocked achievements, the modal could provide additional detail. However, adding modal state to carousel may be complex due to the GSAP ticker animation. **Recommendation: Skip modal in carousel for now.** The carousel can remain as a quick-glance display, with full detail available on the achievements wall page.

- [ ] **Step 1: Review if modal integration is needed in carousel**
- [ ] **Step 2: If yes, add state and modal; if no, leave as-is**
- [ ] **Step 3: Commit decision**

---

## Task 5: Add Rarity Effect Tiers to AchievementCard

**Files:**
- Modify: `src/components/AchievementCard.tsx`

**Reference:** Spec Section 4 (Rarity Effect Tiers)

**Current state:** Card already has `rarityTheme` with colors. Need to add CSS animations per rarity.

**Effects to add:**
- **common**: Border glow, static
- **rare**: Pulse animation on border (every 2s)
- **epic**: Rotating light edge on border + pulse halo from center
- **legendary**: Gold flame flow + particle rain effect

**Implementation approach:**
- Add CSS classes for each effect tier
- Use `animation` property in inline `<style>` tag or CSS file
- Particle rain via `::before`/`::after` pseudo-elements with `@keyframes`

**Key CSS animations needed:**
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 10px var(--glow-color); }
  50% { box-shadow: 0 0 25px var(--glow-color); }
}

@keyframes rotating-light {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

@keyframes gold-flame {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
}

@keyframes particle-fall {
  0% { transform: translateY(-10px) translateX(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(100px) translateX(10px); opacity: 0; }
}
```

- [ ] **Step 1: Add CSS keyframes for each rarity effect**
- [ ] **Step 2: Apply pulse-glow to rare cards**
- [ ] **Step 3: Apply rotating-light + pulse-halo to epic cards**
- [ ] **Step 4: Apply gold-flame + particle-fall to legendary cards**
- [ ] **Step 5: Verify effects render correctly for each rarity**
- [ ] **Step 6: Commit**

---

## Task 6: Final Integration and Testing

**Files:**
- All modified files

**Checks:**
1. AchievementCard renders in both unlocked and locked states correctly
2. Circular progress SVG shows correct percentage
3. Lock icon appears for locked cards
4. Click on card opens modal
5. Modal shows correct content for unlocked vs locked
6. Modal animation plays correctly (unlock replay)
7. Modal closes via X button, backdrop click, or ESC
8. Rarity effects visible on cards (pulse, rotating light, gold flame)
9. AchievementsWall filtering still works (category + status filters)
10. No console errors

- [ ] **Step 1: Run dev server and verify all functionality**
- [ ] **Step 2: Test with both unlocked and locked achievements**
- [ ] **Step 3: Verify all rarity tiers display correctly**
- [ ] **Step 4: Test modal open/close interactions**
- [ ] **Step 5: Final commit**
