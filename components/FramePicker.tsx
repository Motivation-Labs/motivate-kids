'use client'

import { AVATAR_FRAMES, isFrameUnlocked } from '@/lib/frames'
import { AvatarDisplay } from './AvatarDisplay'

interface FramePickerProps {
  avatar: string
  value: string | undefined
  onChange: (frameId: string) => void
  lifetimeStars: number
}

export function FramePicker({ avatar, value, onChange, lifetimeStars }: FramePickerProps) {
  const current = value ?? 'none'

  return (
    <div>
      {/* Live preview */}
      <div className="flex justify-center mb-4">
        <AvatarDisplay avatar={avatar} size={80} frame={current === 'none' ? undefined : current} />
      </div>

      {/* Frame grid */}
      <div className="grid grid-cols-4 gap-2">
        {AVATAR_FRAMES.map(frame => {
          const unlocked = isFrameUnlocked(frame.id, lifetimeStars)
          const selected = current === frame.id

          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => unlocked && onChange(frame.id)}
              disabled={!unlocked}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                selected
                  ? 'bg-brand-light ring-2 ring-brand'
                  : unlocked
                    ? 'bg-page hover:bg-brand-light'
                    : 'bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-xl">{frame.emoji}</span>
              <span className="text-[10px] font-bold text-ink-secondary leading-tight">
                {frame.label}
              </span>
              {!unlocked && (
                <span className="text-[9px] text-ink-muted">🔒 {frame.unlockCost}⭐</span>
              )}
              {selected && unlocked && (
                <span className="text-[9px] text-brand font-bold">✓</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
