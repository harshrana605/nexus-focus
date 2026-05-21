import { useEffect } from 'react'

export function useParticles(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const container = document.getElementById('particles-root')
    if (!container) return

    const particles: HTMLElement[] = []
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div')
      const size = Math.random() * 3 + 1
      const dur  = Math.random() * 18 + 10
      const del  = -Math.random() * 25
      p.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        background:${Math.random() > 0.5 ? 'var(--c1)' : 'var(--c2)'};
        opacity:${Math.random() * 0.35 + 0.1};
        animation:float ${dur}s linear ${del}s infinite;
      `
      container.appendChild(p)
      particles.push(p)
    }

    return () => particles.forEach((p) => p.remove())
  }, [enabled])
}
