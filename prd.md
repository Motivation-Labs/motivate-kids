# Kids Rewards Manager — Product Requirements Document

## Overview

A simple, customizable family web app that helps parents motivate kids by
tracking and rewarding their actions, achievements, and outputs through points
and badges.

## Problem

Parents struggle to consistently recognize and reinforce positive behavior.
Existing apps are overly complex, poorly customizable, or don't support
multiple caregivers managing the same children.

## Goals

- Give parents a frictionless way to define custom actions worth rewarding
- Let kids earn points and unlock badges as they complete those actions
- Allow kids to redeem points for pre-defined rewards
- Support multiple kids per family
- Keep everything customizable — categories, point values, badges, rewards

## Non-Goals (v1)

- Native mobile app (planned for v3)
- Server-side backend or multi-device sync (planned for v2)
- Multi-parent / multi-device support (planned for v2)
- Social / sharing features
- AI-generated suggestions (planned for v3)
- Recurring actions / streaks (planned for v2)
- Data backup / export (planned for v2)

---

## Users

| Role | Description |
|------|-------------|
| Parent / Guardian | Creates and manages actions, approves reward redemptions, defines rewards |
| Kid | Views their own dashboard, requests reward redemptions |

**Auth model (v1):** Trust-based — no PIN, no accounts. On load, the user
picks a role ("I'm a parent" or "I'm a kid → pick your name"). The session
remembers the role until the user explicitly switches. No access control is
enforced in v1; the separation is a UI convention only.

Multi-parent support (inviting a second caregiver) is out of scope for v1
because there is no backend to sync data across devices. It will arrive in v2
with Supabase.

---

## Target Audience

Primary users of the **kid-facing UI** are children aged **4–8**. The UI must
therefore use:
- Minimal text; icons and imagery carry meaning
- Large tap targets
- Bright, high-saturation accent colors on a warm/light background
- A single prominent metric (point balance) rather than dense dashboards

Parents are the primary users of the management UI. They are comfortable with
standard web-app conventions.

---

## Visual Design Direction

Inspired by **Duolingo / Khan Academy Kids**:
- Rounded, friendly fonts (e.g., Nunito or Fredoka One for headings)
- Warm cream/off-white background; amber and soft-green primary palette
- High-saturation accent colors for interactive elements
- Playful micro-interactions and subtle animations
- Illustrated or emoji-based avatars and badges — no photo uploads

---

## Core Features — MVP

### 1. First Launch & Onboarding

**First launch (no family data exists):**
- Branded landing page: app name, tagline, warm illustration
- Single CTA: "Set up your family →"
- Leads into the setup wizard

**Setup wizard (guided but skippable):**
1. Family name
2. Add first kid (name + avatar)
3. Add first action (name + points value)
4. Done — arrive at parent dashboard
- Each step has a "Skip for now" link; missing items surface as contextual
  prompts inside the app

### 2. Role Selection Screen

Shown on every fresh load (no persisted session) or when user taps "Switch role":

- "I'm a parent" → parent dashboard
- "I'm a kid" → name picker → kid dashboard
- No PIN or password in v1 (trust-based)

### 3. Kid Profiles

- Add multiple kids with name, emoji avatar, and color accent
- Each kid has an independent points balance and badge collection
- Parents can view per-kid activity history

### 4. Actions Catalog

- Parents define custom actions (e.g., "Clean your room", "Read for 20 min")
- Each action includes: name, description, category, points value (1–10 scale),
  optional badge award
- Built-in categories: Chores, Academics, Behavior, Health, Creativity
- Starter templates for common actions (can be customized or deleted)
- Actions can be active or archived
- The same action can be logged multiple times per day (no daily limit)
- No recurring/scheduled actions in v1

### 5. Logging Action Completions (Parent)

Parent can log a completion from **three entry points**:
1. **Floating action button (FAB)** — visible on every screen; opens a modal:
   pick kid → pick action → confirm
2. **Kid profile page** — action list specific to that kid; tap to log
3. **Parent dashboard** — quick-action shortcuts per kid card

Only parents can mark actions as complete. Kids have no self-report flow in v1.

### 6. Points System

- Small-number economy: actions award **1–10 points** each
- Rewards cost **~20–50 points** (configurable per reward)
- Parents can award manual bonus points with a note
- Points history visible to both parents and the kid
- No expiry, no streak multipliers in v1

### 7. Badges

- Parents create badges (emoji icon + name + description)
- Badge triggers: manual award only in v1 (automatic milestones in v2)
- Kids see their badge collection on their dashboard
- Badges are purely visual / honorary — no points value

### 8. Reward Redemption

**Kid flow:**
1. Kid browses reward catalog — all rewards shown; unaffordable ones are greyed
   out with points needed displayed
2. Kid taps an affordable reward → confirmation dialog ("Spend X ⭐ on [Reward]?")
3. Kid confirms → success screen: "Request sent! Ask Mom/Dad to approve 🎉"
4. Points are **not deducted yet** — held pending parent approval

**Parent flow:**
- Badge count on the Approvals nav item shows pending requests
- Parent opens `/parent/approvals`, sees pending requests per kid
- Parent approves → points deducted, kid notified next time they open app
- Parent denies → request dismissed, points unchanged

### 9. Dashboards

**Parent dashboard (`/parent`):**
- Summary card per kid: points balance, recent badge, pending redemption count
- Activity feed: recent completions and pending approvals
- Quick-action shortcuts (log completion per kid)
- FAB for fast action logging

**Kid dashboard (`/kids/[id]`):**
- Kid's name + avatar (large, prominent)
- Points balance: giant bold number + ⭐ icon (easy for young kids to read)
- Badge wall: emoji grid of earned badges
- Rewards section: full catalog, unaffordable items greyed out
- Minimal text; icons and visuals carry the UI

---

## Customization

| Area | What's Customizable |
|------|---------------------|
| Actions | Name, description, category, point value, linked badge |
| Badges | Name, emoji icon, description |
| Rewards | Name, description, points cost, active/inactive |
| Kid profiles | Name, emoji avatar, color accent |
| Categories | Add/rename/remove action categories |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui (Radix UI primitives + Tailwind) |
| State / persistence | React Context + localStorage |
| Auth | None (trust-based role selection in v1) |
| Deployment | Vercel |

---

## Data Model (v1 — localStorage)

```
Family       { id, name, createdAt }
Kid          { id, familyId, name, avatar, colorAccent, createdAt }
Category     { id, familyId, name, icon }
Action       { id, familyId, name, description, categoryId, pointsValue,
               badgeId?, isTemplate, isActive }
Badge        { id, familyId, name, icon, description }
Reward       { id, familyId, name, description, pointsCost, isActive }
Transaction  { id, kidId, type ('earn' | 'redeem'), amount, actionId?,
               rewardId?, status ('approved' | 'pending' | 'denied'),
               timestamp, note? }
KidBadge     { kidId, badgeId, awardedAt }
```

Notes:
- No `Parent` entity in v1 (trust-based, no accounts)
- No `joinCode` or multi-parent fields
- `Transaction.status` for earn transactions is always `approved`; for redeem
  transactions it starts `pending` and transitions to `approved` or `denied`

---

## Pages & Routing

```
/                       Role selection screen (or redirect if session active)
/setup                  Family onboarding wizard
/parent                 Parent dashboard (all kids overview)
/parent/actions         Manage actions catalog
/parent/rewards         Manage reward catalog
/parent/badges          Manage badges
/parent/kids            Manage kid profiles
/parent/approvals       Pending redemption requests  [badge count shown in nav]
/kids/[id]              Kid's personal dashboard
```

---

## Navigation

**Bottom tab bar** (mobile-first, shown on all app screens after setup):

- **Parent tabs:** Home | Kids | Actions | Approvals | More
- **Kid tabs:** My Stars | Badges | Rewards

The FAB (floating action button for logging completions) floats above the tab
bar on all parent screens.

Role switching is accessible from the "More" tab or from the home/role-select
screen.

---

## MVP Success Criteria

- [ ] First-launch landing page leads cleanly into setup wizard
- [ ] Parents can create a family and add 2+ kids
- [ ] Parents can define 5+ custom actions across categories
- [ ] Parent can log a completion via FAB, kid profile, and dashboard (all 3 paths)
- [ ] Kids can view their ⭐ balance and badge wall
- [ ] Reward catalog shows all rewards; unaffordable ones greyed out
- [ ] Redemption request → parent approval → points deducted works end-to-end
- [ ] Data persists across browser sessions (localStorage)
- [ ] App is fully usable on a 375px-wide mobile browser (PWA-ready layout)

---

## Roadmap

| Version | Focus |
|---------|-------|
| v1 (current) | Web PWA, localStorage, trust-based auth, core reward loop |
| v2 | Backend (Supabase), multi-device sync, multi-parent, recurring actions, push notifications, data export |
| v3 | Native iOS + Android app, AI-suggested actions, streaks, streak multipliers |

---

## Evaluation Log & Optimization Notes

### Round 1 — Self-evaluation (Feb 2026)

#### Bugs Fixed

**[Bug] Hydration race condition — error page on kid tap**
- **Root cause:** `FamilyContext` hydrates from localStorage asynchronously. On first render, `store` is empty (`DEFAULT_STORE`). Pages that check `if (!kid)` and redirect via `useEffect` would fire the redirect before the data was loaded, causing an error/blank page.
- **Fix:** Added `hydrated: boolean` to `FamilyContext`. All pages that guard on `kid`/`family` existence now wait for `hydrated` before redirecting. Pattern: `if (hydrated && !kid) router.replace(...)` and `if (!hydrated || !kid) return null`.
- **Affected pages:** `/parent`, `/parent/kids/[id]`, `/kids/[id]`, `/kids/[id]/badges`, `/kids/[id]/rewards`.

#### UX Improvements Applied

**[UX] Add kid is a rare action — demoted from primary to secondary**
- Adding a kid happens once per year at most for a conventional family. Previously, a prominent "+ Kid" button sat in the header of the Home page.
- **Fix:** Removed the header button. "+ Add another kid" is now a dashed outline button at the bottom of the kid list — visually quiet but discoverable. The first-run empty state retains a prominent CTA.

**[UX] Single-kid family: FAB should not ask "pick a kid"**
- When there is only one kid, the logging FAB's kid-picker step is pure friction.
- **Fix:** `LogActionFab` detects single-kid families. If only one kid exists, the kid is auto-selected and shown as a read-only header in the modal. The picker dropdown is hidden entirely. Multi-kid families still see the full picker (now rendered as tap-target buttons instead of a select).

**[UX] Actions tab lacked usage context**
- Actions are the core catalog parents build up over time, but there was no signal about which ones were actually being used.
- **Fix:** Added per-action completion count (e.g., `✓ 12×`) computed from the transaction log. Added sort bar: Default | Most used | Category | Stars ↓. Helps parents prune unused actions and surface favorites.

**[UX] Redemption flow was invisible**
- The Rewards tab managed the reward catalog but gave no hint that redemption happened elsewhere (kid's profile page). Users could not discover the redeem path.
- **Fix:** Added a persistent info banner at the top of the Rewards tab explaining *how* redemption works with a direct link to each kid's profile page. Reward cost input changed from a limited slider (5–100) to quick-pick chips + custom number input (matching actions).

**[UX] Rewards cost range was too narrow**
- Actions can now be worth up to 500 stars (for achievements), but rewards were capped at 100 stars via a slider. Inconsistency.
- **Fix:** Rewards now use quick-pick chips (10, 20, 30, 50, 75, 100) plus a custom number input — uncapped, consistent with the actions pattern.

#### Observations for Future Iterations (v1.x / v2)

- **Kid dashboard (/kids/[id]):** The recent activity feed only shows 5 entries and displays generic emoji (⭐/🎁). Enhance with category-specific icons and a "See all" link.
- **First launch UX:** After setup wizard completes, user lands on parent dashboard with no guidance about next steps. A one-time "tips" banner (log your first action → set up rewards → redeem) would reduce drop-off.
- **Action logging confirmation:** Currently shows a toast. For young kids watching over parent's shoulder, a more celebratory flash (animation, confetti) would reinforce the reward moment.
- **Empty Actions tab:** When no actions exist, the empty state should link directly to the setup wizard's action step rather than just saying "Add one!".
- **Navigation clarity:** "More" tab is a catch-all. As the app grows, Badges and History should graduate to their own tabs or be surfaced more prominently (e.g., per-kid badges visible on the kid card).
- **Redeem section on kid profile:** Label "Redeem a reward" is parent-centric but clear. Consider also showing the kid's recent redemption history inline so parents can track what was given.
- **Points economy calibration:** With actions supporting 1–500 stars and rewards supporting custom costs, families need guidance on balancing the economy. A setup nudge ("typical actions: 3–10 stars; typical rewards: 20–50 stars") would help first-time parents.
- **LogActionFab on kid detail page:** The FAB is redundant when already on a kid's page that has an inline action list. Consider hiding FAB on `/parent/kids/[id]` to reduce visual clutter.
