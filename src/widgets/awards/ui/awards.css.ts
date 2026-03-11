import { style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'

export const section = style({
  paddingTop: vars.space[32],
  paddingBottom: vars.space[32],
  backgroundColor: vars.color.white,
})

export const container = style({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: `0 ${vars.space[8]}`,
})

export const titleBlock = style({
  marginBottom: vars.space[20],
})

export const title = style({
  fontSize: vars.fontSize['6xl'],
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
})

export const subtitle = style({
  fontSize: vars.fontSize['5xl'],
  fontWeight: vars.fontWeight.medium,
  color: vars.color.gray[400],
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
})

export const row = style({
  display: 'grid',
  gridTemplateColumns: '3rem 1fr 2fr',
  gap: vars.space[8],
  alignItems: 'start',
  paddingTop: vars.space[8],
  paddingBottom: vars.space[8],
  borderBottom: `1px solid ${vars.color.gray[200]}`,

  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '2rem 1fr',
      rowGap: vars.space[4],
    },
  },

  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
})

export const rowSlash = style({
  color: vars.color.gray[400],
  fontFamily: 'monospace',
  paddingTop: '0.2em',
})

export const rowName = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
})

export const rowNameAccent = style({
  color: vars.color.brand,
})

export const rowItems = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${vars.space[2]} ${vars.space[12]}`,
  color: vars.color.gray[700],
  fontSize: vars.fontSize.lg,

  '@media': {
    '(max-width: 768px)': {
      gridColumn: '1 / -1',
    },
  },
})
