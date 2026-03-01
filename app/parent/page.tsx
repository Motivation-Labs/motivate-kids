'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useFamily } from '@/context/FamilyContext'
import { GettingStarted } from '@/components/GettingStarted'
import { loadMeta, saveMeta } from '@/lib/meta'
import { APP_VERSION } from '@/lib/version'
import { fireStarConfetti } from '@/lib/confetti'
import { randomEarnPhrase, randomDeductPhrase } from '@/lib/messages'
import type { Transaction } from '@/types'

function timeLabel(ts: string): string {
  const d = new Date(ts)
  const diffMins = Math.floor((Date.now() - d.getTime()) / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function groupByDate(txs: Transaction[]): { label: string; txs: Transaction[] }[] {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  const map = new Map<number, Transaction[]>()
  txs.forEach(tx => {
    const d = new Date(tx.timestamp); d.setHours(0, 0, 0, 0)
    const k = d.getTime()
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(tx)
  })
  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([k, group]) => {
      const d = new Date(k)
      let label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      if (k === today.getTime()) label = 'Today'
      else if (k === yesterday.getTime()) label = 'Yesterday'
      return { label, txs: group }
    })
}

export default function ParentDashboard() {
  const router = useRouter()
  const { store, hydrated, getBalance, awardBonus, awardDeduction, removeTransaction } = useFamily()

  const [showGuide, setShowGuide] = useState(false)

  // Quick action sheet
  const [quickType, setQuickType] = useState<'earn' | 'deduct' | null>(null)
  const [quickKidId, setQuickKidId] = useState<string | null>(null)
  const [quickAmount, setQuickAmount] = useState(5)
  const [quickReason, setQuickReason] = useState('')
  const [flash, setFlash] = useState<string | null>(null)

  // Undo delete
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const pendingDeleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingDeleteTxRef = useRef<Transaction | null>(null)

  useEffect(() => {
    if (hydrated && !store.family) router.replace('/')
  }, [hydrated, store.family, router])

  // Version-gated guide: show on first visit or on a new deploy
  useEffect(() => {
    if (!hydrated || !store.family) return
    const meta = loadMeta()
    if (meta.lastSeenVersion !== APP_VERSION) {
      saveMeta({ lastSeenVersion: APP_VERSION, guideDismissed: false })
      setShowGuide(true)
    } else {
      setShowGuide(!meta.guideDismissed)
    }
  }, [hydrated, store.family])

  const handleDismissGuide = useCallback(() => {
    saveMeta({ guideDismissed: true })
    setShowGuide(false)
  }, [])

  const allTxs = useMemo(
    () => [...store.transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [store.transactions],
  )

  // Filter out visually-deleted transaction while undo is pending
  const displayedTxs = useMemo(
    () => allTxs.filter(t => t.id !== pendingDeleteId),
    [allTxs, pendingDeleteId],
  )

  const groups = useMemo(() => groupByDate(displayedTxs), [displayedTxs])

  if (!hydrated || !store.family) return null

  function showFlash(msg: string) {
    setFlash(msg)
    setTimeout(() => setFlash(null), 3000)
  }

  function getCategoryEmoji(actionId: string): string {
    const action = store.actions.find(a => a.id === actionId)
    if (!action) return '✅'
    return store.categories.find(c => c.id === action.categoryId)?.icon ?? '✅'
  }

  function getTxLabel(tx: Transaction): string {
    if (tx.type === 'earn' || tx.type === 'deduct') {
      const action = tx.actionId ? store.actions.find(a => a.id === tx.actionId) : null
      return action?.name ?? tx.reason ?? tx.note ?? (tx.type === 'earn' ? 'Bonus stars' : 'Deduction')
    }
    const reward = tx.rewardId ? store.rewards.find(r => r.id === tx.rewardId) : null
    return reward ? reward.name : (tx.note ?? 'Reward redeemed')
  }

  function openQuick(type: 'earn' | 'deduct') {
    setQuickType(type)
    setQuickAmount(5)
    setQuickReason('')
    setQuickKidId(store.kids.length === 1 ? store.kids[0].id : null)
  }

  function handleQuickConfirm() {
    if (!quickKidId || !quickType) return
    const kidName = store.kids.find(k => k.id === quickKidId)?.name ?? ''
    if (quickType === 'earn') {
      awardBonus(quickKidId, quickAmount, quickReason.trim() || 'Bonus stars')
      showFlash(`+${quickAmount}⭐ for ${kidName}! ${randomEarnPhrase()}`)
      fireStarConfetti()
    } else {
      awardDeduction(quickKidId, quickAmount, quickReason.trim() || undefined)
      showFlash(`−${quickAmount}⭐ for ${kidName}. ${randomDeductPhrase()}`)
    }
    setQuickType(null)
  }

  function handleDeleteTx(tx: Transaction) {
    // Commit any previous pending delete before starting a new one
    if (pendingDeleteTimer.current) {
      clearTimeout(pendingDeleteTimer.current)
      if (pendingDeleteTxRef.current) {
        removeTransaction(pendingDeleteTxRef.current.id)
      }
    }
    pendingDeleteTxRef.current = tx
    setPendingDeleteId(tx.id)
    pendingDeleteTimer.current = setTimeout(() => {
      removeTransaction(tx.id)
      setPendingDeleteId(null)
      pendingDeleteTxRef.current = null
      pendingDeleteTimer.current = null
    }, 60_000)
  }

  function handleUndoDelete() {
    if (pendingDeleteTimer.current) {
      clearTimeout(pendingDeleteTimer.current)
      pendingDeleteTimer.current = null
    }
    pendingDeleteTxRef.current = null
    setPendingDeleteId(null)
  }

  return (
    <main className="max-w-lg mx-auto">
      {/* Flash toast */}
      {flash && (
        <div className="fixed top-6 left-1/2 z-50 bg-amber-500 text-white font-bold rounded-2xl px-5 py-3 shadow-lg text-sm whitespace-nowrap animate-slide-down">
          {flash}
        </div>
      )}

      {/* Undo delete toast */}
      {pendingDeleteId && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg whitespace-nowrap">
          <span className="text-sm">Transaction deleted</span>
          <button
            onClick={handleUndoDelete}
            className="text-amber-400 font-bold text-sm underline"
          >
            Undo
          </button>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-5 pb-3">
        <div>
          <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest">Family</p>
          <h1 className="text-lg font-black text-amber-900 leading-tight">{store.family.name}</h1>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-xs text-amber-400 hover:text-amber-600 transition-colors"
        >
          Switch
        </button>
      </header>

      {store.kids.length === 0 ? (
        <div className="text-center py-20 px-5">
          <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
          <p className="text-amber-700 font-medium mb-1">No kids yet</p>
          <p className="text-amber-500 text-sm mb-5">Add your first child to get started.</p>
          <button
            onClick={() => router.push('/parent/kids')}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors text-sm"
          >
            Add a Kid
          </button>
        </div>
      ) : (
        <>
          {/* ── Kid balance chips ── */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
            {store.kids.map(kid => {
              const bal = getBalance(kid.id)
              return (
                <div
                  key={kid.id}
                  className="flex-shrink-0 bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm border-l-4"
                  style={{ borderColor: kid.colorAccent }}
                >
                  <span className="text-lg leading-none">{kid.avatar}</span>
                  <div>
                    <p className="text-xs font-bold text-amber-900 leading-none">{kid.name}</p>
                    <p className="text-xs text-amber-500 mt-0.5">{bal} ⭐</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Quick action buttons ── */}
          <div className="flex gap-3 px-4 mb-4">
            <button
              onClick={() => openQuick('earn')}
              className="flex-1 py-3 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-sm"
            >
              ⭐ Add Stars
            </button>
            <button
              onClick={() => openQuick('deduct')}
              className="flex-1 py-3 rounded-2xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors shadow-sm border border-red-200"
            >
              ⚠️ Deduct Stars
            </button>
          </div>

          {/* ── Getting started guide ── */}
          {showGuide && (
            <div className="px-4">
              <GettingStarted store={store} onDismiss={handleDismissGuide} />
            </div>
          )}

          {/* ── Activity feed ── */}
          <div className="px-4 pb-6">
            {displayedTxs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-amber-600 font-medium text-sm">No activity yet</p>
                <p className="text-amber-400 text-xs mt-1">Tap &ldquo;Add Stars&rdquo; above or log actions from the Actions tab.</p>
              </div>
            ) : (
              groups.map(group => (
                <div key={group.label} className="mb-4">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1.5 px-1">
                    {group.label}
                  </p>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {group.txs.map((tx, i) => {
                      const kid = store.kids.find(k => k.id === tx.kidId)
                      const isEarn = tx.type === 'earn'
                      const icon = tx.type === 'redeem' ? '🎁' : (tx.actionId ? getCategoryEmoji(tx.actionId) : '⭐')
                      return (
                        <div
                          key={tx.id}
                          className={`flex items-center gap-3 px-3 py-2.5 ${i < group.txs.length - 1 ? 'border-b border-amber-50' : ''}`}
                        >
                          <span className="text-base flex-shrink-0 w-6 text-center">{kid?.avatar ?? '👦'}</span>
                          <span className="text-base flex-shrink-0">{icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-amber-900 truncate">{getTxLabel(tx)}</p>
                            <p className="text-[10px] text-amber-400 leading-none mt-0.5">
                              {kid?.name} · {timeLabel(tx.timestamp)}
                            </p>
                          </div>
                          <span className={`text-sm font-bold flex-shrink-0 ${isEarn ? 'text-green-500' : 'text-red-400'}`}>
                            {isEarn ? '+' : '−'}{tx.amount}⭐
                          </span>
                          <button
                            onClick={() => handleDeleteTx(tx)}
                            className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 text-xs p-1 leading-none"
                            aria-label="Delete transaction"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ── Quick action bottom sheet ── */}
      {quickType && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setQuickType(null)}>
          <div className="bg-white w-full rounded-t-3xl p-6 flex flex-col gap-4 max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
            <div className={`text-center py-2 rounded-2xl ${quickType === 'earn' ? 'bg-amber-50' : 'bg-red-50'}`}>
              <h2 className={`text-xl font-bold ${quickType === 'earn' ? 'text-amber-900' : 'text-red-800'}`}>
                {quickType === 'earn' ? '⭐ Award Stars' : '⚠️ Deduct Stars'}
              </h2>
            </div>

            {/* Kid picker — multiple kids */}
            {store.kids.length > 1 && (
              <div>
                <p className="text-sm font-medium text-amber-700 mb-2 text-center">For which kid?</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  {store.kids.map(kid => {
                    const bal = getBalance(kid.id)
                    const chosen = kid.id === quickKidId
                    return (
                      <button
                        key={kid.id}
                        onClick={() => setQuickKidId(kid.id)}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border-2 transition-all ${
                          chosen ? 'border-amber-500 bg-amber-50' : 'border-amber-100 hover:border-amber-300'
                        }`}
                      >
                        <span className="text-2xl">{kid.avatar}</span>
                        <span className="text-xs font-bold text-amber-900">{kid.name}</span>
                        <span className="text-xs text-amber-400">{bal}⭐</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Single kid display */}
            {store.kids.length === 1 && (
              <div className="flex items-center justify-center gap-2 bg-amber-50 rounded-2xl py-3">
                <span className="text-2xl">{store.kids[0].avatar}</span>
                <span className="font-bold text-amber-900">{store.kids[0].name}</span>
              </div>
            )}

            {/* Amount stepper */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-amber-500 font-medium">
                Stars to {quickType === 'earn' ? 'award' : 'deduct'}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuickAmount(v => Math.max(1, v - 1))}
                  className="w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 font-black text-xl transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className={`text-4xl font-black w-16 text-center ${quickType === 'earn' ? 'text-amber-900' : 'text-red-600'}`}>
                  {quickAmount}
                </span>
                <button
                  onClick={() => setQuickAmount(v => v + 1)}
                  className="w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 font-black text-xl transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Reason */}
            <input
              placeholder="Reason (optional)"
              value={quickReason}
              onChange={e => setQuickReason(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              className="w-full rounded-xl border-2 border-amber-200 px-3 py-2 text-amber-900 outline-none focus:border-amber-400 text-sm"
            />

            <button
              onClick={handleQuickConfirm}
              disabled={!quickKidId}
              className={`w-full py-3 rounded-2xl disabled:opacity-40 text-white font-bold text-lg transition-colors ${
                quickType === 'earn' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {quickType === 'earn' ? `Award ${quickAmount} ⭐` : `Deduct ${quickAmount} ⭐`}
            </button>
            <button onClick={() => setQuickType(null)} className="text-center text-amber-400 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
