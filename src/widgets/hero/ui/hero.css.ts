import { globalStyle, style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'

export const section = style({
  position: 'relative',
  overflow: 'hidden',
  minHeight: '100vh',
  height: '100vh',
  paddingTop: vars.space[32],
  paddingBottom: vars.space[24],
  '@media': {
    '(max-width: 640px)': {
      minHeight: '70vh',
      height: '70vh',
      paddingTop: vars.space[24],
      paddingBottom: vars.space[16],
    },
  },
})

export const container = style({
  maxWidth: '1920px',
  margin: '0 auto',
  padding: `0 ${vars.space[8]}`,
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[12],
  alignItems: 'center',
  height: '100%',
  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
})

export const name = style({
  position: 'absolute',
  bottom: vars.space[12],
  right: vars.space[8],
  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
  fontWeight: vars.fontWeight.bold,
  letterSpacing: vars.letterSpacing.tighter,
  color: vars.color.nameText,
  userSelect: 'none',
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
})

export const heading = style({
  fontSize: 'clamp(2.5rem, 8vw, 7.5rem)',
  fontWeight: vars.fontWeight.medium,
  letterSpacing: vars.letterSpacing.tight,
  lineHeight: vars.lineHeight.tight,
  marginBottom: 0,
  maxWidth: '14ch',
})

export const headingNoWrap = style({
  whiteSpace: 'nowrap',
  '@media': {
    '(max-width: 640px)': {
      whiteSpace: 'normal',
    },
  },
})

export const headingHighlight = style({
  display: 'inline-block',
  minWidth: '10ch',
  '@media': {
    '(max-width: 640px)': {
      minWidth: 'unset',
    },
  },
})

export const headingHighlightText = style({
  position: 'relative',
  display: 'inline-block',

  '::after': {
    content: '""',
    position: 'absolute',
    bottom: '0.15em',
    left: 0,
    width: '100%',
    height: '0.5rem',
    backgroundColor: vars.color.brand,
    zIndex: -1,
  },
})

export const badgeRow = style({
  display: 'flex',
  gap: vars.space[4],
  flexWrap: 'wrap',
})


export const visual = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    },
  },
})

export const glowBlob = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  color: vars.color.brand,
})

globalStyle(`[data-theme="dark"] .${glowBlob}`, {
  color: '#3dba74',
})

export const glow = style({
  position: 'absolute',
  inset: 0,
  background: `radial-gradient(circle, ${vars.color.brandMuted} 0%, transparent 70%)`,
  filter: 'blur(80px)',
  zIndex: -1,
  borderRadius: vars.radii.full,
})
