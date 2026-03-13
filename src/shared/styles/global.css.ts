import { globalStyle } from '@vanilla-extract/css'
import { vars } from './tokens.css'

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
})

globalStyle('html', {
  scrollBehavior: 'smooth',
})

globalStyle('body', {
  fontFamily: vars.font.body,
  color: vars.color.dark,
  backgroundColor: vars.color.gray[50],
  lineHeight: vars.lineHeight.normal,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
})

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
})

globalStyle('button', {
  fontFamily: vars.font.body,
  cursor: 'pointer',
})

globalStyle('img', {
  maxWidth: '100%',
  height: 'auto',
  display: 'block',
})
