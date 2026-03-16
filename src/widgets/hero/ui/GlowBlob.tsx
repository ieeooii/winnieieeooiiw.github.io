import { useEffect, useRef } from 'react'
import { glowBlob } from './hero.css'

export const GlowBlob = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const handle = () => {
      const svg = svgRef.current
      if (!svg) return
      if (document.hidden) {
        svg.pauseAnimations()
      } else {
        svg.unpauseAnimations()
      }
    }
    document.addEventListener('visibilitychange', handle)
    return () => document.removeEventListener('visibilitychange', handle)
  }, [])

  return (
    <div className={glowBlob} aria-hidden="true">
      <svg ref={svgRef} viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="36" />
          </filter>
        </defs>

        <g filter="url(#blur)">
          <ellipse cx="750" cy="140" rx="180" ry="160" fill="url(#g1)" opacity="0.65" />
          <ellipse cx="500" cy="350" rx="300" ry="60"  fill="url(#g1)" opacity="0.5" />
          <ellipse cx="200" cy="560" rx="150" ry="130" fill="url(#g1)" opacity="0.55" />
          <ellipse cx="820" cy="520" rx="200" ry="55"  fill="url(#g1)" opacity="0.45"
            transform="rotate(-30 820 520)" />
          <ellipse cx="160" cy="180" rx="110" ry="100" fill="url(#g1)" opacity="0.4" />
          <ellipse cx="680" cy="400" rx="60"  ry="180" fill="url(#g1)" opacity="0.4" />

          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 500 350"
            to="360 500 350"
            dur="30s"
            repeatCount="indefinite"
          />
        </g>
      </svg>
    </div>
  )
}
