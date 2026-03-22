import { style } from '@vanilla-extract/css'
import { vars } from '../../../shared/styles/tokens.css'
export { markdownBody } from '../../../shared/styles/markdown.css'

export const page = style({
  minHeight: '100vh',
  backgroundColor: vars.color.gray[100],
  paddingTop: vars.layout.navbarHeight,
})

// ── Grid page ─────────────────────────────────────────────────────────────────

export const gridContainer = style({
  maxWidth: '1920px',
  margin: '0 auto',
  padding: `0 ${vars.space[8]}`,
  paddingTop: vars.space[20],
  paddingBottom: vars.space[24],
  '@media': {
    '(max-width: 640px)': {
      padding: `${vars.space[8]} ${vars.space[6]} ${vars.space[16]}`,
    },
  },
})

export const gridHeader = style({
  marginBottom: '12rem',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space[8],
  '@media': {
    '(max-width: 640px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
})

export const gridSubtitle = style({
  fontSize: vars.fontSize.lg,
  color: vars.color.gray[700],
  lineHeight: vars.lineHeight.relaxed,
  maxWidth: '500px',
  paddingTop: vars.space[2],
})

export const gridTitle = style({
  fontSize: 'clamp(4rem, 10vw, 7rem)',
  fontWeight: vars.fontWeight.medium,
  letterSpacing: vars.letterSpacing.tighter,
  lineHeight: vars.lineHeight.none,
  color: vars.color.dark,
})


export const filterRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  marginBottom: vars.space[4],
})

export const filterRowLast = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  marginBottom: vars.space[24],
  alignItems: 'center',
})

export const noResults = style({
  gridColumn: '1 / -1',
  textAlign: 'center',
  color: vars.color.gray[400],
  fontSize: vars.fontSize.base,
  paddingTop: vars.space[16],
})

const filterBase = style({
  padding: `${vars.space[2]} ${vars.space[4]}`,
  borderRadius: vars.radii.full,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.medium,
  cursor: 'pointer',
  border: 'none',
  transition: vars.transition.fast,
})

export const filterTag = style([filterBase, {
  backgroundColor: vars.color.white,
  color: vars.color.gray[500],
  selectors: {
    '&:hover': {
      borderColor: vars.color.dark,
      color: vars.color.dark,
    },
  },
}])

export const filterTagActive = style([filterBase, {
  backgroundColor: vars.color.dark,
  borderColor: vars.color.dark,
  color: vars.color.white,
}])

export const projectGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  columnGap: vars.space[16],
  rowGap: vars.space[12],
  '@media': {
    '(max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '(max-width: 580px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const projectCard = style({
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
})

export const cardThumb = style({
  aspectRatio: '3 / 2',
  marginBottom: vars.space[6],
  overflow: 'hidden',
  position: 'relative',
  padding: vars.space[6],
  transition: 'transform 0.5s ease',
  selectors: {
    [`${projectCard}:hover &`]: {
      transform: 'scale(1.02)',
    },
  },
})

export const cardThumbImg = style({
  position: 'absolute',
  top: '50%',
  left: vars.space[6],
  right: vars.space[6],
  transform: 'translateY(-50%)',
  height: '260px',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  borderRadius: vars.radii.lg,
  overflow: 'hidden',
})

export const cardTitle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
  marginBottom: vars.space[4],
  lineHeight: vars.lineHeight.snug,
})

export const cardTagRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  marginBottom: vars.space[2],
  selectors: {
    '&:last-child': { marginBottom: 0 },
  },
})


// ── Figure / image caption ────────────────────────────────────────────────────

export const figure = style({
  margin: `${vars.space[8]} auto`,
  maxWidth: '680px',
})

export const figureImg = style({
  width: 'auto',
  maxWidth: '100%',
  maxHeight: '480px',
  height: 'auto',
  borderRadius: vars.radii.lg,
  display: 'block',
  margin: '0 auto',
})

export const figureCaption = style({
  marginTop: vars.space[2],
  fontSize: vars.fontSize.sm,
  color: vars.color.gray[400],
  textAlign: 'center',
})

// ── Detail page ───────────────────────────────────────────────────────────────

export const detailContainer = style({
  maxWidth: '900px',
  margin: '0 auto',
  padding: `${vars.space[24]} ${vars.space[8]} ${vars.space[24]}`,
  '@media': {
    '(max-width: 640px)': {
      padding: `${vars.space[6]} ${vars.space[6]} ${vars.space[16]}`,
    },
  },
})

export const saasNotice = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  marginBottom: vars.space[8],
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radii.md,
  backgroundColor: vars.color.brandMuted,
  fontSize: vars.fontSize.sm,
  color: vars.color.gray[700],
})

export const projectNav = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space[4],
  marginTop: vars.space[16],
  paddingTop: vars.space[8],
  borderTop: `1px solid ${vars.color.gray[200]}`,
})

export const projectNavBtn = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[1],
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  padding: `${vars.space[3]} 0`,
  maxWidth: '45%',
  transition: vars.transition.fast,
  selectors: {
    '&:hover': { opacity: 0.6 },
  },
})

export const projectNavBtnNext = style({
  alignItems: 'flex-end',
  textAlign: 'right',
})

export const projectNavLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: vars.letterSpacing.wider,
  textTransform: 'uppercase',
  color: vars.color.gray[400],
})

export const projectNavTitle = style({
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.dark,
  lineHeight: vars.lineHeight.snug,
})

export const backButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  color: vars.color.gray[500],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  marginBottom: vars.space[8],
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  padding: 0,
  transition: vars.transition.fast,
  selectors: {
    '&:hover': { color: vars.color.dark },
  },
})

// ── Legacy layout (unused but kept) ──────────────────────────────────────────

export const layout = style({
  maxWidth: '1920px',
  margin: '0 auto',
  padding: `0 ${vars.space[8]}`,
  display: 'grid',
  gridTemplateColumns: '260px 1fr',
  gap: vars.space[12],
  alignItems: 'start',
  paddingTop: vars.space[16],
  paddingBottom: vars.space[24],
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr',
      paddingTop: vars.space[8],
    },
  },
})

// ── Sidebar ──────────────────────────────────────────────────────────────────

export const sidebar = style({
  position: 'sticky',
  top: '96px',
  '@media': {
    '(max-width: 900px)': {
      position: 'static',
    },
  },
})

export const sidebarTitle = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: vars.letterSpacing.wider,
  textTransform: 'uppercase',
  color: vars.color.gray[400],
  marginBottom: vars.space[3],
})

export const navList = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const navItem = style({
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radii.md,
  cursor: 'pointer',
  transition: vars.transition.fast,
  color: vars.color.gray[500],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  lineHeight: vars.lineHeight.snug,
  border: 'none',
  background: 'none',
  width: '100%',
  textAlign: 'left',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.gray[200],
      color: vars.color.gray[700],
    },
  },
})

export const navItemActive = style({
  backgroundColor: vars.color.white,
  color: vars.color.dark,
  fontWeight: vars.fontWeight.semibold,
  boxShadow: vars.shadow.sm,
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.white,
    },
  },
})

// ── Content ───────────────────────────────────────────────────────────────────

export const content = style({
  minWidth: 0,
})

export const projectHeader = style({
  marginBottom: vars.space[8],
})

export const company = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: vars.letterSpacing.wider,
  textTransform: 'uppercase',
  color: vars.color.brand,
  marginBottom: vars.space[2],
})

export const projectTitle = style({
  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
  fontWeight: vars.fontWeight.bold,
  letterSpacing: vars.letterSpacing.tight,
  lineHeight: vars.lineHeight.tight,
  color: vars.color.dark,
  marginBottom: vars.space[6],
})

export const metaTable = style({
  borderCollapse: 'collapse',
  width: '100%',
  marginBottom: vars.space[8],
  fontSize: vars.fontSize.sm,
})

export const metaRow = style({
  borderBottom: `1px solid ${vars.color.gray[200]}`,
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
})

export const metaLabel = style({
  padding: `${vars.space[3]} ${vars.space[4]} ${vars.space[3]} 0`,
  color: vars.color.gray[400],
  fontWeight: vars.fontWeight.medium,
  whiteSpace: 'nowrap',
  width: '100px',
  verticalAlign: 'top',
})

export const metaValue = style({
  padding: `${vars.space[3]} 0`,
  color: vars.color.gray[700],
  lineHeight: vars.lineHeight.normal,
})

export const stackList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  listStyle: 'none',
  padding: 0,
  margin: 0,
})

export const stackChip = style({
  backgroundColor: vars.color.gray[200],
  color: vars.color.gray[700],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.medium,
  padding: `2px ${vars.space[2]}`,
  borderRadius: vars.radii.sm,
  fontFamily: vars.font.mono,
})

// ── Description ───────────────────────────────────────────────────────────────

export const descSection = style({
  marginBottom: vars.space[8],
})

export const descList = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const descItem = style({
  paddingLeft: vars.space[4],
  borderLeft: `2px solid ${vars.color.brand}`,
  color: vars.color.gray[700],
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.relaxed,
})

// ── Implementations ────────────────────────────────────────────────────────────

export const implSection = style({
  marginBottom: vars.space[8],
})

export const sectionHeading = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
  marginBottom: vars.space[6],
  paddingBottom: vars.space[3],
  borderBottom: `1px solid ${vars.color.gray[200]}`,
})

export const implCard = style({
  backgroundColor: vars.color.white,
  borderRadius: vars.radii.lg,
  padding: vars.space[6],
  marginBottom: vars.space[4],
  boxShadow: vars.shadow.card,
})

export const implTitle = style({
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
  marginBottom: vars.space[4],
})

export const implRow = style({
  display: 'grid',
  gridTemplateColumns: '80px 1fr',
  gap: `${vars.space[2]} ${vars.space[4]}`,
  marginBottom: vars.space[3],
  alignItems: 'start',
  selectors: {
    '&:last-child': {
      marginBottom: 0,
    },
  },
})

export const implLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: vars.letterSpacing.wide,
  textTransform: 'uppercase',
  paddingTop: '3px',
})

export const implLabelProblem = style({
  color: vars.color.semantic.problem,
})

export const implLabelSolve = style({
  color: vars.color.brand,
})

export const implLabelResult = style({
  color: vars.color.semantic.result,
})

export const implLabelInsight = style({
  color: vars.color.gray[400],
})

export const implText = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.gray[700],
  lineHeight: vars.lineHeight.relaxed,
})

export const implBulletList = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const implBullet = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.gray[700],
  lineHeight: vars.lineHeight.relaxed,
  paddingLeft: vars.space[4],
  position: 'relative',
  selectors: {
    '&::before': {
      content: '"—"',
      position: 'absolute',
      left: 0,
      color: vars.color.gray[300],
    },
  },
})

// ── Retrospective ─────────────────────────────────────────────────────────────

export const retroSection = style({
  marginBottom: vars.space[8],
})

export const retroCard = style({
  backgroundColor: vars.color.gray[200],
  borderRadius: vars.radii.lg,
  padding: vars.space[6],
})

export const retroList = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const retroItem = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.gray[700],
  lineHeight: vars.lineHeight.relaxed,
  paddingLeft: vars.space[4],
  position: 'relative',
  selectors: {
    '&::before': {
      content: '"•"',
      position: 'absolute',
      left: 0,
      color: vars.color.gray[400],
    },
  },
})
