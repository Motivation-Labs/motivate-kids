/**
 * Full app screenshot tour — captures all key screens in mobile viewport.
 * Saves PNGs to tests/full-tests-v0.1/
 */

import { chromium, type Page } from '@playwright/test'
import * as path from 'path'

const BASE_URL = 'http://localhost:3000'
const OUT_DIR = path.join(process.cwd(), 'tests', 'full-tests-v0.1')

// Seed localStorage with a realistic family so every screen has content
const SEED_STORE = {
  family: { id: 'fam-1', name: 'Johnson Family', createdAt: '2026-01-01T00:00:00.000Z' },
  kids: [
    { id: 'kid-1', familyId: 'fam-1', name: 'Mia', avatar: 'preset:avatar-03', colorAccent: '#ec4899', createdAt: '2026-01-01T00:00:00.000Z', wishlist: ['rew-2'], avatarFrame: 'stars' },
    { id: 'kid-2', familyId: 'fam-1', name: 'Leo', avatar: 'preset:avatar-07', colorAccent: '#3b82f6', createdAt: '2026-01-01T00:00:00.000Z', wishlist: [], avatarFrame: 'crown' },
  ],
  categories: [
    { id: 'cat-1', familyId: 'fam-1', name: 'Chores', icon: '🧹' },
    { id: 'cat-2', familyId: 'fam-1', name: 'Academics', icon: '📚' },
    { id: 'cat-3', familyId: 'fam-1', name: 'Behavior', icon: '😊' },
  ],
  actions: [
    { id: 'act-1', familyId: 'fam-1', name: 'Clean your room', description: '', categoryId: 'cat-1', pointsValue: 5, isDeduction: false, isTemplate: false, isActive: true },
    { id: 'act-2', familyId: 'fam-1', name: 'Read for 20 min', description: '', categoryId: 'cat-2', pointsValue: 10, isDeduction: false, isTemplate: false, isActive: true },
    { id: 'act-3', familyId: 'fam-1', name: 'Help with dinner', description: '', categoryId: 'cat-1', pointsValue: 8, isDeduction: false, isTemplate: false, isActive: true },
    { id: 'act-4', familyId: 'fam-1', name: 'Homework done', description: '', categoryId: 'cat-2', pointsValue: 15, isDeduction: false, isTemplate: false, isActive: true },
    { id: 'act-5', familyId: 'fam-1', name: 'Bad behavior', description: '', categoryId: 'cat-3', pointsValue: 5, isDeduction: true, isTemplate: false, isActive: true },
  ],
  badges: [
    { id: 'bdg-1', familyId: 'fam-1', name: 'Super Star', icon: '⭐', description: 'First earn' },
    { id: 'bdg-2', familyId: 'fam-1', name: 'Bookworm', icon: '📚', description: 'Read 5 times' },
    { id: 'bdg-3', familyId: 'fam-1', name: 'Helper', icon: '🤝', description: 'Helped out' },
    { id: 'bdg-4', familyId: 'fam-1', name: 'Clean Freak', icon: '🧹', description: 'Cleaned room 5 times' },
  ],
  rewards: [
    { id: 'rew-1', familyId: 'fam-1', name: 'Ice cream trip', description: '', pointsCost: 30, isActive: true },
    { id: 'rew-2', familyId: 'fam-1', name: 'Movie night', description: 'Pick any movie!', pointsCost: 50, isActive: true },
    { id: 'rew-3', familyId: 'fam-1', name: 'Extra screen time', description: '30 extra minutes', pointsCost: 20, isActive: true },
    { id: 'rew-4', familyId: 'fam-1', name: 'New toy', description: '', pointsCost: 100, isActive: true },
  ],
  transactions: [
    { id: 'tx-1', kidId: 'kid-1', type: 'earn', amount: 5, actionId: 'act-1', status: 'approved', timestamp: '2026-03-22T08:00:00.000Z' },
    { id: 'tx-2', kidId: 'kid-1', type: 'earn', amount: 10, actionId: 'act-2', status: 'approved', timestamp: '2026-03-22T09:00:00.000Z' },
    { id: 'tx-3', kidId: 'kid-1', type: 'earn', amount: 8, actionId: 'act-3', status: 'approved', timestamp: '2026-03-21T14:00:00.000Z' },
    { id: 'tx-4', kidId: 'kid-1', type: 'earn', amount: 15, actionId: 'act-4', status: 'approved', timestamp: '2026-03-21T16:00:00.000Z' },
    { id: 'tx-5', kidId: 'kid-1', type: 'earn', amount: 5, actionId: 'act-1', status: 'approved', timestamp: '2026-03-20T10:00:00.000Z' },
    { id: 'tx-6', kidId: 'kid-1', type: 'deduct', amount: 5, actionId: 'act-5', status: 'approved', timestamp: '2026-03-20T15:00:00.000Z', reason: 'Did not listen' },
    { id: 'tx-7', kidId: 'kid-1', type: 'redeem', amount: 20, rewardId: 'rew-3', status: 'approved', timestamp: '2026-03-19T12:00:00.000Z' },
    // Leo transactions
    { id: 'tx-8', kidId: 'kid-2', type: 'earn', amount: 10, actionId: 'act-2', status: 'approved', timestamp: '2026-03-22T10:00:00.000Z' },
    { id: 'tx-9', kidId: 'kid-2', type: 'earn', amount: 15, actionId: 'act-4', status: 'approved', timestamp: '2026-03-21T11:00:00.000Z' },
    { id: 'tx-10', kidId: 'kid-2', type: 'earn', amount: 8, actionId: 'act-3', status: 'approved', timestamp: '2026-03-20T09:00:00.000Z' },
  ],
  kidBadges: [
    { kidId: 'kid-1', badgeId: 'bdg-1', awardedAt: '2026-03-20T10:00:00.000Z' },
    { kidId: 'kid-1', badgeId: 'bdg-2', awardedAt: '2026-03-21T16:00:00.000Z' },
    { kidId: 'kid-1', badgeId: 'bdg-3', awardedAt: '2026-03-21T14:00:00.000Z' },
    { kidId: 'kid-2', badgeId: 'bdg-1', awardedAt: '2026-03-20T09:00:00.000Z' },
    { kidId: 'kid-2', badgeId: 'bdg-4', awardedAt: '2026-03-21T11:00:00.000Z' },
  ],
}

const META = { guideDismissed: true, lastSeenVersion: '0.2.0', soundEnabled: true }

/** Inject localStorage seed before any page JS runs — avoids React overwriting it */
async function addSeedScript(ctx: import('@playwright/test').BrowserContext) {
  await ctx.addInitScript(({ store, meta }) => {
    localStorage.setItem('motivate_your_kids_v1', JSON.stringify(store))
    localStorage.setItem('motivate_your_kids_meta', JSON.stringify(meta))
  }, { store: SEED_STORE, meta: META })
}

async function seed(page: Page) {
  await page.evaluate(({ store, meta }) => {
    localStorage.setItem('motivate_your_kids_v1', JSON.stringify(store))
    localStorage.setItem('motivate_your_kids_meta', JSON.stringify(meta))
  }, { store: SEED_STORE, meta: META })
}

async function shot(page: Page, name: string) {
  await page.waitForTimeout(600)
  await page.screenshot({
    path: path.join(OUT_DIR, `${name}.png`),
    fullPage: false,
  })
  console.log(`✓ ${name}.png`)
}

async function main() {
  const browser = await chromium.launch({ headless: true })

  // ── Fresh context for role-selection (no data) ──────────────────────────
  const freshCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
  const freshPage = await freshCtx.newPage()
  await freshPage.goto(`${BASE_URL}/`)
  await freshPage.waitForLoadState('networkidle')
  await freshPage.waitForTimeout(600)
  await freshPage.screenshot({ path: path.join(OUT_DIR, '01-role-selection.png') })
  console.log('✓ 01-role-selection.png')
  await freshCtx.close()

  // ── Seeded context for all remaining screens ────────────────────────────
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },  // iPhone 14 Pro
    deviceScaleFactor: 2,
    colorScheme: 'light',
  })
  // Inject seed BEFORE any page JS runs — prevents saveStore(DEFAULT_STORE) from overwriting
  await addSeedScript(ctx)
  const page = await ctx.newPage()

  // ── 02 Parent Home ─────────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/parent`)
  await page.waitForLoadState('networkidle')
  await shot(page, '02-parent-home')

  // ── 03 Parent Home — Add Stars sheet (Mia) ─────────────────────────────────
  await page.goto(`${BASE_URL}/parent`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
  // Button text includes emoji — use text contains
  await page.locator('button', { hasText: 'Add Stars' }).first().click()
  await page.waitForTimeout(500)
  await shot(page, '03-add-stars-sheet')

  // ── 04 Add Stars — action selected ─────────────────────────────────────────
  const actionBtns = page.locator('button').filter({ hasText: 'Clean your room' })
  if (await actionBtns.count() > 0) await actionBtns.first().click()
  await page.waitForTimeout(300)
  await shot(page, '04-add-stars-action-selected')

  // ── 05 Parent Home — Deduct Stars sheet ────────────────────────────────────
  await page.goto(`${BASE_URL}/parent`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
  await page.locator('button', { hasText: 'Deduct Stars' }).first().click()
  await page.waitForTimeout(500)
  await shot(page, '05-deduct-stars-sheet')

  // ── 06 Parent Home — Redeem sheet ──────────────────────────────────────────
  await page.goto(`${BASE_URL}/parent`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
  await page.locator('button', { hasText: 'Redeem' }).first().click()
  await page.waitForTimeout(500)
  await shot(page, '06-redeem-sheet')

  // ── 07 Kid Dashboard — Mia ─────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/kids/kid-1`)
  await page.waitForLoadState('networkidle')
  await shot(page, '07-kid-dashboard-mia')

  // ── 08 Kid Dashboard — Leo ─────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/kids/kid-2`)
  await page.waitForLoadState('networkidle')
  await shot(page, '08-kid-dashboard-leo')

  // ── 09 Kid Rewards — Mia ───────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/kids/kid-1/rewards`)
  await page.waitForLoadState('networkidle')
  await shot(page, '09-kid-rewards-mia')

  // ── 10 Kid Badges — Mia ────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/kids/kid-1/badges`)
  await page.waitForLoadState('networkidle')
  await shot(page, '10-kid-badges-mia')

  // ── 11 Parent Actions ──────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/parent/actions`)
  await page.waitForLoadState('networkidle')
  await shot(page, '11-parent-actions')

  // ── 12 Parent Rewards Management ───────────────────────────────────────────
  await page.goto(`${BASE_URL}/parent/rewards`)
  await page.waitForLoadState('networkidle')
  await shot(page, '12-parent-rewards')

  // ── 13 Parent Kids Management ──────────────────────────────────────────────
  await page.goto(`${BASE_URL}/parent/kids`)
  await page.waitForLoadState('networkidle')
  await shot(page, '13-parent-kids')

  // ── 14 Kid Edit form with Frame Picker ─────────────────────────────────────
  await page.goto(`${BASE_URL}/parent/kids`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
  await page.locator('button', { hasText: 'Edit' }).first().click()
  await page.waitForTimeout(500)
  await shot(page, '14-kid-edit-frame-picker')

  // ── 15 Parent Approvals ────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/parent/approvals`)
  await page.waitForLoadState('networkidle')
  await shot(page, '15-parent-approvals')

  // ── 16 Parent History ──────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/parent/history`)
  await page.waitForLoadState('networkidle')
  await shot(page, '16-parent-history')

  // ── 17 Parent Settings ─────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/parent/settings`)
  await page.waitForLoadState('networkidle')
  await shot(page, '17-parent-settings')

  // ── 18 Parent More ─────────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/parent/more`)
  await page.waitForLoadState('networkidle')
  await shot(page, '18-parent-more')

  // ── 19 Setup wizard ────────────────────────────────────────────────────────
  const setupCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
  const setupPage = await setupCtx.newPage()
  await setupPage.goto(`${BASE_URL}/setup`)
  await setupPage.waitForLoadState('networkidle')
  await setupPage.waitForTimeout(400)
  await setupPage.screenshot({ path: path.join(OUT_DIR, '19-setup-wizard.png'), fullPage: false })
  console.log('✓ 19-setup-wizard.png')
  await setupCtx.close()

  // ── 20 Earn animation — trigger earn and capture flash ────────────────────
  await page.goto(`${BASE_URL}/parent`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
  await page.locator('button', { hasText: 'Add Stars' }).first().click()
  await page.waitForTimeout(400)
  // Select Read for 20 min action
  const actBtns = page.locator('button').filter({ hasText: 'Read for 20 min' })
  if (await actBtns.count() > 0) await actBtns.first().click()
  await page.waitForTimeout(200)
  // Hit confirm — text pattern "+N ⭐ → Name"
  const confirmBtns = page.locator('button').filter({ hasText: '→' })
  if (await confirmBtns.count() > 0) await confirmBtns.first().click()
  await page.waitForTimeout(500)
  await shot(page, '20-earn-animation-toast')

  await browser.close()

  console.log('\n✅ All screenshots saved to tests/full-tests-v0.1/')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
