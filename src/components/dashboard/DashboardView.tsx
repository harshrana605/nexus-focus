import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAppStore, selectStats } from '../../store/useAppStore'
import { Card } from '../ui/Card'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function DashboardView() {
  const store = useAppStore()
  const stats = selectStats(store)
  const donutRef = useRef<HTMLCanvasElement>(null)

  // Draw donut chart
  useEffect(() => {
    const canvas = donutRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const cx = 50, cy = 50, r = 38, lw = 10
    ctx.clearRect(0, 0, 100, 100)

    // Track
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = lw
    ctx.stroke()

    if (stats.pct > 0) {
      const end = (stats.pct / 100) * Math.PI * 2 - Math.PI / 2
      const grad = ctx.createLinearGradient(0, 0, 100, 100)
      grad.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--c1').trim() || '#00f5ff')
      grad.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--c2').trim() || '#7c3aed')
      ctx.beginPath()
      ctx.arc(cx, cy, r, -Math.PI / 2, end)
      ctx.strokeStyle = grad
      ctx.lineWidth = lw
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }, [stats.pct])

  // Week chart data
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const ds = d.toDateString()
    const day = store.sessions.filter((s) => new Date(s.date).toDateString() === ds)
    return {
      label: DAYS[d.getDay()],
      success: day.filter((s) => s.status === 'success').length,
      fail: day.filter((s) => s.status === 'fail').length,
    }
  })
  const maxBar = Math.max(1, ...weekData.map((d) => d.success + d.fail))

  // Heatmap: last 70 days
  const heatCells = Array.from({ length: 70 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (69 - i))
    const count = store.sessions.filter(
      (s) => s.status === 'success' && new Date(s.date).toDateString() === d.toDateString()
    ).length
    return { count, date: d.toDateString() }
  })

  const todaySessions = stats.todaySessions
  const goalPct = Math.min(100, Math.round((todaySessions / store.settings.dailyGoal) * 100))

  const statCards = [
    { val: `${stats.totalMins}m`, label: 'Total Focus',    sub: `${Math.floor(stats.totalMins / 60)}h overall` },
    { val: stats.successCount,    label: 'Sessions Done',  sub: `+${todaySessions} today` },
    { val: store.streak,          label: 'Day Streak',     sub: store.streak > 0 ? '🔥 Keep it up!' : 'Start today!' },
    { val: `${stats.pct}%`,       label: 'Success Rate',   sub: `${stats.failCount} failed` },
    { val: `${stats.avgMins}m`,   label: 'Avg Session',    sub: 'per completion' },
    { val: store.totalXP,         label: 'Total XP',       sub: `Level ${store.level}` },
  ]

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 pb-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-syne text-2xl font-bold mb-1">Dashboard</h2>
          <p className="text-slate-500 text-sm mb-5">Your focus analytics and productivity insights</p>

          {/* Stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="p-4">
                  <div className="font-syne text-2xl font-bold text-slate-100 mb-0.5">{s.val}</div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">{s.label}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">{s.sub}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Week bar chart */}
            <Card className="p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-3">Last 7 Days</div>
              <div className="flex gap-1.5 items-end h-20">
                {weekData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col gap-0.5" style={{ height: 64 }}>
                      {d.success > 0 && (
                        <div
                          className="w-full rounded-t-sm bg-gradient-to-b from-emerald-400 to-emerald-600/40 transition-all duration-700"
                          style={{ height: `${(d.success / maxBar) * 56}px`, minHeight: 2 }}
                          title={`${d.success} success`}
                        />
                      )}
                      {d.fail > 0 && (
                        <div
                          className="w-full rounded-t-sm bg-gradient-to-b from-red-400 to-red-600/40"
                          style={{ height: `${(d.fail / maxBar) * 56}px`, minHeight: 2 }}
                          title={`${d.fail} failed`}
                        />
                      )}
                      {d.success === 0 && d.fail === 0 && (
                        <div className="w-full bg-[#1e293b] rounded-sm" style={{ height: 2 }} />
                      )}
                    </div>
                    <span className="text-[9px] text-slate-600">{d.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-2 text-[10px] text-slate-600">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> Success</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" /> Failed</span>
              </div>
            </Card>

            {/* Donut */}
            <Card className="p-4 flex flex-col items-center justify-center">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-3 self-start">Success Rate</div>
              <div className="relative w-24 h-24">
                <canvas ref={donutRef} width={100} height={100} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-jb text-xl font-bold text-slate-100">{stats.pct}%</div>
                  <div className="text-[9px] text-slate-600">success</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {stats.successCount} of {stats.totalSessions} sessions
              </div>
            </Card>
          </div>

          {/* Heatmap */}
          <Card className="p-4 mb-4">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-3">
              Activity Heatmap — Last 10 Weeks
            </div>
            <div className="flex flex-wrap gap-[3px]">
              {heatCells.map((c, i) => (
                <div
                  key={i}
                  title={`${c.date}: ${c.count} session${c.count !== 1 ? 's' : ''}`}
                  className="w-3 h-3 rounded-sm transition-all duration-300"
                  style={{
                    background:
                      c.count === 0 ? '#1e293b'
                      : c.count === 1 ? 'rgba(0,245,255,0.22)'
                      : c.count === 2 ? 'rgba(0,245,255,0.52)'
                      : c.count === 3 ? 'rgba(0,245,255,0.78)'
                      : 'var(--c1)',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[9px] text-slate-600">
              <span>Less</span>
              {[0,1,2,3,4].map(n => (
                <div key={n} className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: n === 0 ? '#1e293b' : `rgba(0,245,255,${n * 0.22})` }} />
              ))}
              <span>More</span>
            </div>
          </Card>

          {/* Daily goal */}
          <Card className="p-4">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-3">Daily Goal Progress</div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--c2)] to-[var(--c1)] rounded-full transition-all duration-700"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              <span className="font-jb text-xs text-slate-300 whitespace-nowrap">
                {todaySessions}/{store.settings.dailyGoal}
              </span>
            </div>
            <div className="text-[11px] text-slate-600">
              {goalPct >= 100 ? '✅ Daily goal achieved!' : `${store.settings.dailyGoal - todaySessions} more session${store.settings.dailyGoal - todaySessions !== 1 ? 's' : ''} to hit your goal`}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
