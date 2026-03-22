# Kids Rewards Manager — Design Prompt (Clean Version)

> Slim design brief for Stitch. Kids-first, parent-comfortable. No companion/pet system — focused on the core star economy, animations, and avatar decorations.

---

## What This App Does

Parents award or deduct stars for kids' behaviors. Kids see their stars, collect badges, and redeem rewards. The app replaces sticker charts and nagging with a playful, game-like loop.

**Users:** Kids aged 4–8 (primary) and their parents/caregivers (co-users).

**Platform:** Mobile web (375–430px), touch-first, PWA.

---

## Design Philosophy

### Kids First, Parents Comfortable

- **Kids** experience the app as a colorful, animated game. Minimal text. Big icons. Every action has a visible, satisfying reaction.
- **Parents** experience the app as a simple, fast tool. Clean layout. Clear buttons. No friction when logging stars in the moment.
- Both share the same visual language — warm, rounded, playful — so the app feels like one cohesive family space, not two separate apps duct-taped together.

### Core Principles

1. **Show, don't tell.** Icons, colors, and animations carry meaning before text does. A 5-year-old should understand their dashboard without reading.
2. **Celebrate effort.** Earning stars feels exciting — gold confetti, bouncing numbers, cheerful sounds. Kids want to earn more.
3. **Be gentle with consequences.** Losing stars feels firm but not scary — a soft shrink, a muted tone. No alarm reds, no angry icons.
4. **Feel alive.** Nothing is static. Subtle idle animations, responsive tap feedback, smooth transitions. The app breathes.
5. **Keep it fast.** Parents log stars in emotional, time-pressured moments. Two taps to award. One tap to confirm. Done.

---

## Design System

### Colors

| Token | Hex | When to Use |
|-------|-----|-------------|
| Green | `#58CC02` | Primary actions, headers, earn events, active nav |
| Dark Green | `#46A302` | 3D button bottom shadow |
| Gold | `#FFC800` | Stars, kid highlights, "Add" buttons |
| Amber | `#F59E0B` | Star balance number |
| Red | `#FF4B4B` | Deductions only — used sparingly |
| Dark Red | `#CC3B3B` | Red button shadow |
| Purple | `#CE82FF` | Secondary kid accent, creativity category |
| Background | `#F7F7F7` | Page fill (warm light gray) |
| Card | `#FFFFFF` | All cards and sheets |
| Text | `#3C3C3C` | Primary text |
| Text Light | `#777777` | Labels, secondary text |
| Border | `#E5E7EB` | Card edges, dividers |

**Usage rule:** Red appears only for deduction buttons and deduction-related UI. Never for errors, warnings, or decorative elements. Kids should not associate the app with "red = bad."

### Typography

| Style | Size | Weight | Use |
|-------|------|--------|-----|
| Star Balance | 72px | 900 (Black) | The big number on kid dashboard |
| Screen Title | 22px | 800 | Page headings |
| Section Header | 18px | 800 | Card titles, section labels |
| Body | 15px | 700 | Card content, button labels |
| Caption | 12–13px | 500–600 | Timestamps, meta text |
| Tab Label | 10px | 700, uppercase | Bottom nav labels |

**Font:** Nunito throughout. Rounded terminals match the playful, soft aesthetic.

### Shape Language

- **Cards:** 20px radius, solid bottom shadow (0px blur, 4px offset, `#E5E5E5`). Feels like stickers on a board.
- **Buttons:** 14–16px radius, solid bottom shadow for 3D depth. Press state removes shadow (button "pushes in").
- **Bottom sheet:** 28px top radius, drag handle bar, slides up with spring easing.
- **Avatars:** Perfect circle. Optional decorative frame overlay.
- **Icons:** Emoji for kid-facing UI (🌟⭐🎁🏅). Lucide outlined icons for parent-facing chrome.

---

## Screens

### 1. Kid Dashboard — "My Stars"

The kid's home. Simple, bold, celebratory.

**Layout:**
1. **Avatar + name** — Large circular avatar (80px) with optional decorative frame. Kid's name in bold beside it. "Switch" link (small, top-right).
2. **Star balance** — Centered, dominant. Giant gold number (72px) with a ⭐ icon. This is the hero element. Bounces when it changes.
3. **Badges preview** — Horizontal scroll row of earned badges (emoji in soft-colored circles). "See all →" link. If no badges yet: friendly empty state ("Earn your first badge!").
4. **Recent activity** — Last 5 events. Each row: category emoji + action name + relative time + star amount (green "+5" or red "−3"). Color-coded left border (green/amber/red).
5. **Bottom nav** — 3 tabs: ⭐ My Stars | 🏅 Badges | 🎁 Rewards. Active tab = green. Emoji icons (not Lucide) for playful feel.

**Key details:**
- Background: `#F7F7F7`. Cards are white with solid shadow.
- Star number uses `#F59E0B` (amber). Always visible, never truncated.
- Empty states use friendly illustrations or large emoji + short encouraging text.

---

### 2. Parent Home — Per-Kid Cards

The parent's primary workspace. See all kids at a glance, take action instantly.

**Layout:**
1. **Header** — Family name (left), settings gear (right). Clean, minimal.
2. **Kid cards** (stacked vertically, full-width):
   - Avatar (56px, with frame if set) + mood emoji overlay (small, bottom-right corner of avatar).
   - Name (bold) + star balance ("⭐ 142") on the same line.
   - Three action buttons in a row below:
     - **⭐ Add** — green 3D button
     - **⚠️ Deduct** — red 3D button (smaller visual weight than Add)
     - **🎁 Redeem** — amber 3D button
   - Card has white background, 20px radius, solid shadow.
3. **Activity feed** — Below all kid cards. Date-grouped. All kids combined. Scrollable.
4. **Bottom nav** — 5 tabs: Home | Actions | Rewards | Approvals | More.

**Key details:**
- Add button is visually dominant (larger or bolder than Deduct). Parents should reach for the positive action first.
- Tapping any button opens a bottom sheet pre-locked to that kid. No kid-picker step inside.

---

### 3. Add Stars — Bottom Sheet

Opens when parent taps "⭐ Add" on a kid card.

**Layout:**
1. **Header** — Kid avatar + "Add Stars for [Name]" + close (×) button.
2. **Amount input** — Large editable number (center, 48px), flanked by [−] and [+] stepper buttons. Tapping the number opens numeric keyboard.
3. **Event grid** — 2-column grid of active earn actions (icon + name + default stars). Tapping one pre-fills the amount and highlights the card.
4. **"Custom (no event)"** — Always available as the first option. For free-form star awards.
5. **Reason field** — Optional single-line text input. "What happened?" placeholder. Never mandatory.
6. **Confirm button** — Full-width green 3D button: "Award [X] ⭐ to [Name]". Large, satisfying to tap.
7. **Recent history** — Below the fold, scrollable. Last 10 transactions for this kid.

**Feel:** Bright, encouraging. Green-dominant. The confirm button should feel like pressing a "well done" stamp.

---

### 4. Deduct Stars — Bottom Sheet

Same structure as Add Stars, but with adjusted tone.

**Differences from Add sheet:**
- Header says "Deduct Stars from [Name]".
- Event grid shows deduction actions only (filtered by `isDeduction`).
- Confirm button is **muted red** (not bright red): "Deduct [X] ⭐ from [Name]".
- Reason field is always visible (parents often want to note why).
- No confetti or celebration after confirming. Just a warm toast: "Stand your ground — better next time 💪".

**Feel:** Firm but warm. Not punitive. The red is desaturated, the language is empathetic.

---

### 5. Kid Rewards Page

Where kids browse and redeem rewards.

**Layout:**
1. **Header** — "🎁 Rewards" + current star balance chip (e.g., "⭐ 142").
2. **Wishlist section** (if any wishes set) — Top slot. Shows wished rewards with progress bars (current stars / cost).
3. **Reward cards** — Grid or list of available rewards.
   - Affordable: full color, green border, tappable.
   - Unaffordable: slightly dimmed (not greyed out — just softer). Shows "Need [X] more ⭐".
   - Each card: emoji icon + reward name + cost.
4. **Tapping an affordable reward** → Confirmation dialog: "Spend [X] ⭐ on [Reward]?" with Confirm/Cancel.

**Feel:** Like a toy store window. Rewards should feel exciting and aspirational, even the ones they can't afford yet.

---

### 6. Avatar Decoration Picker

Accessed from kid profile edit or settings.

**Layout:**
1. **Live preview** — Large avatar (120px) at top, showing the selected frame in real-time.
2. **Frame options** — Grid of circular previews, each showing a sample avatar with a frame applied.
   - Unlocked: normal, tappable. Selected = green check.
   - Locked: dimmed with "🔒 [cost] ⭐" badge. Tapping shows "Earn more stars to unlock!"
3. **Section labels:** "Available" (top) and "Locked" (below).

**Frames:**
- None (plain), Stars (rotating ring), Hearts (pink ring), Crown (gold top), Flowers (pastel wreath), Rainbow (gradient arc), Lightning (blue sparks).

**Feel:** Like a dress-up game. Fun to browse even before unlocking everything.

---

## Animation Spec

### Earn Stars
1. "+[X] ⭐" label floats upward from confirm button, fades out (0.8s).
2. Star balance number scales up (1.0 → 1.3 → 1.0) with gold glow pulse (0.6s).
3. Gold confetti burst from center (existing `canvas-confetti`, 90 particles).
4. Ascending chime plays (existing `playEarnSound()`).

### Deduct Stars
1. "−[X] ⭐" label floats downward in muted red, fades out (0.6s).
2. Star balance number shrinks (1.0 → 0.85 → 1.0) with brief red tint (0.4s).
3. Soft descending tone (existing `playDeductSound()`).
4. No confetti. No celebration.

### Redeem Reward
1. 🎁 emoji burst around the reward card (6–8 gift emojis scatter outward, 0.8s).
2. Star balance counts down numerically (old → new value, 1s).
3. Celebratory bell sound (existing `playRedeemSound()`).

### General
- All buttons: `scale(0.95)` on press, `scale(1.0)` on release (60ms).
- Cards: staggered slide-up on page load (50ms delay between cards).
- Bottom sheet: slides up with spring easing (0.3s).
- Toast messages: slide in from top, auto-dismiss after 3s.
- All animations respect `prefers-reduced-motion`.

---

## What NOT to Include

- No virtual pet, plant, or growing companion (deferred to future version).
- No photo upload UI (handled separately).
- No analytics/reports screens.
- No onboarding wizard screens.
- No login/signup screens.
- No Chinese localization in the designs (handled in code).
