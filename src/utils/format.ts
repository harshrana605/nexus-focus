export function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function fmtDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${seconds % 60 > 0 ? (seconds % 60) + 's' : ''}`
}

export function fmtDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function fmtTime12(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const QUOTES = [
  '"The secret of getting ahead is getting started." — Mark Twain',
  '"Focus is a matter of deciding what things you\'re not going to do." — John Carmack',
  '"Deep work is the ability to focus without distraction on a cognitively demanding task." — Cal Newport',
  '"You don\'t rise to the level of your goals, you fall to the level of your systems." — James Clear',
  '"The successful warrior is the average person, with laser-like focus." — Bruce Lee',
  '"Concentrate all your thoughts upon the work at hand." — Alexander Graham Bell',
  '"Be where you are; otherwise you will miss your life." — Buddha',
]

export function getDailyQuote(): string {
  return QUOTES[new Date().getDay() % QUOTES.length]
}
