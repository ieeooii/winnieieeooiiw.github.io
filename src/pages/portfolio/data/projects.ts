import { getTableValue, getPeriodStart } from '../../../shared/utils'
import type { Lang } from '../../../shared/i18n'

const rawFilesKo = import.meta.glob<string>('/project/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const rawFilesEn = import.meta.glob<string>('/project/*.en.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Filter out .en.md files from the base ko map
const koFiles = Object.fromEntries(
  Object.entries(rawFilesKo).filter(([p]) => !p.endsWith('.en.md'))
)

export type Project = {
  id: string
  title: string
  company: string
  category: string
  period: string
  stack: string[]
  rawContent: string
}

function parseProject(path: string, content: string): Project {
  const titleLine = content.split('\n').find(l => l.startsWith('# '))
  const title = titleLine ? titleLine.slice(2).trim() : ''
  const id = path.split('/').pop()!.replace('.md', '').replace(/^\d{6}-/, '')
  const company = getTableValue(content, '회사') || getTableValue(content, 'Company')
  const category = getTableValue(content, '카테고리') || getTableValue(content, 'Category')
  const period = getTableValue(content, '개발 기간') || getTableValue(content, 'Period')
  const stackRaw = getTableValue(content, '기술 스택') || getTableValue(content, 'Stack')
  const stack = stackRaw.split(',').map(s => s.trim()).filter(Boolean)

  return { id, title, company, category, period, stack, rawContent: content }
}

export function getProjects(lang: Lang = 'ko'): Project[] {
  return Object.entries(koFiles)
    .map(([path, koContent]) => {
      const enKey = path.replace('.md', '.en.md')
      const content = lang === 'en' ? (rawFilesEn[enKey] ?? koContent) : koContent
      return parseProject(path, content)
    })
    .sort((a, b) => getPeriodStart(b.period) - getPeriodStart(a.period))
}

// Keep PROJECTS as a convenience export (Korean default)
export const PROJECTS = getProjects('ko')
