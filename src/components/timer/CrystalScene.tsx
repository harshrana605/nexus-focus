import { useRef } from 'react'
import { useCrystalCanvas } from '../../hooks/useCrystalCanvas'

interface Props {
  progress: number
  failed: boolean
  running: boolean
  width?: number
  height?: number
}

export function CrystalScene({ progress, failed, running, width = 380, height = 260 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useCrystalCanvas(ref, { progress, failed, running })

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ width: '100%', height: 'auto', maxWidth: width }}
    />
  )
}
