import { useEffect, useState } from 'react'
import { GlowBlob } from './GlowBlob'
import { BadgeCard } from '../../../shared/ui/badge/BadgeCard'
import * as s from './hero.css'

const WORDS = ['systems', 'architectures', 'AI workflows', 'solutions', 'products', 'experiences']
const TYPE_SPEED = 80
const DELETE_SPEED = 50
const PAUSE_AFTER_TYPE = 1500
const PAUSE_AFTER_DELETE = 400

const BADGES = [
  { label: 'Experience', title: '6+ YRS', sub: 'FRONTEND' },
  { label: 'Projects', title: '20+', sub: 'SHIPPED' },
  { label: 'Focus', title: 'REACT', sub: 'TYPESCRIPT' },
]

export const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const currentWord = WORDS[wordIndex]

  useEffect(() => {
    if (!isDeleting && displayed.length < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length + 1))
      }, TYPE_SPEED)
      return () => clearTimeout(timeout)
    }

    if (!isDeleting && displayed.length === currentWord.length) {
      const timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayed.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length - 1))
      }, DELETE_SPEED)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayed.length === 0) {
      const timeout = setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % WORDS.length)
      }, PAUSE_AFTER_DELETE)
      return () => clearTimeout(timeout)
    }
  }, [displayed, isDeleting, currentWord])

  return (
    <section className={s.section} id="home">
      <GlowBlob />
      <div className={s.container}>
        <div className={s.content}>
          <h1 className={s.heading}>
            <span className={s.headingNoWrap}>Frontend engineer.</span>
            <br />
            I turn problems into{' '}
            <span className={s.headingHighlight}>
              <span
                className={s.headingHighlightText}
                aria-live="polite"
                aria-atomic="true"
              >{displayed}</span>
            </span>
          </h1>

          <div className={s.badgeRow}>
            {BADGES.map(({ label, title, sub }) => (
              <BadgeCard key={label} label={label} title={title} sub={sub} />
            ))}
          </div>
        </div>

        <div className={s.visual} />
        <p className={s.name} aria-hidden="true">WOOJIN LEE</p>
      </div>
    </section>
  )
}
