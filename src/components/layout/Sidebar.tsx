import { clsx } from 'clsx'
import type { ViewId } from '../../types'
import { useAppStore } from '../../store/useAppStore'

const NAV: { id: ViewId; icon: string; label: string }[] = [
  { id: 'timer',        icon: '⏱',  label: 'Focus Timer'   },
  { id: 'dashboard',   icon: '📊',  label: 'Dashboard'     },
  { id: 'history',     icon: '📋',  label: 'History'       },
  { id: 'achievements',icon: '🏆',  label: 'Achievements'  },
  { id: 'settings',    icon: '⚙️',  label: 'Settings'      },
]

interface Props {
  active: ViewId
  onSwitch: (id: ViewId) => void
}

export function Sidebar({ active, onSwitch }: Props) {
  const { level, totalXP } = useAppStore()
  const xpPerLevel = 100
  const xpInLevel  = totalXP % xpPerLevel
  const xpPct      = xpInLevel

  const ranks = ['Novice', 'Apprentice', 'Focused', 'Expert', 'Master', 'Legend']
  const rank   = ranks[Math.min(level - 1, ranks.length - 1)]

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#0a0f1e] border-r border-[#1e293b] flex flex-col z-10">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1e293b]">
        <div className="text-gradient font-syne text-xl font-black tracking-tight">NEXUS</div>
        <div className="text-[10px] text-slate-600 tracking-[3px] uppercase mt-0.5">Focus Protocol</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {NAV.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => onSwitch(id)}
            className={clsx(
              'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-0.5 border text-left',
              active === id
                ? 'bg-gradient-to-r from-[var(--c1)]/10 to-[var(--c2)]/10 text-[var(--c1)] border-[var(--c1)]/20'
                : 'text-slate-400 border-transparent hover:bg-[#0e1428] hover:text-slate-200'
            )}
          >
            <span className="text-base leading-none">{icon}</span>
            <span className="font-dm">{label}</span>
          </button>
        ))}
      </nav>

      {/* XP Footer */}
      <div className="p-3 border-t border-[#1e293b]">
        <div className="flex justify-between text-[11px] text-slate-600 mb-1">
          <span>Level {level}</span>
          <span>{xpInLevel}/{xpPerLevel} XP</span>
        </div>
        <div className="h-1 bg-[#1e293b] rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-[var(--c1)] to-[var(--c2)] rounded-full transition-all duration-500"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>⚡</span>
          <span className="font-syne font-bold text-[var(--c1)]">Lv.{level}</span>
          <span className="text-slate-600">{rank}</span>
        </div>
      </div>
    </aside>
  )
}
