import { style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'
export { container } from '../../../shared/styles/layout.css'

export const section = style({
  paddingTop: vars.space[32],
  paddingBottom: vars.space[32],
  backgroundColor: vars.color.gray[50],
})


export const titleBlock = style({
  marginBottom: vars.space[20],
})

export const title = style({
  fontSize: 'clamp(2rem, 5vw, 3rem)',
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
})

export const subtitle = style({
  fontSize: 'clamp(2rem, 5vw, 3rem)',
  fontWeight: vars.fontWeight.medium,
  color: vars.color.gray[700],
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
})

export const row = style({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 2fr',
  gap: vars.space[16],
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
  color: vars.color.gray[500],
  fontFamily: vars.font.mono,
  paddingTop: '0.2em',
})

export const rowName = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.medium,
  textAlign: 'right',
})

export const rowNameAccent = style({
  color: vars.color.brand,
})

export const rowNamePrefix = style({
  fontWeight: vars.fontWeight.normal,
  color: vars.color.gray[700],
})

export const rowItems = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  color: vars.color.gray[700],
  fontSize: vars.fontSize.lg,
  listStyle: 'none',

  '@media': {
    '(max-width: 768px)': {
      gridColumn: '1 / -1',
    },
  },
})
