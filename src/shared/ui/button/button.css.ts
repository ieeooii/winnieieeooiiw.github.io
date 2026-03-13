import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '../../styles/tokens.css'

const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  border: 'none',
  cursor: 'pointer',
  fontFamily: vars.font.body,
  fontWeight: vars.fontWeight.bold,
  fontSize: vars.fontSize.sm,
  textDecoration: 'none',
  transition: `background-color ${vars.transition.base}`,
  whiteSpace: 'nowrap',
})

export const button = styleVariants({
  primary: [
    base,
    {
      padding: `${vars.space[3]} ${vars.space[6]}`,
      borderRadius: vars.radii.full,
      backgroundColor: vars.color.brand,
      color: vars.color.dark,
      ':hover': {
        backgroundColor: vars.color.brandHover,
      },
    },
  ],

  // Nav pill with active state
  navPill: [
    base,
    {
      padding: `${vars.space[2]} ${vars.space[6]}`,
      borderRadius: vars.radii.full,
      backgroundColor: 'transparent',
      color: vars.color.gray[700],
      ':hover': {
        color: vars.color.dark,
      },
    },
  ],

  navPillActive: [
    base,
    {
      padding: `${vars.space[2]} ${vars.space[6]}`,
      borderRadius: vars.radii.full,
      backgroundColor: vars.color.brand,
      color: vars.color.dark,
    },
  ],
})
