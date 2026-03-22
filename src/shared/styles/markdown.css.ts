import { globalStyle, style } from '@vanilla-extract/css'
import { vars } from './tokens.css'

export const markdownBody = style({
  color: vars.color.gray[700],
  fontSize: vars.fontSize.lg,
  lineHeight: vars.lineHeight.relaxed,
})

globalStyle(`${markdownBody} h1`, {
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  fontWeight: vars.fontWeight.bold,
  letterSpacing: vars.letterSpacing.tight,
  color: vars.color.dark,
  marginBottom: vars.space[6],
})

globalStyle(`${markdownBody} h2`, {
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
  marginTop: vars.space[12],
  marginBottom: vars.space[6],
  paddingBottom: vars.space[3],
  borderBottom: `1px solid ${vars.color.gray[200]}`,
})

globalStyle(`${markdownBody} h3`, {
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
  marginTop: vars.space[6],
  marginBottom: vars.space[3],
  paddingLeft: vars.space[3],
  borderLeft: `3px solid ${vars.color.brand}`,
})

globalStyle(`${markdownBody} p`, {
  marginBottom: vars.space[4],
  lineHeight: vars.lineHeight.relaxed,
})

globalStyle(`${markdownBody} ul`, {
  listStyle: 'none',
  padding: 0,
  margin: `0 0 ${vars.space[4]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

globalStyle(`${markdownBody} li`, {
  paddingLeft: vars.space[4],
  position: 'relative',
  lineHeight: vars.lineHeight.relaxed,
  fontSize: vars.fontSize.base,
})

globalStyle(`${markdownBody} li::before`, {
  content: '"—"',
  position: 'absolute',
  left: 0,
  color: vars.color.gray[300],
})

globalStyle(`${markdownBody} strong`, {
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.dark,
})

globalStyle(`${markdownBody} table`, {
  borderCollapse: 'collapse',
  width: '100%',
  marginBottom: vars.space[8],
  fontSize: vars.fontSize.sm,
})

globalStyle(`${markdownBody} td`, {
  padding: `${vars.space[3]} ${vars.space[4]} ${vars.space[3]} 0`,
  borderBottom: `1px solid ${vars.color.gray[200]}`,
  verticalAlign: 'top',
  lineHeight: vars.lineHeight.normal,
})

globalStyle(`${markdownBody} th`, {
  padding: `${vars.space[3]} ${vars.space[4]} ${vars.space[3]} 0`,
  borderBottom: `1px solid ${vars.color.gray[200]}`,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.gray[400],
  fontSize: vars.fontSize.xs,
  letterSpacing: vars.letterSpacing.wider,
  textTransform: 'uppercase',
  textAlign: 'left',
  display: 'none',
})

globalStyle(`${markdownBody} td:first-child`, {
  color: vars.color.gray[400],
  fontWeight: vars.fontWeight.medium,
  whiteSpace: 'nowrap',
  width: '100px',
})

globalStyle(`${markdownBody} hr`, {
  border: 'none',
  borderTop: `1px solid ${vars.color.gray[200]}`,
  margin: `${vars.space[8]} 0`,
})

globalStyle(`${markdownBody} a`, {
  color: vars.color.brand,
  textDecoration: 'underline',
})

globalStyle(`${markdownBody} pre`, {
  backgroundColor: '#1e1e2e',
  color: '#cdd6f4',
  borderRadius: vars.radii.lg,
  padding: `${vars.space[5]} ${vars.space[6]}`,
  overflowX: 'auto',
  margin: `${vars.space[4]} 0 ${vars.space[6]}`,
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  fontFamily: vars.font.mono,
})

globalStyle(`${markdownBody} pre code`, {
  background: 'none',
  padding: 0,
  fontSize: 'inherit',
  color: 'inherit',
  borderRadius: 0,
  fontFamily: 'inherit',
})

globalStyle(`${markdownBody} code`, {
  backgroundColor: vars.color.gray[200],
  color: vars.color.dark,
  fontFamily: vars.font.mono,
  fontSize: '0.875em',
  padding: `2px ${vars.space[2]}`,
  borderRadius: vars.radii.sm,
})

globalStyle(`${markdownBody} .img-row-2`, {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[4],
  margin: `${vars.space[8]} 0`,
  alignItems: 'center',
})

globalStyle(`${markdownBody} .img-row-3`, {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: vars.space[4],
  margin: `${vars.space[8]} 0`,
  alignItems: 'center',
})

globalStyle(`${markdownBody} .img-row-2 p, ${markdownBody} .img-row-3 p`, {
  display: 'contents',
  margin: 0,
})

globalStyle(`${markdownBody} .img-row-2 figure, ${markdownBody} .img-row-3 figure`, {
  margin: 0,
  maxWidth: 'none',
})
