import { AnimatePresence, motion } from 'framer-motion'
import { CrystalScene } from './CrystalScene'
import { TimerRing } from './TimerRing'
import { Button } from '../ui/Button'
import type { TimerState } from '../../hooks/useTimer'

interface Props {
  open: boolean
  remaining: number
  progress: number
  timerState: TimerState
  sessionName: string
  onExit: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

export function FocusMode({
  open, remaining, progress, timerState,
  sessionName, onExit, onPause, onResume, onStop,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="focus-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050810]"
        >
          {/* Ambient BG */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(124,58,237,0.18)_0%,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(0,245,255,0.08)_0%,transparent_50%)]" />
          </div>

          {/* Exit btn */}
          <button
            onClick={onExit}
            className="absolute top-5 right-5 z-10 text-xs text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors font-dm"
          >
            ✕ Exit Focus Mode
          </button>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="text-[10px] tracking-[3px] uppercase text-[var(--c4)] font-semibold">
              Immersive Focus
            </div>
            <h2 className="font-syne text-3xl font-bold text-center">{sessionName}</h2>

            <CrystalScene
              progress={progress}
              failed={false}
              running={timerState === 'running'}
              width={300}
              height={210}
            />

            <TimerRing remaining={remaining} progress={progress} size={240} />

            <div className="flex gap-3">
              {timerState === 'running' ? (
                <Button onClick={onPause}>⏸ Pause</Button>
              ) : (
                <Button onClick={onResume}>▶ Resume</Button>
              )}
              <Button variant="danger" onClick={onStop}>✕ Quit Session</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
