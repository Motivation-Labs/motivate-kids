# UI Design v1 — Duolingo-Style Redesign

## Design File

- **`motivate-your-kids-duolingo-style.pen`** — Open in Pencil app to view/edit all screens

## Screens

| # | Screen | Node ID | Description |
|---|--------|---------|-------------|
| 01 | Role Selection | `NFGAI` | Green gradient splash with "I'm a Parent" / "I'm a Kid" chunky buttons |
| 02 | Parent Home | `v4qcG` | Per-kid cards with avatar, star balance, and Add/Deduct/Redeem action buttons |
| 03 | Kid Dashboard | `E8GXL` | Big star balance (72px), badge wall, color-coded activity feed |
| 04 | Parent Actions | `pdJuy` | Search bar, category filter chips, action cards with inline Log buttons |
| 05 | Bottom Sheet | `spvzd` | Add Stars sheet with stepper, event grid, reason field, confirm CTA |

## Exporting PNGs

Open the `.pen` file in Pencil, then for each screen:
1. Select the screen frame by its node ID (listed above)
2. Right-click > Export > PNG (2x for retina)
3. Save to this folder as `01-role-selection.png`, `02-parent-home.png`, etc.

## Design System — Duolingo Style

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary Green | `#58CC02` | Headers, primary buttons, active tab |
| Dark Green | `#46A302` | Button bottom-shadow (3D depth) |
| Gold / Amber | `#FFC800` | Kid avatar bg, stars, "I'm a Kid" button |
| Dark Amber | `#CC9F00` | Gold button shadow |
| Star Yellow | `#F59E0B` | Star balance text |
| Red | `#FF4B4B` | Deduct buttons, punishment actions |
| Dark Red | `#CC3B3B` | Red button shadow |
| Purple | `#CE82FF` | Secondary kid avatar |
| Background | `#F7F7F7` | Page background (light gray) |
| Card Surface | `#FFFFFF` | Cards, modals |
| Text Primary | `#3C3C3C` | Headings, body text |
| Text Secondary | `#777777` | Labels, descriptions |
| Text Muted | `#9CA3AF` | Meta text, placeholders |
| Text Disabled | `#D1D5DB` | Hints, inactive |
| Border | `#E5E7EB` | Card borders, chip outlines |
| Card Shadow | `#E5E5E5` | Bottom shadow (no blur, 4px offset) |

### Typography

| Style | Font | Size | Weight |
|-------|------|------|--------|
| App Title | Nunito | 36px | 800 (ExtraBold) |
| Screen Title | Nunito | 22px | 800 |
| Section Header | Nunito | 18-20px | 800 |
| Kid Star Balance | Nunito | 72px | 900 (Black) |
| Body / Card Title | Nunito | 15px | 700 |
| Button Label | Nunito | 14-18px | 700-800 |
| Meta / Caption | Nunito | 12-13px | 500-600 |
| Tab Label | Nunito | 10px | 600-700, uppercase, 0.5 letter-spacing |

### Key Design Patterns

- **3D Buttons**: Solid bottom shadow (no blur) for Duolingo-style depth — green buttons get `#46A302` 3-4px offset, gold gets `#CC9F00`, red gets `#CC3B3B`
- **Corner Radius**: 20px for cards, 14-16px for buttons/chips, 12px for action rows, 22px for search bar (pill)
- **Card Shadows**: `offset(0, 4)`, no blur, `#E5E5E5` — flat shadow style
- **Icon Style**: Emoji-based icons for kid-facing UI; Lucide outlined icons for navigation and parent chrome
- **Color-coded Activity**: Green bg (`#F0FDF4`) for earn, yellow bg (`#FEF3C7`) for chores, red bg (`#FEE2E2`) for deductions, purple bg (`#EDE9FE`) for creativity
- **Bottom Tab Bar**: 82px height, Lucide icons (22px) + uppercase labels (10px), active state = `#58CC02`, inactive = `#AFAFAF`
- **Bottom Sheet**: 28px top corner radius, drag handle bar, ~85% screen height
- **Kid Tab Bar**: Emoji icons instead of Lucide for playful feel

### Interaction Notes

- Role selection buttons have chunky 3D press effect (bottom shadow disappears on press)
- Star stepper number is directly tappable for keyboard input (`inputMode="numeric"`)
- Event grid buttons highlight with green border when selected
- Confirm CTA dynamically shows kid name and star amount
- Kid dashboard star number should animate/bounce on change (confetti already in codebase)

### Parent Navigation (5 tabs)
1. Home (house icon) — Per-kid cards
2. Actions (zap icon) — Action catalog with Log
3. Rewards (gift icon) — Reward management
4. Approvals (circle-check icon) — Pending redemptions
5. More (menu icon) — Settings, badges, history

### Kid Navigation (3 tabs)
1. My Stars (star emoji) — Dashboard with balance
2. Badges (medal emoji) — Badge collection wall
3. Rewards (gift emoji) — Reward catalog with redeem
