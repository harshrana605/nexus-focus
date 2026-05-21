import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

let _show: ((msg: string) => void) | null = null

export function notify(msg: string) {
  _show?.(msg)
}

export function Notification() {
  const [msg, setMsg]     = useState('')
  const [visible, setVis] = useState(false)

  useEffect(() => {
    _show = (m: string) => {
      setMsg(m)
      setVis(true)
      setTimeout(() => setVis(false), 3200)
    }
    return () => { _show = null }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="notif"
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0,   opacity: 1 }}
          exit={{    x: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-4 right-4 z-[200] max-w-[280px] glass rounded-xl px-4 py-3 text-sm border-[var(--c1)] shadow-[0_0_20px_rgba(0,245,255,0.15)]"
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
