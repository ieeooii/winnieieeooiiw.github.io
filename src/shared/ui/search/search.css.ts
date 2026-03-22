import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/tokens.css'

export const input = style({
  width: '360px',
  padding: `${vars.space[3]} ${vars.space[5]}`,
  borderRadius: vars.radii.full,
  border: `1px solid ${vars.color.gray[200]}`,
  backgroundColor: vars.color.white,
  fontSize: vars.fontSize.base,
  color: vars.color.dark,
  outline: 'none',
  transition: vars.transition.fast,
  selectors: {
    '&::placeholder': { color: vars.color.gray[400] },
    '&:focus': { borderColor: vars.color.dark },
  },
  '@media': {
    '(max-width: 640px)': {
      width: '100%',
    },
  },
})
