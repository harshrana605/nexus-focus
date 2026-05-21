import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { THEMES, applyTheme } from '../../utils/themes'
import { notify } from '../ui/Notification'
import { clsx } from 'clsx'
import type { ThemeId } from '../../types'

export function SettingsView() {
  const store = useAppStore()
  const { settings } = store

  function handleTheme(id: ThemeId) {
    store.updateSettings({ theme: id })
    applyTheme(id)
    notify(`Theme changed to ${THEMES.find(t => t.id === id)?.name}`)
  }

  function toggle(key: 'tabswitch' | 'sounds' | 'particles') {
    store.updateSettings({ [key]: !settings[key] })
  }

  function resetAll() {
    if (!window.confirm('Reset ALL data? Sessions, streaks and XP will be permanently deleted.')) return
    store.resetAll()
    notify('All data has been reset.')
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 pb-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-syne text-2xl font-bold mb-1">Settings</h2>
          <p className="text-slate-500 text-sm mb-5">Customize your focus experience</p>

          {/* Theme */}
          <Section title="Theme">
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTheme(t.id)}
                  className={clsx(
                    'p-2.5 rounded-xl border text-center transition-all duration-200',
                    settings.theme === t.id
                      ? 'border-[var(--c1)] shadow-[0_0_12px_rgba(0,245,255,0.1)]'
                      : 'border-[#1e293b] hover:border-[#334155]'
                  )}
                >
                  <div
                    className="h-6 rounded-md mb-2"
                    style={{ background: `linear-gradient(135deg, ${t.c1}, ${t.c2})` }}
                  />
                  <div className="text-[11px] text-slate-400">{t.name}</div>
                </button>
              ))}
            </div>
          </Section>

          {/* Daily goal */}
          <Section title="Daily Goal">
            <SettingRow
              label="Sessions per day"
              sub="Target number of focus sessions"
            >
              <input
                type="number"
                min={1}
                max={20}
                value={settings.dailyGoal}
                onChange={(e) => store.updateSettings({ dailyGoal: Number(e.target.value) || 2 })}
                className="w-16 bg-[#050810] border border-[#1e293b] text-slate-200 px-2 py-1.5 rounded-lg font-jb text-center text-sm focus:border-[var(--c1)] outline-none"
              />
            </SettingRow>
          </Section>

          {/* Behaviour */}
          <Section title="Behaviour">
            <SettingRow label="Tab switch detection" sub="Warn when you leave the page">
              <Toggle on={settings.tabswitch} onToggle={() => toggle('tabswitch')} />
            </SettingRow>
            <SettingRow label="Sound effects" sub="Play ambient audio during focus">
              <Toggle on={settings.sounds} onToggle={() => toggle('sounds')} />
            </SettingRow>
            <SettingRow label="Particles effect" sub="Animated background particles">
              <Toggle on={settings.particles} onToggle={() => toggle('particles')} />
            </SettingRow>
          </Section>

          {/* Keyboard shortcuts */}
          <Section title="Keyboard Shortcuts">
            <div className="flex flex-col gap-2 text-sm">
              {[
                ['Space', 'Start / Pause / Resume timer'],
                ['Escape', 'Exit focus mode'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-400">{desc}</span>
                  <kbd className="font-jb text-xs bg-[#0e1428] border border-[#334155] px-2 py-0.5 rounded text-slate-300">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </Section>

          {/* Data */}
          <Section title="Data Management">
            <SettingRow label="Reset all data" sub="Clear sessions, streaks, XP and achievements">
              <button
                onClick={resetAll}
                className="text-xs text-red-400 border border-red-500/30 bg-red-500/5 px-3 py-1.5 rounded-lg hover:bg-red-500/15 transition-colors font-dm"
              >
                Reset Everything
              </button>
            </SettingRow>
          </Section>
        </motion.div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0f1e] border border-[#1e293b] rounded-xl p-4 mb-3">
      <div className="text-[11px] uppercase tracking-widest text-slate-600 font-semibold mb-3">{title}</div>
      {children}
    </div>
  )
}

function SettingRow({
  label, sub, children,
}: { label: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#1e293b] last:border-none">
      <div>
        <div className="text-sm text-slate-200">{label}</div>
        <div className="text-[11px] text-slate-600">{sub}</div>
      </div>
      {children}
    </div>
  )
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        'relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0',
        on ? 'bg-[var(--c1)]' : 'bg-[#1e293b]'
      )}
    >
      <span
        className={clsx(
          'absolute top-0.5 w-4 h-4 bg-black rounded-full transition-all duration-200',
          on ? 'left-[18px]' : 'left-0.5'
        )}
      />
    </button>
  )
}
