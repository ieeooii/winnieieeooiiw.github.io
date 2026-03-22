import { useEffect, useRef, useState } from 'react'
import { glowBlob } from './hero.css'
import glowBlobLight from '../../../assets/glow-blob-light.svg'
import glowBlobDark from '../../../assets/glow-blob-dark.svg'

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

function getTheme(): 'dark' | 'light' {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export const GlowBlob = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>(getTheme)

  useEffect(() => {
    if (isSafari) {
      const observer = new MutationObserver(() => setTheme(getTheme()))
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
      return () => observer.disconnect()
    }

    const handle = () => {
      const svg = svgRef.current
      if (!svg) return
      if (document.hidden) svg.pauseAnimations()
      else svg.unpauseAnimations()
    }
    document.addEventListener('visibilitychange', handle)
    return () => document.removeEventListener('visibilitychange', handle)
  }, [])

  if (isSafari) {
    return (
      <div className={glowBlob} aria-hidden="true">
        <img
          src={theme === 'dark' ? glowBlobDark : glowBlobLight}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }

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
          {/* 대형 — 우상단 */}
          <ellipse cx="720" cy="160" rx="260" ry="240" fill="url(#g1)" opacity="0.6">
            <animate attributeName="cx" values="720;600;800;640;720" dur="28s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
            <animate attributeName="cy" values="160;260;90;230;160" dur="34s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
          </ellipse>
          {/* 대형 — 좌하단 납작 */}
          <ellipse cx="280" cy="580" rx="340" ry="80" fill="url(#g1)" opacity="0.5" transform="rotate(-15 280 580)">
            <animate attributeName="cx" values="280;430;200;390;280" dur="38s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
            <animate attributeName="cy" values="580;490;625;510;580" dur="30s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
          </ellipse>
          {/* 중형 — 세로 길쭉 */}
          <ellipse cx="500" cy="320" rx="55" ry="200" fill="url(#g1)" opacity="0.45">
            <animate attributeName="cx" values="500;380;610;420;500" dur="26s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
            <animate attributeName="cy" values="320;440;230;410;320" dur="35s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
          </ellipse>
          {/* 소형 — 좌상단 */}
          <ellipse cx="140" cy="150" rx="70" ry="65" fill="url(#g1)" opacity="0.55">
            <animate attributeName="cx" values="140;280;90;250;140" dur="22s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
            <animate attributeName="cy" values="150;60;250;90;150" dur="19s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
          </ellipse>
          {/* 소형 — 우하단 사선 */}
          <ellipse cx="860" cy="500" rx="160" ry="30" fill="url(#g1)" opacity="0.4" transform="rotate(-40 860 500)">
            <animate attributeName="cx" values="860;720;910;750;860" dur="42s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
            <animate attributeName="cy" values="500;590;430;560;500" dur="31s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
          </ellipse>
          {/* 극소형 — 중앙 좌측 */}
          <ellipse cx="220" cy="340" rx="40" ry="40" fill="url(#g1)" opacity="0.5">
            <animate attributeName="cx" values="220;390;160;360;220" dur="18s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
            <animate attributeName="cy" values="340;200;430;210;340" dur="23s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
          </ellipse>
        </g>
      </svg>
    </div>
  )
}
