import { style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'

export const footer = style({
  backgroundColor: vars.color.dark,
  color: vars.color.white,
  paddingTop: vars.space[24],
  paddingBottom: vars.space[24],
})

export const container = style({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: `0 ${vars.space[8]}`,
})

export const top = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: vars.space[12],
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
    },
  },
})

export const brand = style({})

export const logo = style({
  fontSize: 'clamp(2rem, 5vw, 2.5rem)',
  fontWeight: vars.fontWeight.extrabold,
  letterSpacing: vars.letterSpacing.tighter,
  display: 'block',
  marginBottom: vars.space[8],
})

export const tagline = style({
  color: vars.color.gray[400],
  maxWidth: '18rem',
  fontSize: vars.fontSize.lg,
  lineHeight: vars.lineHeight.relaxed,
})

export const nav = style({
  display: 'flex',
  gap: vars.space[24],
  '@media': {
    '(max-width: 480px)': {
      gap: vars.space[12],
    },
  },
})

export const navGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const navGroupLabel = style({
  fontWeight: vars.fontWeight.bold,
  color: vars.color.gray[500],
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.widest,
  fontSize: vars.fontSize.xs,
})

export const navLink = style({
  color: vars.color.white,
  textDecoration: 'none',
  transition: `color ${vars.transition.base}`,
  ':hover': {
    color: vars.color.brand,
  },
})

export const navText = style({
  color: vars.color.gray[400],
})

export const bottom = style({
  marginTop: vars.space[24],
  paddingTop: vars.space[8],
  borderTop: `1px solid rgba(255,255,255,0.1)`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: vars.color.gray[500],
  fontSize: vars.fontSize.sm,
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
      gap: vars.space[4],
      alignItems: 'flex-start',
    },
  },
})

export const socialLinks = style({
  display: 'flex',
  gap: vars.space[8],
})

export const socialLink = style({
  color: vars.color.gray[500],
  textDecoration: 'none',
  transition: `color ${vars.transition.base}`,
  ':hover': {
    color: vars.color.white,
  },
})
