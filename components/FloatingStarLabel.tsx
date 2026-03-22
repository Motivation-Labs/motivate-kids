'use client'

import { useEffect, useState } from 'react'

interface FloatingStarLabelProps {
  amount: number
  type: 'earn' | 'deduct' | 'redeem'
  /** Unique key to re-trigger animation */
  trigger: number
}

/**
 * Floating "+X ⭐" or "−X ⭐" label that animates up/down and fades out.
 * Renders nothing when not triggered.
 */
export function FloatingStarLabel({ amount, type, trigger }: FloatingStarLabelProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (trigger === 0) return
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 1000)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!visible) return null

  const isEarn = type === 'earn'
  const text = isEarn ? `+${amount} ⭐` : `−${amount} ⭐`
  const color = isEarn ? 'text-green-500' : type === 'redeem' ? 'text-emerald-500' : 'text-red-400'
  const animClass = isEarn ? 'animate-float-up' : 'animate-float-down'

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10`}>
      <span className={`text-xl font-black ${color} ${animClass}`}>
        {text}
      </span>
    </div>
  )
}
