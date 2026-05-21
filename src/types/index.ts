export type SessionStatus = 'success' | 'fail'

export interface Session {
  id: number
  duration: number       // seconds actually elapsed
  totalDuration: number  // seconds planned
  status: SessionStatus
  date: string           // ISO string
  category: string
  note: string
  xp: number
  streak: number
}

export type ThemeId =
  | 'cyberpunk'
  | 'aurora'
  | 'space'
  | 'fire'
  | 'ocean'
  | 'forest'
  | 'crystal'

export interface Theme {
  id: ThemeId
  name: string
  c1: string
  c2: string
}

export type ViewId = 'timer' | 'dashboard' | 'history' | 'achievements' | 'settings'

export type SoundId = 'rain' | 'cafe' | 'space' | 'white' | 'fire' | null

export interface Achievement {
  id: string
  icon: string
  name: string
  desc: string
  check: (sessions: Session[], streak: number, totalXP: number) => boolean
}

export interface AppSettings {
  theme: ThemeId
  dailyGoal: number
  tabswitch: boolean
  sounds: boolean
  particles: boolean
  volume: number
}

export interface AppState {
  sessions: Session[]
  streak: number
  lastSessionDate: string | null
  totalXP: number
  level: number
  achievements: Record<string, boolean>
  settings: AppSettings
}
