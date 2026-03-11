import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '../../styles/tokens.css'

const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${vars.space[1]} ${vars.space[3]}`,
  borderRadius: vars.radii.full,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.medium,
  lineHeight: vars.lineHeight.none,
})

export const tag = styleVariants({
  outline: [
    base,
    {
      border: `1px solid ${vars.color.gray[300]}`,
      color: vars.color.dark,
      backgroundColor: 'transparent',
    },
  ],

  brand: [
    base,
    {
      border: 'none',
      backgroundColor: vars.color.brandMuted,
      color: vars.color.dark,
      fontWeight: vars.fontWeight.bold,
    },
  ],
})
