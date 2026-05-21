import type { SoundId } from '../types'

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let activeNodes: AudioNode[] = []
let muted = false

function ctx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

function master(): GainNode {
  if (!masterGain) {
    masterGain = ctx().createGain()
    masterGain.gain.value = 0.06
    masterGain.connect(ctx().destination)
  }
  return masterGain
}

const SOUND_CONFIGS: Record<NonNullable<SoundId>, { type: OscillatorType; freq: number; gain: number }[]> = {
  rain:  [
    { type: 'sawtooth', freq: 60,  gain: 0.25 },
    { type: 'sawtooth', freq: 130, gain: 0.20 },
    { type: 'sawtooth', freq: 270, gain: 0.15 },
    { type: 'triangle', freq: 500, gain: 0.10 },
  ],
  cafe:  [
    { type: 'sine', freq: 180, gain: 0.3 },
    { type: 'sine', freq: 360, gain: 0.2 },
    { type: 'sine', freq: 540, gain: 0.1 },
  ],
  space: [
    { type: 'sine', freq: 40,  gain: 0.4 },
    { type: 'sine', freq: 60,  gain: 0.25 },
    { type: 'sine', freq: 100, gain: 0.15 },
  ],
  white: [
    { type: 'sawtooth', freq: 80,  gain: 0.2 },
    { type: 'sawtooth', freq: 160, gain: 0.2 },
    { type: 'sawtooth', freq: 320, gain: 0.15 },
    { type: 'sawtooth', freq: 640, gain: 0.10 },
  ],
  fire:  [
    { type: 'triangle', freq: 50,  gain: 0.35 },
    { type: 'triangle', freq: 80,  gain: 0.25 },
    { type: 'triangle', freq: 120, gain: 0.15 },
  ],
}

export function playAmbient(soundId: SoundId, volume = 0.5) {
  if (!soundId || muted) return
  stopAmbient()

  const c = ctx()
  const m = master()
  m.gain.value = 0.06 * volume

  const confs = SOUND_CONFIGS[soundId]
  confs.forEach(({ type, freq, gain }) => {
    const osc  = c.createOscillator()
    const gn   = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    // gentle LFO wobble
    const lfo = c.createOscillator()
    const lfoGain = c.createGain()
    lfo.frequency.value = 0.1 + Math.random() * 0.2
    lfoGain.gain.value = freq * 0.02
    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)
    lfo.start()

    gn.gain.value = gain
    osc.connect(gn)
    gn.connect(m)
    osc.start()
    activeNodes.push(osc, lfo, gn, lfoGain)
  })
}

export function stopAmbient() {
  activeNodes.forEach((n) => {
    try { (n as OscillatorNode).stop() } catch {}
  })
  activeNodes = []
}

export function setMuted(v: boolean) {
  muted = v
  if (muted) stopAmbient()
}

export function setVolume(v: number) {
  if (masterGain) masterGain.gain.value = 0.06 * v
}

export function playCompletionChime() {
  const c = ctx()
  const freqs = [523, 659, 784, 1047]
  freqs.forEach((f, i) => {
    const osc = c.createOscillator()
    const gn  = c.createGain()
    osc.frequency.value = f
    osc.type = 'sine'
    gn.gain.setValueAtTime(0, c.currentTime + i * 0.15)
    gn.gain.linearRampToValueAtTime(0.3, c.currentTime + i * 0.15 + 0.05)
    gn.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.15 + 0.6)
    osc.connect(gn)
    gn.connect(c.destination)
    osc.start(c.currentTime + i * 0.15)
    osc.stop(c.currentTime + i * 0.15 + 0.7)
  })
}

export function playFailSound() {
  const c = ctx()
  const osc = c.createOscillator()
  const gn  = c.createGain()
  osc.frequency.value = 220
  osc.type = 'sawtooth'
  gn.gain.setValueAtTime(0.2, c.currentTime)
  gn.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8)
  osc.frequency.linearRampToValueAtTime(110, c.currentTime + 0.8)
  osc.connect(gn)
  gn.connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + 0.85)
}
