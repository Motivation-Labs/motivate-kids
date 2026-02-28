'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFamily } from '@/context/FamilyContext'
import type { Kid, Transaction } from '@/types'

const AVATARS = ['🐻', '🐼', '🦊', '🐸', '🦁', '🐯', '🐨', '🐹', '🐰', '🦋']
const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316']
const EMPTY_KID = { name: '', avatar: AVATARS[0], colorAccent: COLORS[0] }

function formatTimestamp(ts: string): string {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return timeStr
  if (diffDays === 1) return `Yesterday ${timeStr}`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ` ${timeStr}`
}

export default function ParentDashboard() {
  const router = useRouter()
  const { store, hydrated, getBalance, getKidBadges, addKid, updateKid, removeKid,
          logCompletion, redeemReward, getTransactions } = useFamily()

  const [selectedKidId, setSelectedKidId] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [showKidForm, setShowKidForm] = useState(false)
  const [editingKid, setEditingKid] = useState<Kid | null>(null)
  const [kidDraft, setKidDraft] = useState(EMPTY_KID)
  const [confirmReward, setConfirmReward] = useState<string | null>(null)
  const [showAllActivity, setShowAllActivity] = useState(false)

  useEffect(() => {
    if (hydrated && !store.family) router.replace('/')
  }, [hydrated, store.family, router])

  // Default to first kid when data loads
  useEffect(() => {
    if (hydrated && store.kids.length > 0 && !selectedKidId) {
      setSelectedKidId(store.kids[0].id)
    }
  }, [hydrated, store.kids, selectedKidId])

  if (!hydrated || !store.family) return null

  const selectedKid = store.kids.find(k => k.id === selectedKidId) ?? store.kids[0] ?? null

  function showFlash(msg: string) {
    setFlash(msg)
    setTimeout(() => setFlash(null), 2500)
  }

  function openNewKid() {
    setEditingKid(null)
    setKidDraft(EMPTY_KID)
    setShowKidForm(true)
  }

  function openEditKid(kid: Kid) {
    setEditingKid(kid)
    setKidDraft({ name: kid.name, avatar: kid.avatar, colorAccent: kid.colorAccent })
    setShowKidForm(true)
  }

  function handleSaveKid() {
    if (!kidDraft.name.trim()) return
    if (editingKid) {
      updateKid({ ...editingKid, ...kidDraft })
    } else {
      addKid(kidDraft)
    }
    setShowKidForm(false)
  }

  function handleLogAction(actionId: string) {
    if (!selectedKid) return
    const action = store.actions.find(a => a.id === actionId)
    if (!action) return
    logCompletion(selectedKid.id, actionId)
    const verb = action.isDeduction ? `−${action.pointsValue}⭐` : `+${action.pointsValue}⭐`
    showFlash(`${verb} ${action.name}`)
  }

  function handleRedeemConfirm(rewardId: string) {
    if (!selectedKid) return
    const reward = store.rewards.find(r => r.id === rewardId)
    if (!reward) return
    redeemReward(selectedKid.id, rewardId)
    setConfirmReward(null)
    showFlash(`🎁 Redeemed: ${reward.name}!`)
  }

  function getCategoryEmoji(actionId: string): string {
    const action = store.actions.find(a => a.id === actionId)
    if (!action) return '✅'
    return store.categories.find(c => c.id === action.categoryId)?.icon ?? '✅'
  }

  function getTxLabel(tx: Transaction): string {
    if (tx.type === 'earn' || tx.type === 'deduct') {
      const action = tx.actionId ? store.actions.find(a => a.id === tx.actionId) : null
      if (action) return action.name
      return tx.reason ?? tx.note ?? (tx.type === 'earn' ? 'Bonus stars' : 'Deduction')
    }
    const reward = tx.rewardId ? store.rewards.find(r => r.id === tx.rewardId) : null
    return reward ? `Redeemed: ${reward.name}` : (tx.note ?? 'Redemption')
  }

  const balance = selectedKid ? getBalance(selectedKid.id) : 0
  const badges = selectedKid ? getKidBadges(selectedKid.id) : []
  const activeActions = store.actions.filter(a => a.isActive)
  const activeRewards = store.rewards.filter(r => r.isActive).sort((a, b) => a.pointsCost - b.pointsCost)
  const allTxs: Transaction[] = selectedKid ? getTransactions(selectedKid.id) : []
  const visibleTxs = showAllActivity ? allTxs : allTxs.slice(0, 8)
  const confirmingReward = confirmReward ? store.rewards.find(r => r.id === confirmReward) : null

  return (
    <main className="max-w-lg mx-auto">
      {flash && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white font-bold rounded-2xl px-5 py-3 shadow-lg text-sm whitespace-nowrap">
          {flash}
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <p className="text-xs text-amber-500 font-medium uppercase tracking-wide">Family</p>
          <h1 className="text-xl font-black text-amber-900">{store.family.name}</h1>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-xs text-amber-400 hover:text-amber-600 transition-colors"
        >
          Switch role
        </button>
      </header>

      {store.kids.length === 0 ? (
        /* ── Empty state ── */
        <div className="text-center py-20 px-5">
          <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <p className="text-amber-700 font-medium text-lg mb-2">No kids yet</p>
          <p className="text-amber-500 text-sm mb-6">Add your first kid to get started</p>
          <button
            onClick={openNewKid}
            className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors"
          >
            Add a kid
          </button>
        </div>
      ) : (
        <>
          {/* ── Avatar switcher row ── */}
          <div className="px-4 pb-3">
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {store.kids.map(kid => {
                const isSelected = kid.id === selectedKid?.id
                return (
                  <div key={kid.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedKidId(kid.id)
                        setShowAllActivity(false)
                      }}
                      className={`relative w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                        isSelected ? 'scale-110' : 'bg-white hover:scale-105'
                      }`}
                      style={isSelected
                        ? { backgroundColor: `${kid.colorAccent}20`, outline: `4px solid ${kid.colorAccent}` }
                        : { backgroundColor: '#fff', outline: '2px solid #fef3c7' }}
                    >
                      {kid.avatar}
                    </button>
                    <span className={`text-xs font-bold max-w-[56px] truncate text-center ${isSelected ? 'text-amber-900' : 'text-amber-400'}`}>
                      {kid.name}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditKid(kid)}
                        className="text-amber-300 hover:text-amber-500 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${kid.name}? Their history will remain.`)) {
                            removeKid(kid.id)
                            if (selectedKidId === kid.id) setSelectedKidId(null)
                          }
                        }}
                        className="text-red-200 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
              {/* Add kid button */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <button
                  onClick={openNewKid}
                  className="w-14 h-14 rounded-full bg-amber-50 border-2 border-dashed border-amber-200 flex items-center justify-center text-amber-400 hover:border-amber-400 hover:text-amber-600 transition-colors text-2xl"
                >
                  +
                </button>
                <span className="text-xs text-amber-300">Add</span>
                <div className="h-4" />
              </div>
            </div>
          </div>

          {selectedKid && (
            <div className="px-5 flex flex-col gap-5 pb-6">
              {/* ── Balance card ── */}
              <div
                className="bg-white rounded-3xl shadow-sm p-5 flex items-center gap-4"
                style={{ borderLeft: `4px solid ${selectedKid.colorAccent}` }}
              >
                <div className="flex-1">
                  <p className="text-amber-500 text-xs font-semibold uppercase tracking-wide mb-0.5">Stars balance</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-amber-900">{balance}</span>
                    <span className="text-3xl">⭐</span>
                  </div>
                </div>
                {badges.length > 0 && (
                  <div className="text-center">
                    <p className="text-amber-400 text-xs mb-1">Badges</p>
                    <p className="text-2xl font-black text-amber-700">🏅 {badges.length}</p>
                  </div>
                )}
              </div>

              {/* ── Log an action ── */}
              <section>
                <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">Log an action</h2>
                {activeActions.length === 0 ? (
                  <div className="bg-white rounded-2xl p-4 text-center text-amber-400 text-sm">
                    No active actions.{' '}
                    <button onClick={() => router.push('/parent/actions')} className="underline">Add some</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {activeActions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => handleLogAction(action.id)}
                        className={`rounded-2xl p-3.5 shadow-sm flex items-center gap-3 text-left active:scale-95 transition-all border-2 border-transparent ${
                          action.isDeduction
                            ? 'bg-red-50 hover:bg-red-100 hover:border-red-200'
                            : 'bg-white hover:bg-amber-50 hover:border-amber-200'
                        }`}
                      >
                        <span className="text-xl w-8 text-center flex-shrink-0">{getCategoryEmoji(action.id)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm ${action.isDeduction ? 'text-red-700' : 'text-amber-900'}`}>{action.name}</p>
                          {action.description && (
                            <p className="text-amber-400 text-xs truncate">{action.description}</p>
                          )}
                        </div>
                        <span className={`font-black text-sm flex-shrink-0 ${action.isDeduction ? 'text-red-500' : 'text-amber-500'}`}>
                          {action.isDeduction ? '−' : '+'}{action.pointsValue}⭐
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {/* ── Redeem a reward ── */}
              <section>
                <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">Redeem a reward</h2>
                {activeRewards.length === 0 ? (
                  <div className="bg-white rounded-2xl p-4 text-center text-amber-400 text-sm">
                    No rewards yet.{' '}
                    <button onClick={() => router.push('/parent/rewards')} className="underline">Add some</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {activeRewards.map(reward => {
                      const canAfford = balance >= reward.pointsCost
                      return (
                        <button
                          key={reward.id}
                          onClick={() => canAfford && setConfirmReward(reward.id)}
                          disabled={!canAfford}
                          className={`bg-white rounded-2xl p-3.5 shadow-sm flex items-center gap-3 text-left transition-all border-2 ${
                            canAfford
                              ? 'border-amber-200 hover:bg-amber-50 hover:border-amber-400 active:scale-95'
                              : 'border-transparent opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <span className="text-xl flex-shrink-0">🎁</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-amber-900 text-sm">{reward.name}</p>
                            {reward.description && (
                              <p className="text-amber-400 text-xs truncate">{reward.description}</p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-black text-amber-500 text-sm">{reward.pointsCost}⭐</p>
                            {!canAfford && (
                              <p className="text-amber-300 text-xs">−{reward.pointsCost - balance} more</p>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* ── Recent activity ── */}
              <section>
                <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">Recent activity</h2>
                {allTxs.length === 0 ? (
                  <div className="bg-white rounded-2xl p-4 text-center text-amber-400 text-sm">
                    No activity yet — log an action above!
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      {visibleTxs.map((tx, i) => (
                        <div
                          key={tx.id}
                          className={`flex items-center gap-3 px-4 py-3 ${i < visibleTxs.length - 1 ? 'border-b border-amber-50' : ''}`}
                        >
                          <span className="text-lg flex-shrink-0">
                            {tx.type === 'redeem' ? '🎁' : (tx.actionId ? getCategoryEmoji(tx.actionId) : '⭐')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-amber-900 text-sm truncate">{getTxLabel(tx)}</p>
                            <p className="text-amber-400 text-xs">{formatTimestamp(tx.timestamp)}</p>
                          </div>
                          <span className={`font-bold text-sm flex-shrink-0 ${tx.type === 'earn' ? 'text-green-500' : 'text-red-400'}`}>
                            {tx.type === 'earn' ? '+' : '−'}{tx.amount} ⭐
                          </span>
                        </div>
                      ))}
                    </div>
                    {allTxs.length > 8 && (
                      <button
                        onClick={() => setShowAllActivity(v => !v)}
                        className="w-full mt-2 py-2 text-amber-500 text-sm hover:text-amber-700 transition-colors"
                      >
                        {showAllActivity ? 'Show less' : `Show all ${allTxs.length} entries`}
                      </button>
                    )}
                  </>
                )}
              </section>
            </div>
          )}
        </>
      )}

      {/* ── Add / Edit kid modal ── */}
      {showKidForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowKidForm(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-amber-900">{editingKid ? 'Edit kid' : 'Add a kid'}</h2>
            <div className="text-center text-5xl">{kidDraft.avatar}</div>
            <input
              autoFocus
              placeholder="Kid's name"
              value={kidDraft.name}
              onChange={e => setKidDraft(d => ({ ...d, name: e.target.value }))}
              className="rounded-xl border-2 border-amber-200 px-3 py-2 text-amber-900 outline-none focus:border-amber-400"
            />
            <div>
              <p className="text-sm font-medium text-amber-700 mb-2">Avatar</p>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map(a => (
                  <button
                    key={a}
                    onClick={() => setKidDraft(d => ({ ...d, avatar: a }))}
                    className={`text-2xl p-2 rounded-xl transition-all ${kidDraft.avatar === a ? 'bg-amber-200 scale-110' : 'bg-amber-50 hover:bg-amber-100'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-700 mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setKidDraft(d => ({ ...d, colorAccent: c }))}
                    className={`w-8 h-8 rounded-full transition-transform ${kidDraft.colorAccent === c ? 'scale-125 ring-2 ring-offset-2 ring-amber-400' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleSaveKid}
              disabled={!kidDraft.name.trim()}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold transition-colors"
            >
              {editingKid ? 'Save changes' : 'Add kid'}
            </button>
          </div>
        </div>
      )}

      {/* ── Redeem confirm modal ── */}
      {confirmingReward && selectedKid && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setConfirmReward(null)}>
          <div className="bg-white w-full rounded-t-3xl p-6 flex flex-col gap-4 max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-5xl mb-2">🎁</div>
              <h2 className="text-xl font-bold text-amber-900">Redeem for {selectedKid.name}?</h2>
              <p className="text-amber-600 mt-1 font-medium">{confirmingReward.name}</p>
              <p className="text-amber-500 text-sm mt-1">
                Costs {confirmingReward.pointsCost}⭐ · Balance after: {balance - confirmingReward.pointsCost}⭐
              </p>
            </div>
            <button
              onClick={() => handleRedeemConfirm(confirmingReward.id)}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-colors"
            >
              Confirm redemption
            </button>
            <button onClick={() => setConfirmReward(null)} className="text-center text-amber-400 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
