import { glowBlob } from './hero.css'

export const GlowBlob = () => (
  <div className={glowBlob} aria-hidden="true">
    <svg viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c1ff70" stopOpacity="1" />
          <stop offset="100%" stopColor="#c1ff70" stopOpacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="36" />
        </filter>
      </defs>

      <g filter="url(#blur)">
        {/* 우상단 — 크고 둥근 */}
        <ellipse cx="750" cy="140" rx="180" ry="160" fill="url(#g1)" opacity="0.65" />
        {/* 중앙 — 얇고 가로로 긴 */}
        <ellipse cx="500" cy="350" rx="300" ry="60"  fill="url(#g1)" opacity="0.5" />
        {/* 좌하단 — 중간 크기 */}
        <ellipse cx="200" cy="560" rx="150" ry="130" fill="url(#g1)" opacity="0.55" />
        {/* 우하단 — 얇고 대각 */}
        <ellipse cx="820" cy="520" rx="200" ry="55"  fill="url(#g1)" opacity="0.45"
          transform="rotate(-30 820 520)" />
        {/* 좌상단 — 작고 둥근 */}
        <ellipse cx="160" cy="180" rx="110" ry="100" fill="url(#g1)" opacity="0.4" />
        {/* 중앙 우측 — 길쭉한 세로 */}
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
