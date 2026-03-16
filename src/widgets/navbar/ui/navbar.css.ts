import { style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'

const headerBase = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 100,
  transition: `background-color ${vars.transition.navbar}, backdrop-filter ${vars.transition.navbar}`,
})

export const header = style([headerBase, {
  backgroundColor: vars.color.navbarBg,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
}])

export const headerTransparent = style([headerBase, {
  backgroundColor: 'transparent',
  backdropFilter: 'none',
  WebkitBackdropFilter: 'none',
}])

export const inner = style({
  maxWidth: '1920px',
  margin: '0 auto',
  padding: `${vars.space[8]} ${vars.space[8]}`,
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
  fontSize: vars.fontSize['3xl'],
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
  '@media': {
    '(max-width: 640px)': {
      display: 'none',
    },
  },
})

export const hamburger = style({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  width: '52px',
  height: '52px',
  background: vars.color.white,
  border: 'none',
  borderRadius: vars.radii.xl,
  color: vars.color.dark,
  cursor: 'pointer',
  flexShrink: 0,
  position: 'relative',
  zIndex: 101,
  '@media': {
    '(max-width: 640px)': {
      display: 'flex',
    },
  },
})

export const mobileMenu = style({
  position: 'fixed',
  inset: 0,
  zIndex: 99,
  backgroundColor: vars.color.gray[100],
  display: 'flex',
  flexDirection: 'column',
  padding: `120px ${vars.space[8]} ${vars.space[8]}`, // 120px = navbar height (80px) + extra spacing
})

export const mobileNavList = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[2],
})

export const mobileNavItem = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
  padding: `${vars.space[4]} ${vars.space[6]}`,
  borderRadius: vars.radii.full,
  letterSpacing: vars.letterSpacing.tight,
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.gray[100],
    },
  },
})

export const mobileNavItemActive = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
  padding: `${vars.space[4]} ${vars.space[6]}`,
  borderRadius: vars.radii.full,
  letterSpacing: vars.letterSpacing.tight,
  backgroundColor: vars.color.brand,
})

export const mobileHireMe = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: `${vars.space[6]} ${vars.space[8]}`,
  backgroundColor: vars.color.brand,
  color: vars.color.dark,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  borderRadius: vars.radii.full,
  textAlign: 'center',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.brandHover,
    },
  },
})

export const desktopOnly = style({
  '@media': {
    '(max-width: 640px)': {
      display: 'none',
    },
  },
})

export const themeToggle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  background: 'none',
  border: 'none',
  borderRadius: vars.radii.full,
  color: vars.color.gray[500],
  cursor: 'pointer',
  transition: vars.transition.fast,
  flexShrink: 0,
  selectors: {
    '&:hover': {
      color: vars.color.dark,
      backgroundColor: vars.color.gray[200],
    },
  },
})

export const mobileRight = style({
  display: 'none',
  alignItems: 'center',
  gap: vars.space[2],
  '@media': {
    '(max-width: 640px)': {
      display: 'flex',
    },
  },
})
