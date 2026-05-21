import { clsx } from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'icon'
  children: ReactNode
}

export function Button({ variant = 'secondary', size = 'md', className, children, ...rest }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg border font-dm font-medium transition-all duration-200 cursor-pointer',
        {
          'px-5 py-2.5 text-sm': size === 'md',
          'px-3.5 py-1.5 text-xs': size === 'sm',
          'p-2 min-w-[36px]': size === 'icon',
        },
        {
          'bg-gradient-to-r from-[var(--c1)] to-[var(--c2)] border-transparent text-black font-semibold hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,245,255,0.25)]':
            variant === 'primary',
          'bg-[#0a0f1e] border-[#334155] text-slate-200 hover:bg-[#0e1428] hover:border-[var(--c4)]':
            variant === 'secondary',
          'bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10':
            variant === 'danger',
          'bg-transparent border-transparent text-slate-400 hover:text-slate-200':
            variant === 'ghost',
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
