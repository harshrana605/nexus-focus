import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTimer } from '../../hooks/useTimer'
import { useAppStore } from '../../store/useAppStore'
import { CrystalScene } from './CrystalScene'
import { TimerRing } from './TimerRing'
import { FocusMode } from './FocusMode'
import { StatusOverlay } from './StatusOverlay'
import { SoundPanel } from './SoundPanel'
import { Button } from '../ui/Button'
import { notify } from '../ui/Notification'
import { playAmbient, stopAmbient, playCompletionChime, playFailSound, setMuted } from '../../utils/audio'
import { checkNewAchievements, ACHIEVEMENTS } from '../../utils/achievements'
import { getDailyQuote } from '../../utils/format'
import type { SoundId, ViewId } from '../../types'
import { clsx } from 'clsx'

const PRESETS = [
  { label: '15m', mins: 15 },
  { label: '25m', mins: 25 },
  { label: '45m', mins: 45 },
  { label: '60m', mins: 60 },
  { label: '90m', mins: 90 },
  { label: '2h',  mins: 120 },
]

const CATEGORIES = ['Deep Work', 'Study', 'Creative', 'Reading', 'Exercise', 'Planning']

interface Props {
  onSwitchView: (v: ViewId) => void
}

export function TimerView({ onSwitchView }: Props) {
  const store = useAppStore()

  // Session meta
  const [category, setCategory] = useState('Deep Work')
  const [note, setNote]         = useState('')
  const [preset, setPreset]     = useState(25)
  const [customOpen, setCustomOpen] = useState(false)
  const [customH, setCustomH]   = useState(0)
  const [customM, setCustomM]   = useState(25)

  // Sound
  const [sound, setSound]   = useState<SoundId>(null)
  const [muted, setMutedL]  = useState(false)

  // Focus mode & status
  const [focusMode, setFocusMode]     = useState(false)
  const [statusOpen, setStatusOpen]   = useState(false)
  const [lastResult, setLastResult]   = useState({ success: false, xp: 0, duration: 0 })
  const [crystalFailed, setCrystalFailed] = useState(false)
  const tabSwitchRef = useRef(0)

  // Timer
  const handleComplete = useCallback(() => {
    finishSession(true)
  }, [])

  const timer = useTimer({ onComplete: handleComplete })

  // Crystal state mirrors timer progress — keep ref for closure
  const progressRef = useRef(0)
  progressRef.current = timer.progress

  function finishSession(success: boolean) {
    stopAmbient()
    setFocusMode(false)
    const duration = timer.elapsed
    const xp = success ? Math.max(10, Math.floor(timer.totalDuration / 60) * 10) : 0

    if (success) {
      playCompletionChime()
      store.addXP(xp)
      store.updateStreak()
    } else {
      playFailSound()
    }

    const session = {
      id: Date.now(),
      duration,
      totalDuration: timer.totalDuration,
      status: (success ? 'success' : 'fail') as 'success' | 'fail',
      date: new Date().toISOString(),
      category,
      note,
      xp,
      streak: store.streak,
    }
    store.addSession(session)

    // Achievements
    const newSessions = [session, ...store.sessions]
    const newStreak   = success ? store.streak + 1 : store.streak
    const newXP       = store.totalXP + xp
    const newOnes     = checkNewAchievements(newSessions, newStreak, newXP, store.achievements)
    newOnes.forEach((id) => {
      store.unlockAchievement(id)
      const a = ACHIEVEMENTS.find((x) => x.id === id)
      if (a) setTimeout(() => notify(`🏆 Achievement: ${a.name}`), 1800)
    })

    setCrystalFailed(!success)
    setLastResult({ success, xp, duration })
    setStatusOpen(true)
    timer.stop()
  }

  function handleStart() {
    tabSwitchRef.current = 0
    setCrystalFailed(false)
    timer.start()
    if (sound && !muted) playAmbient(sound, 0.6)
    notify('🔥 Focus session started! Stay in the zone.')
  }

  function handlePause() {
    timer.pause()
    stopAmbient()
  }

  function handleResume() {
    timer.resume()
    if (sound && !muted) playAmbient(sound, 0.6)
  }

  function handleStop() {
    if (!window.confirm('Quit this session? It will be marked as failed.')) return
    finishSession(false)
  }

  function handlePreset(mins: number) {
    if (timer.state !== 'idle') return
    setPreset(mins)
    setCustomOpen(false)
    timer.setDuration(mins * 60)
  }

  function applyCustom() {
    const secs = customH * 3600 + customM * 60
    if (secs < 60) { notify('Minimum 1 minute'); return }
    timer.setDuration(secs)
    setPreset(-1)
    setCustomOpen(false)
  }

  function toggleSound(id: SoundId) {
    const next = sound === id ? null : id
    setSound(next)
    stopAmbient()
    if (next && !muted && timer.state === 'running') playAmbient(next, 0.6)
  }

  function toggleMute() {
    const next = !muted
    setMutedL(next)
    setMuted(next)
    if (next) stopAmbient()
    else if (sound && timer.state === 'running') playAmbient(sound, 0.6)
  }

  function closeStatus() {
    setStatusOpen(false)
    setCrystalFailed(false)
    timer.reset()
    setNote('')
  }

  // Tab visibility detection
  useEffect(() => {
    const handler = () => {
      if (document.hidden && timer.state === 'running' && store.settings.tabswitch) {
        tabSwitchRef.current++
        if (tabSwitchRef.current >= 3) notify('⚠️ Focus! Too many tab switches.')
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [timer.state, store.settings.tabswitch])

  // Keyboard shortcut: Space
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space') {
        e.preventDefault()
        if (timer.state === 'idle') handleStart()
        else if (timer.state === 'running') handlePause()
        else if (timer.state === 'paused') handleResume()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [timer.state])

  const isRunning = timer.state === 'running'
  const isPaused  = timer.state === 'paused'
  const isIdle    = timer.state === 'idle'

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div
          className="flex flex-col items-center py-6 px-4 min-h-full"
          style={{
            background:
              'radial-gradient(ellipse at 50% 20%, rgba(124,58,237,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(0,245,255,0.06) 0%, transparent 45%)',
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-3"
          >
            <div className="text-[10px] tracking-[3px] uppercase text-[var(--c4)] font-semibold mb-1">
              {isRunning ? 'FOCUS IN PROGRESS' : isPaused ? 'PAUSED' : 'READY TO FOCUS'}
            </div>
            <h1 className="font-syne text-xl font-bold text-slate-100">Focus Session</h1>
          </motion.div>

          {/* Crystal */}
          <div className="w-full max-w-[380px]">
            <CrystalScene
              progress={timer.progress}
              failed={crystalFailed}
              running={isRunning}
            />
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-[320px] h-0.5 bg-[#1e293b] rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-[var(--c2)] to-[var(--c1)] rounded-full transition-all duration-500"
              style={{ width: `${timer.progress * 100}%` }}
            />
          </div>

          {/* Ring */}
          <TimerRing remaining={timer.remaining} progress={timer.progress} size={200} />

          {/* Presets */}
          <div className="flex gap-1.5 flex-wrap justify-center mt-5 mb-3">
            {PRESETS.map((p) => (
              <button
                key={p.mins}
                onClick={() => handlePreset(p.mins)}
                disabled={!isIdle}
                className={clsx(
                  'px-3 py-1 rounded-full border text-xs font-dm transition-all duration-200',
                  preset === p.mins && isIdle
                    ? 'border-[var(--c1)] text-[var(--c1)] bg-[var(--c1)]/5'
                    : 'border-[#1e293b] text-slate-400 hover:border-slate-500',
                  !isIdle && 'opacity-40 cursor-not-allowed'
                )}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => isIdle && setCustomOpen(!customOpen)}
              disabled={!isIdle}
              className={clsx(
                'px-3 py-1 rounded-full border text-xs font-dm transition-all duration-200',
                customOpen
                  ? 'border-[var(--c1)] text-[var(--c1)] bg-[var(--c1)]/5'
                  : 'border-[#1e293b] text-slate-400 hover:border-slate-500',
                !isIdle && 'opacity-40 cursor-not-allowed'
              )}
            >
              Custom
            </button>
          </div>

          {/* Custom input */}
          {customOpen && isIdle && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="flex items-center gap-2 mb-3"
            >
              <input
                type="number" min={0} max={8} value={customH}
                onChange={(e) => setCustomH(Number(e.target.value))}
                className="w-14 bg-[#0a0f1e] border border-[#1e293b] text-slate-200 px-2 py-1.5 rounded-lg font-jb text-center text-base focus:border-[var(--c1)] outline-none"
                placeholder="HH"
              />
              <span className="text-slate-400 font-bold text-xl">:</span>
              <input
                type="number" min={1} max={59} value={customM}
                onChange={(e) => setCustomM(Number(e.target.value))}
                className="w-14 bg-[#0a0f1e] border border-[#1e293b] text-slate-200 px-2 py-1.5 rounded-lg font-jb text-center text-base focus:border-[var(--c1)] outline-none"
                placeholder="MM"
              />
              <Button size="sm" onClick={applyCustom}>Set</Button>
            </motion.div>
          )}

          {/* Category & note */}
          <div className="w-full max-w-[340px] mb-3 flex flex-col gap-2">
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={clsx(
                    'px-3 py-1 rounded-full border text-[11px] font-dm transition-all duration-200',
                    category === cat
                      ? 'border-[var(--c4)] text-[var(--c4)] bg-[var(--c4)]/5'
                      : 'border-[#1e293b] text-slate-400 hover:border-slate-500'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Session note (optional)"
              className="w-full bg-[#0a0f1e] border border-[#1e293b] text-slate-200 px-3 py-2 rounded-lg text-xs font-dm focus:border-[var(--c1)] outline-none placeholder:text-slate-600"
            />
          </div>

          {/* Sound */}
          <div className="w-full max-w-[360px] mb-4">
            <SoundPanel active={sound} muted={muted} onToggle={toggleSound} onToggleMute={toggleMute} />
          </div>

          {/* Controls */}
          <div className="flex gap-2 items-center mb-4">
            {isIdle && (
              <Button variant="primary" onClick={handleStart}>▶ Start Focus</Button>
            )}
            {isRunning && (
              <Button onClick={handlePause}>⏸ Pause</Button>
            )}
            {isPaused && (
              <Button variant="primary" onClick={handleResume}>▶ Resume</Button>
            )}
            {!isIdle && (
              <Button variant="danger" onClick={handleStop}>✕ Quit</Button>
            )}
            <Button
              size="icon"
              onClick={() => {
                if (!isRunning && !isPaused) { notify('Start a session first!'); return }
                setFocusMode(true)
              }}
              title="Fullscreen Focus Mode (immersive)"
            >
              ⛶
            </Button>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 mb-3 w-full max-w-[340px]">
            <span className="text-2xl animate-pulse-slow">🔥</span>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-syne text-2xl font-black text-amber-400">{store.streak}</span>
                <span className="text-sm font-semibold text-slate-300">Day Streak</span>
              </div>
              <div className="text-xs text-slate-500">Keep going to maintain it!</div>
            </div>
          </div>

          {/* Daily quote */}
          <div className="w-full max-w-[340px] border-l-2 border-[var(--c2)] pl-3 py-1 text-xs text-slate-400 italic">
            {getDailyQuote()}
          </div>
        </div>
      </div>

      {/* Focus Mode */}
      <FocusMode
        open={focusMode}
        remaining={timer.remaining}
        progress={timer.progress}
        timerState={timer.state}
        sessionName={`${category} — ${Math.floor(timer.totalDuration / 60)}m`}
        onExit={() => setFocusMode(false)}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
      />

      {/* Status */}
      <StatusOverlay
        open={statusOpen}
        success={lastResult.success}
        xp={lastResult.xp}
        duration={lastResult.duration}
        streak={store.streak}
        onContinue={closeStatus}
        onViewHistory={() => { closeStatus(); onSwitchView('history') }}
      />
    </>
  )
}
