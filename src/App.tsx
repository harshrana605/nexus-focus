import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './components/layout/Sidebar'
import { TimerView } from './components/timer/TimerView'
import { DashboardView } from './components/dashboard/DashboardView'
import { HistoryView } from './components/history/HistoryView'
import { AchievementsView } from './components/achievements/AchievementsView'
import { SettingsView } from './components/settings/SettingsView'
import { Notification } from './components/ui/Notification'
import { useParticles } from './hooks/useParticles'
import { useAppStore } from './store/useAppStore'
import { applyTheme } from './utils/themes'
import type { ViewId } from './types'

export default function App() {
  const [view, setView]     = useState<ViewId>('timer')
  const [loading, setLoad]  = useState(true)
  const { settings }        = useAppStore()

  // Apply persisted theme on boot
  useEffect(() => {
    applyTheme(settings.theme)
    const t = setTimeout(() => setLoad(false), 900)
    return () => clearTimeout(t)
  }, [])

  useParticles(settings.particles)

  if (loading) return <Loader />

  return (
    <div className="flex h-screen overflow-hidden bg-[#050810] relative">
      {/* Particles container */}
      <div id="particles-root" className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />

      {/* Ambient mesh gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--c2)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[var(--c1)]/4 rounded-full blur-[100px]" />
      </div>

      <Sidebar active={view} onSwitch={setView} />

      <main className="flex-1 overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="h-full"
          >
            {view === 'timer'        && <TimerView onSwitchView={setView} />}
            {view === 'dashboard'    && <DashboardView />}
            {view === 'history'      && <HistoryView />}
            {view === 'achievements' && <AchievementsView />}
            {view === 'settings'     && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Notification />
    </div>
  )
}

function Loader() {
  return (
    <div className="fixed inset-0 bg-[#050810] flex flex-col items-center justify-center z-[300]">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-5"
      >
        {/* Crystal loader icon */}
        <svg viewBox="0 0 60 80" width={60} height={80}>
          <defs>
            <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <motion.polygon
            points="30,4 54,20 50,56 30,68 10,56 6,20"
            fill="url(#loaderGrad)"
            opacity={0.85}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <polygon points="30,14 44,24 41,48 30,56 19,48 16,24" fill="#050810" opacity={0.55} />
        </svg>

        <div className="text-center">
          <div className="font-syne text-3xl font-black text-gradient mb-1">NEXUS</div>
          <div className="text-[11px] tracking-[4px] uppercase text-slate-600">Focus Protocol</div>
        </div>

        {/* Loading bar */}
        <div className="w-40 h-0.5 bg-[#1e293b] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00f5ff] to-[#7c3aed] rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
          />
        </div>

        <div className="text-xs text-slate-600 font-dm">Initializing the zone…</div>
      </motion.div>
    </div>
  )
}
