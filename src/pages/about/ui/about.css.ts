import { style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'

export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.color.gray[100],
  paddingTop: '80px',
  position: 'relative',
})

export const container = style({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: `${vars.space[16]} ${vars.space[8]} ${vars.space[24]}`,
  '@media': {
    '(max-width: 640px)': {
      padding: `${vars.space[12]} ${vars.space[6]} ${vars.space[16]}`,
    },
  },
})


export const gridHeader = style({
  marginBottom: '12rem',
})

export const gridTitle = style({
  fontSize: 'clamp(4rem, 10vw, 6rem)',
  fontWeight: vars.fontWeight.medium,
  letterSpacing: vars.letterSpacing.tighter,
  lineHeight: vars.lineHeight.none,
  color: vars.color.dark,
})

export const tagline = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: vars.letterSpacing.wider,
  textTransform: 'uppercase',
  color: vars.color.brand,
  marginBottom: vars.space[4],
})

export const name = style({
  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
  fontWeight: vars.fontWeight.extrabold,
  letterSpacing: vars.letterSpacing.tighter,
  lineHeight: vars.lineHeight.tight,
  color: vars.color.dark,
  marginBottom: vars.space[8],
})

export const bio = style({
  fontSize: vars.fontSize.lg,
  color: vars.color.gray[700],
  lineHeight: vars.lineHeight.relaxed,
  marginBottom: vars.space[16],
  paddingBottom: vars.space[16],
  borderBottom: `1px solid ${vars.color.gray[200]}`,
})

export const section = style({
  marginBottom: vars.space[16],
  paddingBottom: vars.space[16],
  borderBottom: `1px solid ${vars.color.gray[200]}`,
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
  },
})

export const sectionTitle = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: vars.letterSpacing.wider,
  textTransform: 'uppercase',
  color: vars.color.gray[400],
  marginBottom: vars.space[6],
})

export const companyName = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
  marginBottom: vars.space[1],
})

export const companyMeta = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.gray[400],
  marginBottom: vars.space[8],
})

export const expList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[8],
  paddingLeft: vars.space[4],
  borderLeft: `2px solid ${vars.color.gray[200]}`,
})

export const expItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  position: 'relative',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '-17px',
      top: '8px',
      width: '8px',
      height: '8px',
      borderRadius: vars.radii.full,
      backgroundColor: vars.color.gray[300],
      outline: `8px solid ${vars.color.gray[100]}`,
      transform: 'translateX(-50%)',
    },
  },
})

export const expRole = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
})

export const expMeta = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.gray[400],
})

export const expDesc = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.gray[500],
  lineHeight: vars.lineHeight.relaxed,
  marginTop: vars.space[2],
})

export const itemList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[8],
})

export const item = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: vars.space[8],
})

export const itemPeriod = style({
  fontSize: vars.fontSize.base,
  color: vars.color.gray[400],
  whiteSpace: 'nowrap',
  paddingTop: '4px',
  flexShrink: 0,
})

export const itemBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const itemTitle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
})

export const itemSub = style({
  fontSize: vars.fontSize.lg,
  color: vars.color.gray[500],
  lineHeight: vars.lineHeight.relaxed,
})

export const itemNote = style({
  fontSize: vars.fontSize.base,
  color: vars.color.gray[400],
  lineHeight: vars.lineHeight.relaxed,
  marginTop: vars.space[1],
})
