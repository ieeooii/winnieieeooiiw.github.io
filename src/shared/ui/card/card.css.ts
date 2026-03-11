import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '../../styles/tokens.css'

const base = style({
  borderRadius: vars.radii.xl,
  overflow: 'hidden',
})

export const card = styleVariants({
  // Project card — image + info
  project: [
    base,
    {
      display: 'flex',
      flexDirection: 'column',
      gap: vars.space[6],
      backgroundColor: 'transparent',
      transition: `transform ${vars.transition.slow}`,
      ':hover': {
        // handled via .imageWrap img
      },
    },
  ],

  // Small badge/trust card
  badge: [
    base,
    {
      padding: vars.space[4],
      backgroundColor: vars.color.gray[50],
      border: `1px solid ${vars.color.gray[100]}`,
      textAlign: 'center',
      width: '6rem',
    },
  ],

  // CTA promo card inside project grid
  cta: [
    base,
    {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: vars.space[12],
      backgroundColor: vars.color.brand,
      textAlign: 'center',
    },
  ],
})

export const cardImageWrap = style({
  borderRadius: vars.radii.xl,
  overflow: 'hidden',
  backgroundColor: vars.color.white,
  boxShadow: vars.shadow.card,

  selectors: {
    [`${card.project}:hover &`]: {
      // noop — hover handled on img
    },
  },
})

export const cardImage = style({
  width: '100%',
  height: 'auto',
  transition: `transform ${vars.transition.slow}`,

  selectors: {
    [`${card.project}:hover &`]: {
      transform: 'scale(1.02)',
    },
  },
})

export const cardBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})
