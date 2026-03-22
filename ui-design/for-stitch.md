# Kids Rewards Manager — Design Prompt for Stitch

> Context document for generating UI screens. Provides app context, screen goals, scope, key UX patterns, and design direction.

---

## App Context

**What it is:** A gamified family rewards app where parents motivate kids (ages 4–8) by awarding/deducting stars for behaviors, and kids redeem stars for rewards. Think Duolingo meets a family chore chart.

**Platform:** Mobile-first web app (PWA), designed for 375px–430px viewport. Touch-optimized with large tap targets.

**Users:**
- **Parents** — manage actions, log star events, approve redemptions, invite family members.
- **Kids (ages 4–8)** — view star balance, browse badges/rewards, interact with their virtual companion.

**Emotional tone:** Warm, encouraging, playful. The app should feel like a cheerful game — not a surveillance tool. Even punishments (star deductions) are framed gently. Parents should feel supported, not judged.

---

## Design System Summary

**Font:** Nunito (all weights 500–900). ExtraBold (800) for headings, Black (900) for the big star number.

**Color palette:**
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#58CC02` | Headers, primary buttons, earn events |
| Dark Green | `#46A302` | 3D button shadow |
| Gold / Amber | `#FFC800` | Stars, kid accents, "Add" buttons |
| Star Yellow | `#F59E0B` | Star balance text |
| Red | `#FF4B4B` | Deductions, punishment actions |
| Purple | `#CE82FF` | Secondary accent |
| Background | `#F7F7F7` | Page background |
| Card Surface | `#FFFFFF` | Cards, sheets |
| Text Primary | `#3C3C3C` | Body text |
| Text Secondary | `#777777` | Labels |

**Key patterns:**
- 3D buttons with solid bottom shadow (no blur) — Duolingo-style depth.
- 20px border radius on cards, 14–16px on buttons/chips.
- Emoji-based icons for kid-facing UI; Lucide icons for parent chrome.
- Bottom tab navigation: parent (5 tabs), kid (3 tabs).
- Bottom sheets for action modals (~85% screen height, 28px top radius, drag handle).

---

## Screens to Design

### Screen 1: Kid Dashboard (updated with Virtual Companion)

**Goal:** The kid's home screen — shows their star balance, virtual companion, badges, and recent activity. This is the emotional center of the app.

**Layout (top to bottom):**
1. **Header bar** — Kid avatar (with decorative frame if earned) + name + "Switch" button.
2. **Star balance card** — Giant star number (72px, Nunito Black, amber). Centered. Bounces on change.
3. **Virtual companion card** — Large illustration (200–240px tall) showing the kid's companion at its current growth stage and mood.
   - Background: soft gradient matching companion type (green for plant, sky blue for animal).
   - Companion has a subtle idle loop animation (gentle sway for plant, bobbing for animal).
   - Below illustration: growth stage label ("Stage 3: Sapling") and a thin progress bar to next stage.
   - Mood indicator: small emoji in the corner (😊/😢/😴).
4. **Badges section** — Horizontal scroll of earned badges (emoji icons in circles), "See all" link.
5. **Recent activity** — Last 5 transactions, color-coded (green for earn, red for deduct, purple for redeem).
6. **Bottom tab bar** — My Stars | Badges | Rewards (emoji icons, active = green).

**Key UX:**
- Tapping the companion triggers a playful reaction animation (bounce, hearts fly out).
- Star balance animates (count up/down) when it changes — not an instant jump.
- The companion is the first thing the kid notices and connects with emotionally.

---

### Screen 2: Companion Growth Stages (Reference Sheet)

**Goal:** Visual reference showing all growth stages for both companion types.

**Layout:**
- Two rows: Plant line and Animal line.
- 5 stages per row, left to right, with labels:
  - Plant: Seed → Sprout → Sapling → Flowering Tree → Grand Tree
  - Animal: Egg → Chick → Young Bird → Colorful Bird → Phoenix
- Each stage shows: illustration + stage name + star threshold ("0–50 ⭐", "51–200 ⭐", etc.).
- Arrow/chevron between stages indicating progression.

**Style:** Clean reference layout on white background. Not an in-app screen — a design spec sheet.

---

### Screen 3: Star Earned — Animation Sequence (Storyboard)

**Goal:** Show the animation cascade that plays when a parent awards stars.

**Frames (3–4 panels, left to right):**
1. **Trigger:** Parent taps "Confirm" on the earn sheet → "+5 ⭐" floats up from the button.
2. **Star bounce:** The star balance number scales up (1.4x) with a gold glow, then settles back.
3. **Confetti + companion reaction:** Gold confetti bursts from center. Companion does a happy bounce with sparkle particles.
4. **Settle:** Everything returns to rest. Companion continues happy idle animation for 10s.

**Style:** Storyboard panels with numbered annotations. Show motion arrows.

---

### Screen 4: Star Deducted — Animation Sequence (Storyboard)

**Goal:** Show the gentle consequence animation when stars are deducted.

**Frames (3 panels):**
1. **Trigger:** Parent taps "Confirm" on the deduct sheet → "−3 ⭐" floats down in muted red.
2. **Star shrink:** The star number shrinks briefly (0.85x), subtle red flash behind the number.
3. **Companion reaction:** Companion droops/wilts, single tear animation, slight color desaturation.

**Style:** Same storyboard format. Annotations emphasize "gentle, not punitive" — no harsh reds or alarm visuals.

---

### Screen 5: Companion Evolution — Celebration Overlay

**Goal:** Full-screen celebration when a companion evolves to the next growth stage.

**Layout:**
- Semi-transparent dark overlay over the dashboard.
- Center: old companion fades out/shrinks, new stage companion grows in with spring bounce.
- Particle effects: stars and sparkles radiating outward.
- Text: "Your [Companion Name] evolved!" in large, sparkly text (Nunito 800, gold with subtle shimmer).
- Subtext: "Stage 3: Sapling" with the stage illustration.
- Dismiss: tap anywhere or auto-dismiss after 4s.

**Feel:** This should be the most impactful moment in the app. Like leveling up in a game.

---

### Screen 6: Avatar Decoration Picker

**Goal:** Let parents/kids browse and select avatar frames and decorations.

**Layout:**
1. **Preview** — Large circular avatar at top (120px) showing current frame applied in real-time as user browses.
2. **Frame grid** — 2 rows of circular frame previews. Each shows a sample avatar with that frame applied.
   - Free frames: normal state.
   - Locked frames: dimmed with a star cost badge overlay ("🔒 100 ⭐").
   - Selected frame: green check + green border.
3. **Unlocked section** at top, **Locked section** below with "Earn more stars to unlock!" label.

**Frames to show:**
- None (plain circle), Stars (rotating ring), Hearts, Crown, Flowers, Rainbow, Lightning.

---

### Screen 7: Parent Home Page (Per-Kid Cards)

**Goal:** Parent's primary workspace. One card per kid with inline action buttons.

**Layout (top to bottom):**
1. **App header** — "Family Name" + settings gear icon.
2. **Getting Started card** (conditional, dismissible) — checklist for new families.
3. **Kid cards** (stacked, full-width, one per kid):
   - Left: Kid avatar (with frame decoration + mood emoji overlay).
   - Center: Kid name (bold) + star balance ("⭐ 142").
   - Right/below: Three chunky 3D buttons — "⭐ Add" (green), "⚠️ Deduct" (red), "🎁 Redeem" (amber).
   - Companion mini-preview: tiny version of the companion (40px) next to the avatar, showing current mood.
4. **Activity feed** (below all kid cards) — date-grouped, all-kids, scrollable.
5. **Bottom tab bar** — Home | Actions | Rewards | Approvals | More.

**Key UX:**
- Tapping a button opens a bottom sheet pre-locked to that kid (no kid picker).
- Avatar decorations and companion mood are visible at a glance — parents see emotional state without tapping in.

---

## Animation Principles

1. **Earn = celebrate.** Big, joyful, multi-element cascade. Gold confetti, happy sounds, bouncing companion.
2. **Deduct = gentle consequence.** Subdued, empathetic. No harsh visuals. Companion shows sadness briefly, then recovers.
3. **Evolve = milestone.** The biggest, most impactful animation. Full-screen, particles, fanfare. Rare and special.
4. **Idle = alive.** The companion always has subtle motion — breathing, swaying, blinking. The app never feels static.
5. **Touch = responsive.** Every tap has scale feedback. Buttons compress on press (scale-95). Cards lift on press (shadow increase).
6. **Speed:** Animations are 0.3–1.5s. Never blocking. User can always interact during animations.
7. **Accessibility:** All animations respect `prefers-reduced-motion`. Sounds can be toggled off in settings.

---

## Avatar Decoration Reference

| Frame | Visual Description | Unlock Cost |
|-------|--------------------|-------------|
| None | Plain circular avatar, no border | Free |
| Stars | Small stars orbiting the avatar in a slow rotation | Free |
| Hearts | Pink/red heart shapes forming a ring around the avatar | 50 ⭐ |
| Crown | Golden crown sitting on top of the avatar circle | 100 ⭐ |
| Flowers | Pastel floral wreath encircling the avatar | 75 ⭐ |
| Rainbow | Gradient rainbow ring (smooth arc) around the avatar | 150 ⭐ |
| Lightning | Electric blue sparks at edges of the avatar circle | 200 ⭐ |

---

## What Makes This App Different

- **The companion is the emotional hook.** Kids don't just earn numbers — they nurture a living thing. This creates intrinsic motivation beyond the transactional star economy.
- **Animations are communication.** For pre-literate or early-reader kids, visual feedback IS the interface. A bouncing happy plant says "good job" more effectively than any text.
- **Parents feel supported, not guilty.** Deduction animations are gentle. Motivational micro-copy validates the parent. The app is on the parent's side.
- **Family identity matters.** Decorated avatars, family member displays, and shared companion watching create a sense of family participation — not just parent-to-kid surveillance.
