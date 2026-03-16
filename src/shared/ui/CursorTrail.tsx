import { useEffect, useRef } from 'react'
import { vars } from '../styles/tokens.css'

export const CursorTrail = () => {
  const dotRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMouseMove = (e: MouseEvent) => {
      const dot = dotRef.current
      if (!dot) return
      dot.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <svg
        ref={dotRef}
        width="36"
        height="36"
        viewBox="-28 -28 56 56"
        style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', opacity: 0.5 }}
      >
        <g transform="rotate(45)">
          <circle cx="-8" cy="-8" r="12" fill={vars.color.brand} />
          <circle cx="8" cy="-8" r="12" fill={vars.color.brand} />
          <circle cx="-8" cy="8" r="12" fill={vars.color.brand} />
          <circle cx="8" cy="8" r="12" fill={vars.color.brand} />
        </g>
      </svg>
    </div>
  )
}
