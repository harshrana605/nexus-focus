import { fmtTime } from '../../utils/format'

const R    = 88
const CIRC = 2 * Math.PI * R // ≈ 553

interface Props {
  remaining: number
  progress: number  // 0–1
  size?: number
}

export function TimerRing({ remaining, progress, size = 200 }: Props) {
  const offset = CIRC * (1 - progress)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="var(--c1)" />
            <stop offset="100%" stopColor="var(--c2)" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx="100" cy="100" r={R} fill="none" stroke="#1e293b" strokeWidth="3" />
        {/* Glow ring */}
        <circle
          cx="100" cy="100" r={R}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          opacity="0.28"
          className="animate-pulse-ring"
        />
        {/* Progress ring */}
        <circle
          cx="100" cy="100" r={R}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s linear' }}
        />
      </svg>

      {/* Centre display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-jb text-4xl font-bold leading-none text-slate-100">
          {fmtTime(remaining)}
        </div>
        <div className="font-jb text-xs text-slate-500 mt-1">
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  )
}
