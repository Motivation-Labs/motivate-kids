// Avatar decoration frames — CSS-based, no external assets needed.

export interface AvatarFrame {
  id: string
  label: string
  emoji: string
  unlockCost: number // 0 = free
}

export const AVATAR_FRAMES: AvatarFrame[] = [
  { id: 'none', label: 'None', emoji: '⚪', unlockCost: 0 },
  { id: 'stars', label: 'Stars', emoji: '⭐', unlockCost: 0 },
  { id: 'hearts', label: 'Hearts', emoji: '❤️', unlockCost: 50 },
  { id: 'flowers', label: 'Flowers', emoji: '🌸', unlockCost: 75 },
  { id: 'crown', label: 'Crown', emoji: '👑', unlockCost: 100 },
  { id: 'rainbow', label: 'Rainbow', emoji: '🌈', unlockCost: 150 },
  { id: 'lightning', label: 'Lightning', emoji: '⚡', unlockCost: 200 },
]

/** Compute lifetime earned stars (not current balance — redeeming doesn't reduce this) */
export function getLifetimeEarned(
  kidId: string,
  transactions: { kidId: string; type: string; amount: number; status: string }[],
): number {
  return transactions.reduce((sum, tx) => {
    if (tx.kidId !== kidId || tx.status !== 'approved') return sum
    if (tx.type === 'earn') return sum + tx.amount
    return sum
  }, 0)
}

/** Check if a frame is unlocked for a given kid */
export function isFrameUnlocked(frameId: string, lifetimeStars: number): boolean {
  const frame = AVATAR_FRAMES.find(f => f.id === frameId)
  if (!frame) return false
  return lifetimeStars >= frame.unlockCost
}

/** Get the CSS classes/styles for a frame */
export function getFrameStyle(frameId: string | undefined): {
  className: string
  overlayEmoji?: string
  overlayPosition?: 'top' | 'ring'
} {
  switch (frameId) {
    case 'stars':
      return { className: 'ring-2 ring-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]', overlayEmoji: undefined }
    case 'hearts':
      return { className: 'ring-2 ring-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.4)]', overlayEmoji: undefined }
    case 'flowers':
      return { className: 'ring-2 ring-pink-300 shadow-[0_0_8px_rgba(249,168,212,0.4)]', overlayEmoji: '🌸', overlayPosition: 'ring' }
    case 'crown':
      return { className: 'ring-2 ring-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]', overlayEmoji: '👑', overlayPosition: 'top' }
    case 'rainbow':
      return { className: 'rainbow-ring', overlayEmoji: undefined }
    case 'lightning':
      return { className: 'ring-2 ring-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]', overlayEmoji: '⚡', overlayPosition: 'ring' }
    default:
      return { className: '' }
  }
}
