import { clsx } from 'clsx'
import type { SoundId } from '../../types'

const SOUNDS: { id: NonNullable<SoundId>; icon: string; label: string }[] = [
  { id: 'rain',  icon: '🌧', label: 'Rain'  },
  { id: 'cafe',  icon: '☕', label: 'Café'  },
  { id: 'space', icon: '🌌', label: 'Space' },
  { id: 'white', icon: '〰', label: 'White' },
  { id: 'fire',  icon: '🔥', label: 'Fire'  },
]

interface Props {
  active: SoundId
  muted: boolean
  onToggle: (id: SoundId) => void
  onToggleMute: () => void
}

export function SoundPanel({ active, muted, onToggle, onToggleMute }: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap justify-center p-3 bg-[#0a0f1e] border border-[#1e293b] rounded-xl">
      {SOUNDS.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => onToggle(active === id ? null : id)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-200 font-dm',
            active === id
              ? 'border-[var(--c4)] text-[var(--c4)] bg-[var(--c4)]/10'
              : 'border-[#1e293b] text-slate-400 hover:border-[var(--c4)]/50 hover:text-slate-300'
          )}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
      <button
        onClick={onToggleMute}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-200 font-dm',
          muted
            ? 'border-red-500/40 text-red-400'
            : 'border-[#1e293b] text-slate-400 hover:border-slate-500'
        )}
      >
        {muted ? '🔇' : '🔊'} {muted ? 'Muted' : 'Sound'}
      </button>
    </div>
  )
}
