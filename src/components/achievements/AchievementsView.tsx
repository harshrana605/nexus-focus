import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { ACHIEVEMENTS } from '../../utils/achievements'
import { clsx } from 'clsx'

export function AchievementsView() {
  const { achievements, sessions, streak, totalXP } = useAppStore()

  const unlocked = ACHIEVEMENTS.filter((a) => achievements[a.id]).length

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 pb-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-body text-2xl font-bold mb-1">Achievements</h2>
          <p className="text-slate-500 text-sm mb-2">
            Unlock rewards through consistent focus
          </p>
          <div className="text-sm text-[var(--c1)] font-semibold mb-5">
            {unlocked}/{ACHIEVEMENTS.length} unlocked
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a, i) => {
              const done = !!achievements[a.id]
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={clsx(
                    'relative bg-[#0a0f1e] border rounded-xl p-4 text-center transition-all duration-300',
                    done
                      ? 'border-[var(--c1)]/30 shadow-[0_0_16px_rgba(0,245,255,0.06)]'
                      : 'border-[#1e293b] opacity-40 grayscale'
                  )}
                >
                  {done && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--c1)] to-[var(--c2)] rounded-t-xl opacity-60" />
                  )}
                  <div className="text-3xl mb-2">{a.icon}</div>
                  <div className="font-body font-bold text-sm text-slate-200 mb-1">{a.name}</div>
                  <div className="text-[11px] text-slate-500">{a.desc}</div>
                  {done && (
                    <div className="text-[10px] text-emerald-400 mt-2 font-semibold">✓ Unlocked</div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
