import { style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'
export { container } from '../../../shared/styles/layout.css'

export const section = style({
  paddingTop: vars.space[24],
  paddingBottom: vars.space[24],
  backgroundColor: vars.color.gray[100],
})


export const sectionTitle = style({
  fontSize: 'clamp(2rem, 5vw, 3rem)',
  fontWeight: vars.fontWeight.bold,
  marginBottom: vars.space[16],
  lineHeight: vars.lineHeight.tight,
})

export const titleItalic = style({
  fontWeight: vars.fontWeight.normal,
  fontStyle: 'italic',
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))',
  gap: vars.space[12],
})

export const projectCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
})

export const imageWrap = style({
  overflow: 'hidden',
  height: '220px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space[6],
})

export const image = style({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  transition: `transform ${vars.transition.slow}`,

  selectors: {
    [`${projectCard}:hover &`]: {
      transform: 'scale(1.02)',
    },
  },
})

export const projectInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const projectTitle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  letterSpacing: vars.letterSpacing.tight,
})

export const tagRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
})

// CTA card inside grid
export const ctaCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space[12],
  backgroundColor: vars.color.brand,
  borderRadius: vars.radii.xl,
  textAlign: 'center',
  gap: vars.space[6],
  cursor: 'pointer',
  transition: `transform ${vars.transition.slow}`,
  selectors: {
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
})

export const ctaText = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.snug,
})
