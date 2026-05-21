import { useEffect, useRef } from 'react'

interface CrystalOptions {
  progress: number   // 0–1
  failed: boolean
  running: boolean
}

function drawCluster(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  pct: number,
  failed: boolean,
  t: number
) {
  const configs = [
    { ox: 0,          oy: 0,          scale: 1,    angle: 0 },
    { ox: -size * 0.48, oy: size * 0.12, scale: 0.62, angle: -0.28 },
    { ox:  size * 0.48, oy: size * 0.12, scale: 0.65, angle:  0.28 },
    { ox: -size * 0.28, oy: size * 0.22, scale: 0.40, angle: -0.50 },
    { ox:  size * 0.28, oy: size * 0.22, scale: 0.42, angle:  0.50 },
  ]

  const numVisible = Math.ceil(pct * configs.length + (pct > 0 ? 1 : 0))

  configs.slice(0, numVisible).forEach((c, i) => {
    const reveal = Math.max(0, Math.min(1, pct * configs.length - i + 1))
    const bob    = Math.sin(t * 0.85 + i * 1.3) * 4 * pct
    const h      = size * c.scale * reveal
    drawCrystal(ctx, cx + c.ox, cy - h * 0.5 + bob, h, c.angle, failed, pct, i, t)
  })
}

function drawCrystal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  angle: number,
  failed: boolean,
  pct: number,
  idx: number,
  t: number
) {
  if (h < 3) return
  const w = h * 0.38
  const shimmer = Math.sin(t * 1.6 + idx * 0.8) * 0.15 + 0.85

  ctx.save()
  ctx.translate(x, y + h)
  ctx.rotate(angle)

  // Body gradient
  const grad = ctx.createLinearGradient(-w, -h, w, 0)
  if (failed) {
    grad.addColorStop(0,   `rgba(239,68,68,${0.25 * shimmer})`)
    grad.addColorStop(0.4, `rgba(180,30,30,${0.75 * shimmer})`)
    grad.addColorStop(1,   `rgba(100,15,15,${0.4  * shimmer})`)
  } else {
    grad.addColorStop(0,   `rgba(0,245,255,${0.18 * shimmer})`)
    grad.addColorStop(0.3, `rgba(124,58,237,${0.82 * shimmer})`)
    grad.addColorStop(0.7, `rgba(0,180,255,${0.62 * shimmer})`)
    grad.addColorStop(1,   `rgba(200,100,255,${0.3 * shimmer})`)
  }

  // Main body
  ctx.beginPath()
  ctx.moveTo(0, -h)
  ctx.lineTo(w, -h * 0.30)
  ctx.lineTo(w * 0.80, 0)
  ctx.lineTo(-w * 0.80, 0)
  ctx.lineTo(-w, -h * 0.30)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill()

  // Inner highlight facet
  ctx.beginPath()
  ctx.moveTo(-w * 0.08, -h * 0.94)
  ctx.lineTo( w * 0.22, -h * 0.50)
  ctx.lineTo( w * 0.06, -h * 0.10)
  ctx.lineTo(-w * 0.24, -h * 0.14)
  ctx.closePath()
  ctx.fillStyle = failed
    ? 'rgba(255,120,120,0.12)'
    : `rgba(255,255,255,${0.14 * shimmer})`
  ctx.fill()

  // Outline
  ctx.beginPath()
  ctx.moveTo(0, -h)
  ctx.lineTo(w, -h * 0.30)
  ctx.lineTo(w * 0.80, 0)
  ctx.lineTo(-w * 0.80, 0)
  ctx.lineTo(-w, -h * 0.30)
  ctx.closePath()
  ctx.strokeStyle = failed
    ? `rgba(239,68,68,${0.5 * shimmer})`
    : `rgba(0,245,255,${0.35 * shimmer})`
  ctx.lineWidth = 0.6
  ctx.stroke()

  // Apex glow
  if (!failed && pct > 0.25) {
    const gr = ctx.createRadialGradient(0, -h, 0, 0, -h, w * 0.9)
    gr.addColorStop(0, `rgba(0,245,255,${0.65 * shimmer})`)
    gr.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.arc(0, -h, w * 0.9, 0, Math.PI * 2)
    ctx.fillStyle = gr
    ctx.fill()
  }

  ctx.restore()
}

export function useCrystalCanvas(
  ref: React.RefObject<HTMLCanvasElement | null>,
  { progress, failed, running }: CrystalOptions
) {
  const animRef = useRef<number>(0)
  const stateRef = useRef({ progress, failed, running })
  stateRef.current = { progress, failed, running }

  useEffect(() => {
    const loop = () => {
      const canvas = ref.current
      if (!canvas) { animRef.current = requestAnimationFrame(loop); return }
      const ctx = canvas.getContext('2d')!
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const { progress: pct, failed: fail } = stateRef.current
      const t = Date.now() / 1000

      // Ambient glow
      if (!fail && pct > 0) {
        const grd = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, 150)
        grd.addColorStop(0, 'rgba(0,245,255,0.07)')
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, W, H)
      }

      // Ground ellipse
      const cx = W / 2, cy = H / 2 + 24
      const baseSize = 28 + pct * 72

      ctx.beginPath()
      ctx.ellipse(cx, cy + 28, baseSize * 0.82, baseSize * 0.22, 0, 0, Math.PI * 2)
      ctx.strokeStyle = fail ? 'rgba(239,68,68,0.18)' : 'rgba(0,245,255,0.12)'
      ctx.lineWidth = 1
      ctx.stroke()

      drawCluster(ctx, cx, cy, baseSize, pct, fail, t)

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [ref])
}
