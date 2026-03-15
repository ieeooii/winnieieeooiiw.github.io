import { useEffect, useState } from 'react'

type UseTypeWriterOptions = {
  typeSpeed?: number
  deleteSpeed?: number
  pauseAfterType?: number
  pauseAfterDelete?: number
}

export const useTypeWriter = (words: string[], options?: UseTypeWriterOptions) => {
  const {
    typeSpeed = 80,
    deleteSpeed = 50,
    pauseAfterType = 1500,
    pauseAfterDelete = 400,
  } = options ?? {}

  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const currentWord = words[wordIndex]

  useEffect(() => {
    if (!isDeleting && displayed.length < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length + 1))
      }, typeSpeed)
      return () => clearTimeout(timeout)
    }

    if (!isDeleting && displayed.length === currentWord.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseAfterType)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayed.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length - 1))
      }, deleteSpeed)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayed.length === 0) {
      const timeout = setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
      }, pauseAfterDelete)
      return () => clearTimeout(timeout)
    }
  }, [displayed, isDeleting, currentWord, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete, words.length])

  return displayed
}
