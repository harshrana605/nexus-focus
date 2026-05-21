import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { fmtDate, fmtTime12, fmtDuration } from '../../utils/format'
import { clsx } from 'clsx'

type Filter = 'all' | 'success' | 'fail'

export function HistoryView() {
  const { sessions } = useAppStore()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = sessions.filter((s) => {
    if (filter === 'success') return s.status === 'success'
    if (filter === 'fail')    return s.status === 'fail'
    return true
  })

  function exportData() {
    const blob = new Blob([JSON.stringify({ sessions }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `nexus-focus-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all',     label: 'All' },
    { id: 'success', label: '✓ Success' },
    { id: 'fail',    label: '✗ Failed' },
  ]

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 pb-10">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-syne text-2xl font-bold mb-1">Session History</h2>
            <p className="text-slate-500 text-sm">{sessions.length} total sessions recorded</p>
          </div>
          <button
            onClick={exportData}
            className="text-xs text-slate-400 border border-[#1e293b] px-3 py-1.5 rounded-lg hover:border-slate-500 transition-colors font-dm"
          >
            ↓ Export JSON
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-[#0a0f1e] border border-[#1e293b] rounded-lg p-1 mb-4 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={clsx(
                'px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 font-dm',
                filter === t.id
                  ? 'bg-[#0e1428] text-slate-200'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <div className="text-4xl mb-3">🌱</div>
            <p>No sessions yet. Start your first focus session!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className={clsx(
                  'relative flex items-center gap-3 px-4 py-3 bg-[#0a0f1e] border border-[#1e293b] rounded-xl overflow-hidden hover:border-[#334155] transition-all duration-200'
                )}
              >
                {/* Left accent */}
                <div
                  className={clsx(
                    'absolute left-0 top-0 bottom-0 w-0.5',
                    s.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                  )}
                />

                {/* Dot */}
                <div
                  className={clsx(
                    'w-2 h-2 rounded-full flex-shrink-0',
                    s.status === 'success'
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                      : 'bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                  )}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-200 truncate">{s.category}</div>
                  <div className="text-[11px] text-slate-500">
                    {fmtDate(s.date)} · {fmtTime12(s.date)}
                    {s.note && ` · ${s.note}`}
                  </div>
                </div>

                {/* Right */}
                <div className="text-right flex-shrink-0">
                  <div className="font-jb text-xs text-slate-300">{fmtDuration(s.duration)}</div>
                  {s.status === 'success' ? (
                    <div className="text-[11px] text-amber-400">+{s.xp} XP</div>
                  ) : (
                    <div className="text-[11px] text-red-400">Failed</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
