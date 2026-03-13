import { style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'

const headerBase = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: vars.zIndex.sticky,
  transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
})

export const header = style([headerBase, {
  backgroundColor: 'rgba(243, 244, 246, 0.8)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
}])

export const headerTransparent = style([headerBase, {
  backgroundColor: 'transparent',
  backdropFilter: 'none',
  WebkitBackdropFilter: 'none',
}])

export const inner = style({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: `${vars.space[6]} ${vars.space[8]}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const right = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[8],
})

export const logo = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.extrabold,
  letterSpacing: vars.letterSpacing.tighter,
  color: vars.color.dark,
  textDecoration: 'none',
})

export const pillGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
  backgroundColor: vars.color.white,
  padding: vars.space[1],
  borderRadius: vars.radii.full,
})
