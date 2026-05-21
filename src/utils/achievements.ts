import type { Achievement, Session } from '../types'

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first',
    icon: '🌱',
    name: 'First Step',
    desc: 'Complete your first session',
    check: (s) => s.filter((x) => x.status === 'success').length >= 1,
  },
  {
    id: 'streak3',
    icon: '🔥',
    name: 'On Fire',
    desc: '3-day streak',
    check: (_s, streak) => streak >= 3,
  },
  {
    id: 'streak7',
    icon: '⚡',
    name: 'Week Warrior',
    desc: '7-day streak',
    check: (_s, streak) => streak >= 7,
  },
  {
    id: 'streak30',
    icon: '🌟',
    name: 'Monthly Master',
    desc: '30-day streak',
    check: (_s, streak) => streak >= 30,
  },
  {
    id: 'total10',
    icon: '💎',
    name: 'Dedicated',
    desc: '10 successful sessions',
    check: (s) => s.filter((x) => x.status === 'success').length >= 10,
  },
  {
    id: 'total50',
    icon: '👑',
    name: 'Champion',
    desc: '50 successful sessions',
    check: (s) => s.filter((x) => x.status === 'success').length >= 50,
  },
  {
    id: 'hours5',
    icon: '⏰',
    name: 'Time Lord',
    desc: '5 hours total focus time',
    check: (s) =>
      s.filter((x) => x.status === 'success').reduce((a, b) => a + b.duration, 0) >= 18000,
  },
  {
    id: 'xp1000',
    icon: '🚀',
    name: 'XP Hunter',
    desc: 'Earn 1000 total XP',
    check: (_s, _streak, xp) => xp >= 1000,
  },
  {
    id: 'deep',
    icon: '🧘',
    name: 'Deep Diver',
    desc: 'Complete a 60+ min session',
    check: (s) => s.some((x) => x.status === 'success' && x.duration >= 3600),
  },
  {
    id: 'perfect_week',
    icon: '🏆',
    name: 'Perfect Week',
    desc: 'Sessions 7 days in a row',
    check: (s) => {
      const now = new Date()
      for (let i = 0; i < 7; i++) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        if (!s.some((x) => x.status === 'success' && new Date(x.date).toDateString() === d.toDateString()))
          return false
      }
      return true
    },
  },
  {
    id: 'night_owl',
    icon: '🦉',
    name: 'Night Owl',
    desc: 'Focus session after 10 PM',
    check: (s) => s.some((x) => x.status === 'success' && new Date(x.date).getHours() >= 22),
  },
  {
    id: 'early_bird',
    icon: '🌅',
    name: 'Early Bird',
    desc: 'Focus session before 6 AM',
    check: (s) => s.some((x) => x.status === 'success' && new Date(x.date).getHours() < 6),
  },
]

export function checkNewAchievements(
  sessions: Session[],
  streak: number,
  totalXP: number,
  unlocked: Record<string, boolean>
): string[] {
  const newOnes: string[] = []
  for (const a of ACHIEVEMENTS) {
    if (!unlocked[a.id] && a.check(sessions, streak, totalXP)) {
      newOnes.push(a.id)
    }
  }
  return newOnes
}
