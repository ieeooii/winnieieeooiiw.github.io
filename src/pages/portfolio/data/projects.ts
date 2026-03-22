import { getTableValue, getPeriodEnd } from '../../../shared/utils'
import type { Lang } from '../../../shared/i18n'

const rawFilesKo = import.meta.glob<string>('/project/ko/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const rawFilesEn = import.meta.glob<string>('/project/en/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const koFiles = rawFilesKo

export type Project = {
  id: string
  title: string
  company: string
  category: string
  period: string
  stack: string[]
  thumbnail: string | null
  gradient: string | null
  rawContent: string
}

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return { data: {}, content: raw }
  const data: Record<string, string> = {}
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return
    const key = line.slice(0, colonIdx).trim()
    const val = line.slice(colonIdx + 1).trim()
    if (key) data[key] = val
  })
  return { data, content: raw.slice(match[0].length) }
}

function parseProject(path: string, raw: string): Project {
  const { data, content } = parseFrontmatter(raw)
  const titleLine = content.split('\n').find(l => l.startsWith('# '))
  const title = titleLine ? titleLine.slice(2).trim() : ''
  const id = path.split('/').pop()!.replace('.md', '').replace(/^\d{6}-/, '')
  const company = getTableValue(content, '회사') || getTableValue(content, 'Company')
  const category = getTableValue(content, '카테고리') || getTableValue(content, 'Category')
  const period = getTableValue(content, '개발 기간') || getTableValue(content, 'Period')
  const stackRaw = getTableValue(content, '기술 스택') || getTableValue(content, 'Tech Stack') || getTableValue(content, 'Stack')
  const stack = stackRaw.split(',').map(s => s.trim()).filter(Boolean)
  const thumbnail = data['thumbnail'] ?? null
  const gradient = data['gradient'] ?? null

  return { id, title, company, category, period, stack, thumbnail, gradient, rawContent: content }
}

export function getProjects(lang: Lang = 'ko'): Project[] {
  return Object.entries(koFiles)
    .map(([path, koContent]) => {
      const enKey = path.replace('/project/ko/', '/project/en/')
      const content = lang === 'en' ? (rawFilesEn[enKey] ?? koContent) : koContent
      return parseProject(path, content)
    })
    .sort((a, b) => getPeriodEnd(b.period) - getPeriodEnd(a.period))
}

// Keep PROJECTS as a convenience export (Korean default)
export const PROJECTS = getProjects('ko')
