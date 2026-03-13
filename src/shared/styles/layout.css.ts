import { style } from '@vanilla-extract/css'
import { vars } from './tokens.css'

export const container = style({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: `0 ${vars.space[8]}`,
})
