import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/tokens.css'

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: vars.color.white,
  textAlign: 'center',
  width: '96px',
  height: '111px',
  // rounded regular hexagon via quadratic bezier curves (r ≈ 10px)
  clipPath: 'path("M 53 3 L 91 25 Q 96 28 96 34 L 96 77 Q 96 83 91 86 L 53 108 Q 48 111 43 108 L 5 86 Q 0 83 0 77 L 0 34 Q 0 28 5 25 L 43 3 Q 48 0 53 3 Z")',
})

export const label = style({
  fontSize: vars.fontSize.badge,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: vars.letterSpacing.widest,
  textTransform: 'uppercase',
  marginBottom: vars.space[1],
})

export const title = style({
  fontSize: vars.fontSize.badgeTitle,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.snug,
})

export const sub = style({
  fontSize: vars.fontSize.badge,
  color: vars.color.gray[400],
  marginTop: vars.space[1],
})
