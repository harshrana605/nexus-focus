import type { Theme, ThemeId } from '../types'

export const THEMES: Theme[] = [
  { id: 'cyberpunk', name: 'Cyberpunk',    c1: '#00f5ff', c2: '#7c3aed' },
  { id: 'aurora',    name: 'Aurora',        c1: '#10b981', c2: '#06b6d4' },
  { id: 'space',     name: 'Deep Space',    c1: '#6366f1', c2: '#8b5cf6' },
  { id: 'fire',      name: 'Solar Flare',   c1: '#f97316', c2: '#ef4444' },
  { id: 'ocean',     name: 'Ocean Glow',    c1: '#0ea5e9', c2: '#22d3ee' },
  { id: 'forest',    name: 'Forest Spirit', c1: '#84cc16', c2: '#22c55e' },
  { id: 'crystal',   name: 'Crystal Core',  c1: '#f0abfc', c2: '#a78bfa' },
]

export function applyTheme(id: ThemeId) {
  const theme = THEMES.find((t) => t.id === id) ?? THEMES[0]
  const root = document.documentElement
  root.style.setProperty('--c1', theme.c1)
  root.style.setProperty('--c2', theme.c2)
  root.style.setProperty('--c4', theme.c1)
}
