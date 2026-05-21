import { clsx } from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  glow?: boolean
  accent?: 'success' | 'fail' | 'default'
}

export function Card({ children, glow, accent = 'default', className, ...rest }: Props) {
  return (
    <div
      className={clsx(
        'relative bg-[#0a0f1e] border border-[#1e293b] rounded-xl overflow-hidden',
        glow && 'shadow-[0_0_24px_rgba(0,245,255,0.06)]',
        className
      )}
      {...rest}
    >
      {accent !== 'default' && (
        <div
          className={clsx(
            'absolute top-0 left-0 right-0 h-0.5',
            accent === 'success' && 'bg-emerald-500',
            accent === 'fail'    && 'bg-red-500'
          )}
        />
      )}
      {accent === 'default' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--c1)] to-[var(--c2)] opacity-40" />
      )}
      {children}
    </div>
  )
}
