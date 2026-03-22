/**
 * Full UX walkthrough — captures all key screens at iPhone 14 Pro viewport.
 * Saves PNGs to tests/full-walthrough-v0p1/
 *
 * Run: npx ts-node --esm tests/full-walkthrough-v0p1.ts
 * Requires: dev server on localhost:3001 with SKIP_AUTH_FOR_SCREENSHOTS=true
 */

import { chromium, type BrowserContext, type Page } from '@playwright/test'
import * as path from 'path'
import * as fs from 'fs'

const BASE_URL = 'http://localhost:3001'
const OUT_DIR = path.join(process.cwd(), 'tests', 'full-walthrough-v0p1')

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
    { id: 'act-1', familyId: 'fam-1', name: 'Clean your room', description: 'Keep it tidy!', categoryId: 'cat-1', pointsValue: 5, isDeduction: false, isTemplate: false, isActive: true },
    { id: 'act-2', familyId: 'fam-1', name: 'Read for 20 min', description: 'Any book counts', categoryId: 'cat-2', pointsValue: 10, isDeduction: false, isTemplate: false, isActive: true },
    { id: 'act-3', familyId: 'fam-1', name: 'Help with dinner', description: '', categoryId: 'cat-1', pointsValue: 8, isDeduction: false, isTemplate: false, isActive: true },
    { id: 'act-4', familyId: 'fam-1', name: 'Homework done', description: 'All assignments completed', categoryId: 'cat-2', pointsValue: 15, isDeduction: false, isTemplate: false, isActive: true },
    { id: 'act-5', familyId: 'fam-1', name: 'Talking back', description: '', categoryId: 'cat-3', pointsValue: 5, isDeduction: true, isTemplate: false, isActive: true },
    { id: 'act-6', familyId: 'fam-1', name: 'Brush teeth', description: 'Morning & night', categoryId: 'cat-3', pointsValue: 3, isDeduction: false, isTemplate: false, isActive: true },
  ],
  badges: [
    { id: 'bdg-1', familyId: 'fam-1', name: 'Super Star', icon: '⭐', description: 'First earn' },
    { id: 'bdg-2', familyId: 'fam-1', name: 'Bookworm', icon: '📚', description: 'Read 5 times' },
    { id: 'bdg-3', familyId: 'fam-1', name: 'Helper', icon: '🤝', description: 'Helped the family' },
    { id: 'bdg-4', familyId: 'fam-1', name: 'Clean Freak', icon: '🧹', description: 'Cleaned room 5 times' },
  ],
  rewards: [
    { id: 'rew-1', familyId: 'fam-1', name: 'Ice cream trip', description: 'Choose your flavour!', pointsCost: 30, isActive: true },
    { id: 'rew-2', familyId: 'fam-1', name: 'Movie night', description: 'Pick any movie!', pointsCost: 50, isActive: true },
    { id: 'rew-3', familyId: 'fam-1', name: 'Extra screen time', description: '30 extra minutes', pointsCost: 20, isActive: true },
    { id: 'rew-4', familyId: 'fam-1', name: 'New toy', description: 'Up to $15', pointsCost: 100, isActive: true },
  ],
  transactions: [
    { id: 'tx-1', kidId: 'kid-1', type: 'earn', amount: 5, actionId: 'act-1', status: 'approved', timestamp: '2026-03-22T08:00:00.000Z' },
    { id: 'tx-2', kidId: 'kid-1', type: 'earn', amount: 10, actionId: 'act-2', status: 'approved', timestamp: '2026-03-22T09:00:00.000Z' },
    { id: 'tx-3', kidId: 'kid-1', type: 'earn', amount: 8, actionId: 'act-3', status: 'approved', timestamp: '2026-03-21T14:00:00.000Z' },
    { id: 'tx-4', kidId: 'kid-1', type: 'earn', amount: 15, actionId: 'act-4', status: 'approved', timestamp: '2026-03-21T16:00:00.000Z' },
    { id: 'tx-5', kidId: 'kid-1', type: 'earn', amount: 5, actionId: 'act-1', status: 'approved', timestamp: '2026-03-20T10:00:00.000Z' },
    { id: 'tx-6', kidId: 'kid-1', type: 'deduct', amount: 5, actionId: 'act-5', status: 'approved', timestamp: '2026-03-20T15:00:00.000Z', reason: 'Was rude at dinner' },
    { id: 'tx-7', kidId: 'kid-1', type: 'redeem', amount: 20, rewardId: 'rew-3', status: 'approved', timestamp: '2026-03-19T12:00:00.000Z' },
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

async function seedCtx(ctx: BrowserContext) {
  await ctx.addInitScript(({ store, meta }) => {
    localStorage.setItem('motivate_your_kids_v1', JSON.stringify(store))
    localStorage.setItem('motivate_your_kids_meta', JSON.stringify(meta))
  }, { store: SEED_STORE, meta: META })
}

async function shot(page: Page, name: string) {
  await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`), fullPage: false })
  console.log(`  ✓ ${name}.png`)
}

async function goto(page: Page, url: string) {
  await page.goto(url)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(400)
}

async function newCtx(browser: import('@playwright/test').Browser, seed = true) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  })
  if (seed) await seedCtx(ctx)
  return ctx
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })

  // ── ONBOARDING / ENTRY ───────────────────────────────────────────────────
  console.log('\n── Onboarding')
  {
    const ctx = await newCtx(browser, false)
    const p = await ctx.newPage()

    await goto(p, `${BASE_URL}/`)
    await shot(p, '01-role-selection')

    await goto(p, `${BASE_URL}/setup`)
    await shot(p, '02-setup-wizard-step1')

    // Fill family name and proceed
    const nameInput = p.locator('input').first()
    if (await nameInput.count() > 0) {
      await nameInput.fill('Johnson Family')
      await p.waitForTimeout(300)
      await shot(p, '03-setup-wizard-name-filled')
      const nextBtn = p.locator('button').filter({ hasText: /next|continue/i }).first()
      if (await nextBtn.count() > 0) {
        await nextBtn.click()
        await p.waitForTimeout(500)
        await shot(p, '04-setup-wizard-step2')
      }
    }
    await ctx.close()
  }

  // ── PARENT HOME ──────────────────────────────────────────────────────────
  console.log('\n── Parent Home')
  {
    const ctx = await newCtx(browser)
    const p = await ctx.newPage()

    await goto(p, `${BASE_URL}/parent`)
    await shot(p, '05-parent-home')

    // Scroll down to see activity feed
    await p.evaluate(() => window.scrollBy(0, 300))
    await p.waitForTimeout(300)
    await shot(p, '06-parent-home-scrolled')

    // ── Add Stars sheet
    await goto(p, `${BASE_URL}/parent`)
    await p.locator('button', { hasText: 'Add Stars' }).first().click()
    await p.waitForTimeout(500)
    await shot(p, '07-add-stars-sheet')

    // Select an action
    await p.locator('button').filter({ hasText: 'Clean your room' }).first().click()
    await p.waitForTimeout(300)
    await shot(p, '08-add-stars-action-selected')

    // Confirm earn
    const confirmBtn = p.locator('button').filter({ hasText: '→' })
    if (await confirmBtn.count() > 0) {
      await confirmBtn.first().click()
      await p.waitForTimeout(600)
      await shot(p, '09-add-stars-confirmed-toast')
    }

    // ── Deduct Stars sheet
    await goto(p, `${BASE_URL}/parent`)
    await p.locator('button', { hasText: 'Deduct Stars' }).first().click()
    await p.waitForTimeout(500)
    await shot(p, '10-deduct-stars-sheet')

    // Select deduction action
    await p.locator('button').filter({ hasText: 'Talking back' }).first().click()
    await p.waitForTimeout(300)
    await shot(p, '11-deduct-stars-action-selected')

    // ── Redeem sheet
    await goto(p, `${BASE_URL}/parent`)
    await p.locator('button', { hasText: 'Redeem' }).first().click()
    await p.waitForTimeout(500)
    await shot(p, '12-redeem-sheet')

    // Select a reward
    const rewardBtn = p.locator('button').filter({ hasText: 'Extra screen time' })
    if (await rewardBtn.count() > 0) {
      await rewardBtn.first().click()
      await p.waitForTimeout(300)
      await shot(p, '13-redeem-reward-selected')
    }

    await ctx.close()
  }

  // ── KID DASHBOARDS ───────────────────────────────────────────────────────
  console.log('\n── Kid Dashboards')
  {
    const ctx = await newCtx(browser)
    const p = await ctx.newPage()

    await goto(p, `${BASE_URL}/kids/kid-1`)
    await shot(p, '14-kid-dashboard-mia')

    // Scroll to see activity list
    await p.evaluate(() => window.scrollBy(0, 350))
    await p.waitForTimeout(300)
    await shot(p, '15-kid-dashboard-mia-activity')

    await goto(p, `${BASE_URL}/kids/kid-2`)
    await shot(p, '16-kid-dashboard-leo')

    await ctx.close()
  }

  // ── KID REWARDS & BADGES ─────────────────────────────────────────────────
  console.log('\n── Kid Rewards & Badges')
  {
    const ctx = await newCtx(browser)
    const p = await ctx.newPage()

    await goto(p, `${BASE_URL}/kids/kid-1/rewards`)
    await shot(p, '17-kid-rewards-mia')

    await goto(p, `${BASE_URL}/kids/kid-2/rewards`)
    await shot(p, '18-kid-rewards-leo')

    await goto(p, `${BASE_URL}/kids/kid-1/badges`)
    await shot(p, '19-kid-badges-mia')

    await goto(p, `${BASE_URL}/kids/kid-2/badges`)
    await shot(p, '20-kid-badges-leo')

    await ctx.close()
  }

  // ── PARENT MANAGEMENT SCREENS ─────────────────────────────────────────────
  console.log('\n── Parent Management')
  {
    const ctx = await newCtx(browser)
    const p = await ctx.newPage()

    // Actions list
    await goto(p, `${BASE_URL}/parent/actions`)
    await shot(p, '21-parent-actions')

    // Add action form
    const addActionBtn = p.locator('button').filter({ hasText: /add action|new action|\+/i }).first()
    if (await addActionBtn.count() > 0) {
      await addActionBtn.click()
      await p.waitForTimeout(400)
      await shot(p, '22-parent-actions-add-form')
    }

    // Rewards management
    await goto(p, `${BASE_URL}/parent/rewards`)
    await shot(p, '23-parent-rewards')

    // Add reward form
    const addRewardBtn = p.locator('button').filter({ hasText: /add reward|new reward|\+/i }).first()
    if (await addRewardBtn.count() > 0) {
      await addRewardBtn.click()
      await p.waitForTimeout(400)
      await shot(p, '24-parent-rewards-add-form')
    }

    // Badges management
    await goto(p, `${BASE_URL}/parent/badges`)
    await shot(p, '25-parent-badges')

    await ctx.close()
  }

  // ── KIDS MANAGEMENT ──────────────────────────────────────────────────────
  console.log('\n── Kids Management')
  {
    const ctx = await newCtx(browser)
    const p = await ctx.newPage()

    await goto(p, `${BASE_URL}/parent/kids`)
    await shot(p, '26-parent-kids-list')

    // Edit Mia — shows avatar + frame picker
    await p.locator('button', { hasText: 'Edit' }).first().click()
    await p.waitForTimeout(500)
    await shot(p, '27-kid-edit-form-top')

    // Scroll down to see frame picker
    await p.evaluate(() => window.scrollBy(0, 400))
    await p.waitForTimeout(300)
    await shot(p, '28-kid-edit-frame-picker')

    // Add new kid form
    await goto(p, `${BASE_URL}/parent/kids`)
    const addKidBtn = p.locator('button').filter({ hasText: /add kid|new kid|\+/i }).first()
    if (await addKidBtn.count() > 0) {
      await addKidBtn.click()
      await p.waitForTimeout(400)
      await shot(p, '29-add-kid-form')
    }

    await ctx.close()
  }

  // ── HISTORY & APPROVALS ───────────────────────────────────────────────────
  console.log('\n── History & Approvals')
  {
    const ctx = await newCtx(browser)
    const p = await ctx.newPage()

    await goto(p, `${BASE_URL}/parent/history`)
    await shot(p, '30-parent-history')

    // Scroll history
    await p.evaluate(() => window.scrollBy(0, 300))
    await p.waitForTimeout(300)
    await shot(p, '31-parent-history-scrolled')

    await goto(p, `${BASE_URL}/parent/approvals`)
    await shot(p, '32-parent-approvals')

    await ctx.close()
  }

  // ── SETTINGS & MORE ───────────────────────────────────────────────────────
  console.log('\n── Settings & More')
  {
    const ctx = await newCtx(browser)
    const p = await ctx.newPage()

    await goto(p, `${BASE_URL}/parent/settings`)
    await shot(p, '33-parent-settings')

    await goto(p, `${BASE_URL}/parent/more`)
    await shot(p, '34-parent-more')

    await ctx.close()
  }

  await browser.close()

  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png'))
  console.log(`\n✅ ${files.length} screenshots saved to tests/full-walthrough-v0p1/`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
