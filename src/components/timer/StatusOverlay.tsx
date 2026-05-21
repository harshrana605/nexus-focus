import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { fmtDuration } from '../../utils/format'

interface Props {
  open: boolean
  success: boolean
  xp: number
  duration: number
  streak: number
  onContinue: () => void
  onViewHistory: () => void
}

export function StatusOverlay({ open, success, xp, duration, streak, onContinue, onViewHistory }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050810]/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="flex flex-col items-center gap-4 text-center max-w-sm"
          >
            <motion.div
              animate={{ rotate: success ? [0, -10, 10, -5, 5, 0] : [0, 5, -5, 3, -3, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-7xl"
            >
              {success ? '💎' : '❌'}
            </motion.div>

            <h2
              className={`font-syne text-4xl font-black ${success ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {success ? 'Session Complete!' : 'Session Failed'}
            </h2>

            {success && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-syne text-2xl font-bold text-amber-400"
              >
                +{xp} XP
              </motion.div>
            )}

            <p className="text-slate-400 text-sm leading-relaxed">
              {success
                ? `Amazing! You stayed focused for ${fmtDuration(duration)}. Your crystal has fully grown. ${streak > 1 ? `🔥 ${streak}-day streak!` : ''}`
                : 'The crystal withered away. Try again — consistency is the key to mastery.'}
            </p>

            <div className="flex gap-3 mt-2">
              <Button variant="primary" onClick={onContinue}>Continue</Button>
              <Button onClick={onViewHistory}>View History</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
