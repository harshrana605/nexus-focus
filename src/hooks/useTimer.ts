import { useState, useRef, useCallback, useEffect } from 'react'

export type TimerState = 'idle' | 'running' | 'paused'

interface UseTimerOptions {
  onComplete: () => void
  onTick?: (remaining: number, elapsed: number) => void
}

export function useTimer({ onComplete, onTick }: UseTimerOptions) {
  const [totalDuration, setTotalDuration] = useState(25 * 60)
  const [remaining, setRemaining]         = useState(25 * 60)
  const [state, setState]                 = useState<TimerState>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const remainingRef = useRef(remaining)
  remainingRef.current = remaining

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  const start = useCallback(() => {
    if (state !== 'idle') return
    setState('running')
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1
        onTick?.(next, totalDuration - next)
        if (next <= 0) {
          clear()
          setState('idle')
          onComplete()
          return 0
        }
        return next
      })
    }, 1000)
  }, [state, totalDuration, onComplete, onTick])

  const pause = useCallback(() => {
    if (state !== 'running') return
    clear()
    setState('paused')
  }, [state])

  const resume = useCallback(() => {
    if (state !== 'paused') return
    setState('running')
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1
        onTick?.(next, totalDuration - next)
        if (next <= 0) {
          clear()
          setState('idle')
          onComplete()
          return 0
        }
        return next
      })
    }, 1000)
  }, [state, totalDuration, onComplete, onTick])

  const stop = useCallback(() => {
    clear()
    setState('idle')
  }, [])

  const reset = useCallback((duration?: number) => {
    clear()
    setState('idle')
    const d = duration ?? totalDuration
    setTotalDuration(d)
    setRemaining(d)
  }, [totalDuration])

  const setDuration = useCallback((seconds: number) => {
    if (state !== 'idle') return
    setTotalDuration(seconds)
    setRemaining(seconds)
  }, [state])

  useEffect(() => () => clear(), [])

  const elapsed  = totalDuration - remaining
  const progress = totalDuration > 0 ? elapsed / totalDuration : 0

  return {
    remaining,
    elapsed,
    progress,
    totalDuration,
    state,
    start,
    pause,
    resume,
    stop,
    reset,
    setDuration,
  }
}
