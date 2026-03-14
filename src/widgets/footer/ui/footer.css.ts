import { style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'
export { container } from '../../../shared/styles/layout.css'

export const footer = style({
  backgroundColor: vars.color.gray[100],
  color: vars.color.dark,
  paddingTop: vars.space[24],
  paddingBottom: vars.space[24],
  borderTop: `1px solid ${vars.color.gray[200]}`,
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
  fontSize: vars.fontSize['4xl'],
  fontWeight: vars.fontWeight.extrabold,
  letterSpacing: vars.letterSpacing.tighter,
  display: 'block',
  marginBottom: vars.space[3],
})

export const tagline = style({
  color: vars.color.gray[400],
  maxWidth: '20rem',
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
  color: vars.color.dark,
  textDecoration: 'none',
  transition: `color ${vars.transition.base}`,
  ':hover': {
    color: vars.color.gray[500],
  },
})

export const navText = style({
  color: vars.color.gray[400],
})

export const bottom = style({
  marginTop: vars.space[24],
  paddingTop: vars.space[8],
  borderTop: `1px solid ${vars.color.gray[200]}`,
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
  color: vars.color.gray[700],
  textDecoration: 'none',
  transition: `color ${vars.transition.base}`,
  ':hover': {
    color: vars.color.dark,
  },
})
