import { style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'

export const section = style({
  position: 'relative',
  overflow: 'hidden',
  marginBottom: vars.space[32],
  paddingTop: vars.space[32],
})

export const container = style({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: `0 ${vars.space[8]}`,
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[12],
  alignItems: 'center',
  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const content = style({})

export const heading = style({
  fontWeight: vars.fontWeight.bold,
  letterSpacing: vars.letterSpacing.tight,
  lineHeight: vars.lineHeight.tight,
  marginBottom: vars.space[8],
  // clamp handled via global style override in component
})

export const headingHighlight = style({
  position: 'relative',
  display: 'inline-block',

  '::after': {
    content: '""',
    position: 'absolute',
    bottom: '0.25em',
    left: 0,
    width: '100%',
    height: '0.15em',
    backgroundColor: vars.color.brand,
    zIndex: -1,
  },
})

export const badgeRow = style({
  marginTop: vars.space[16],
  display: 'flex',
  gap: vars.space[4],
  flexWrap: 'wrap',
})

export const badgeCard = style({
  padding: vars.space[4],
  backgroundColor: vars.color.gray[50],
  borderRadius: vars.radii.lg,
  border: `1px solid ${vars.color.gray[100]}`,
  textAlign: 'center',
  width: '6rem',
})

export const badgeLabel = style({
  fontSize: '0.5rem',
  fontWeight: vars.fontWeight.bold,
  letterSpacing: vars.letterSpacing.widest,
  textTransform: 'uppercase',
  marginBottom: vars.space[1],
})

export const badgeTitle = style({
  fontSize: '0.625rem',
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.snug,
})

export const badgeSub = style({
  fontSize: '0.5rem',
  color: vars.color.gray[400],
  marginTop: vars.space[1],
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

export const glow = style({
  position: 'absolute',
  inset: 0,
  background: `radial-gradient(circle, ${vars.color.brandMuted} 0%, transparent 70%)`,
  filter: 'blur(80px)',
  zIndex: -1,
  borderRadius: vars.radii.full,
})
