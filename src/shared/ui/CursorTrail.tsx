import { useEffect, useRef, useState } from 'react'
import { vars } from '../styles/tokens.css'

export const CursorTrail = () => {
  const dotRef = useRef<SVGSVGElement>(null)
  const [visible] = useState(() => window.matchMedia('(pointer: fine) and (hover: hover)').matches)

  useEffect(() => {
    if (!visible) return

    let rafId: number
    let pending = { x: 0, y: 0 }

    const onMouseMove = (e: MouseEvent) => {
      pending = { x: e.clientX, y: e.clientY }
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const dot = dotRef.current
        if (!dot) return
        dot.style.transform = `translate(${pending.x}px, ${pending.y}px)`
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
      <svg
        ref={dotRef}
        width="480"
        height="480"
        viewBox="-28 -28 56 56"
        style={{ position: 'absolute', top: '-240px', left: '-240px', willChange: 'transform', opacity: 0.15 }}
      >
        <defs>
          <radialGradient id="cursor-glow">
            <stop offset="0%" stopColor={vars.color.brand} stopOpacity="1" />
            <stop offset="100%" stopColor={vars.color.brand} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="0" cy="0" r="26" fill="url(#cursor-glow)" />
      </svg>
    </div>
  )
}
