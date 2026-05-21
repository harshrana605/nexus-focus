import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, Session, AppSettings, ThemeId } from '../types'

interface AppStore extends AppState {
  // Actions
  addSession: (session: Session) => void
  updateStreak: () => void
  addXP: (xp: number) => void
  unlockAchievement: (id: string) => void
  updateSettings: (partial: Partial<AppSettings>) => void
  resetAll: () => void
}

const defaultSettings: AppSettings = {
  theme: 'cyberpunk',
  dailyGoal: 2,
  tabswitch: true,
  sounds: true,
  particles: true,
  volume: 0.5,
}

const defaultState: AppState = {
  sessions: [],
  streak: 0,
  lastSessionDate: null,
  totalXP: 0,
  level: 1,
  achievements: {},
  settings: defaultSettings,
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      addSession: (session) =>
        set((s) => ({ sessions: [session, ...s.sessions] })),

      updateStreak: () =>
        set((s) => {
          const today = new Date().toDateString()
          const yesterday = new Date(Date.now() - 86400000).toDateString()
          if (s.lastSessionDate === today) return {}
          const newStreak =
            s.lastSessionDate === yesterday ? s.streak + 1 : 1
          return { streak: newStreak, lastSessionDate: today }
        }),

      addXP: (xp) =>
        set((s) => {
          const totalXP = s.totalXP + xp
          const level = Math.floor(totalXP / 100) + 1
          return { totalXP, level }
        }),

      unlockAchievement: (id) =>
        set((s) => ({
          achievements: { ...s.achievements, [id]: true },
        })),

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      resetAll: () => set({ ...defaultState }),
    }),
    {
      name: 'nexus-focus-v2',
    }
  )
)

// Convenience selectors
export const selectStats = (s: AppStore) => {
  const successful = s.sessions.filter((x) => x.status === 'success')
  const failed = s.sessions.filter((x) => x.status === 'fail')
  const totalMins = successful.reduce((a, b) => a + Math.floor(b.duration / 60), 0)
  const avgMins =
    successful.length > 0 ? Math.round(totalMins / successful.length) : 0
  const pct =
    s.sessions.length > 0
      ? Math.round((successful.length / s.sessions.length) * 100)
      : 0
  const todaySessions = successful.filter(
    (x) => new Date(x.date).toDateString() === new Date().toDateString()
  ).length
  return {
    totalMins,
    totalSessions: s.sessions.length,
    successCount: successful.length,
    failCount: failed.length,
    avgMins,
    pct,
    todaySessions,
  }
}
