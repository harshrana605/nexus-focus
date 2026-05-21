# 🔮 Nexus Focus

A modern, immersive productivity app inspired by Forest App — featuring glowing crystal growth, ambient soundscapes, XP progression, streaks, and deep analytics.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

---

## 📦 Build for Production

```bash
npm run build
npm run preview    # preview the production build locally
```

---

## 🗂️ Project Structure

```
nexus-focus/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Card, Notification
│   │   ├── layout/          # Sidebar
│   │   ├── timer/           # TimerView, TimerRing, CrystalScene, FocusMode, StatusOverlay, SoundPanel
│   │   ├── dashboard/       # DashboardView
│   │   ├── history/         # HistoryView
│   │   ├── achievements/    # AchievementsView
│   │   └── settings/        # SettingsView
│   ├── hooks/
│   │   ├── useTimer.ts      # Core countdown engine
│   │   ├── useCrystalCanvas.ts  # Canvas animation loop
│   │   └── useParticles.ts  # Background particle system
│   ├── store/
│   │   └── useAppStore.ts   # Zustand store with localStorage persistence
│   ├── utils/
│   │   ├── audio.ts         # Web Audio API ambient engine
│   │   ├── achievements.ts  # Achievement definitions & checker
│   │   ├── themes.ts        # 7 theme definitions + CSS var injector
│   │   └── format.ts        # Time formatting + daily quotes
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── App.tsx              # Root layout + view router
│   ├── main.tsx
│   └── index.css            # Tailwind + global styles
├── index.html
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## ✨ Features

### 🔮 Crystal Growth System
- A cluster of glowing crystals grows in real-time as your focus session progresses
- More time elapsed = taller, more complex crystal cluster with shimmer effects
- Session fail: crystals turn crimson and decay

### ⏱️ Timer Engine
- Presets: 15m, 25m, 45m, 60m, 90m, 2h
- Custom duration input (hours + minutes)
- Start / Pause / Resume / Quit
- `Space` to start/pause from anywhere

### 🌌 Focus Mode
- Fullscreen immersive overlay with large crystal + ring timer
- `Escape` to exit

### 📊 Dashboard
- Stat cards (total focus, sessions, streak, success rate, avg session, XP)
- 7-day bar chart (success vs fail)
- Success rate donut chart
- 10-week activity heatmap
- Daily goal tracker

### 📋 Session History
- All sessions with category, date, duration, XP
- Filter by Success / Failed
- JSON export

### 🏆 12 Achievements
First Step · On Fire · Week Warrior · Monthly Master · Dedicated · Champion ·
Time Lord · XP Hunter · Deep Diver · Perfect Week · Night Owl · Early Bird

### 🎵 Ambient Sounds (Web Audio API)
Rain · Café · Space · White Noise · Fire

### 🎨 7 Themes
Cyberpunk · Aurora · Deep Space · Solar Flare · Ocean Glow · Forest Spirit · Crystal Core

### ⚡ XP & Levels
- Earn XP for every completed session (proportional to duration)
- Level up every 100 XP

### 💾 Persistence
All data stored in `localStorage` via Zustand persist — restores automatically on revisit.

---

## 🧠 Local Storage Schema

Key: `nexus-focus-v2`

```json
{
  "sessions": [...],
  "streak": 0,
  "lastSessionDate": null,
  "totalXP": 0,
  "level": 1,
  "achievements": {},
  "settings": {
    "theme": "cyberpunk",
    "dailyGoal": 2,
    "tabswitch": true,
    "sounds": true,
    "particles": true,
    "volume": 0.5
  }
}
```

---

## 🛠️ Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| Framer Motion | 11 | Animations & transitions |
| Zustand | 4 | State management + localStorage |
| Web Audio API | native | Ambient sounds |
| Canvas API | native | Crystal animation |
| clsx + tailwind-merge | — | Class utilities |
| date-fns | 3 | Date formatting |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Start / Pause / Resume timer |
| `Escape` | Exit focus mode |
