const rawFiles = import.meta.glob<string>('/project/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export type Project = {
  id: string
  title: string
  company: string
  category: string
  period: string
  stack: string[]
  rawContent: string
}

function getTableValue(content: string, key: string): string {
  for (const line of content.split('\n')) {
    const match = line.match(new RegExp(`^\\|\\s*${key}\\s*\\|\\s*(.+?)\\s*\\|`))
    if (match) return match[1].trim()
  }
  return ''
}

function getPeriodStart(period: string): number {
  const match = period.match(/(\d{4})\.(\d{2})/)
  if (!match) return 0
  return parseInt(match[1]) * 100 + parseInt(match[2])
}

function parseProject(path: string, content: string): Project {
  const titleLine = content.split('\n').find(l => l.startsWith('# '))
  const title = titleLine ? titleLine.slice(2).trim() : ''
  const id = path.split('/').pop()!.replace('.md', '').replace(/^\d{6}-/, '')
  const company = getTableValue(content, '회사')
  const category = getTableValue(content, '카테고리')
  const period = getTableValue(content, '개발 기간')
  const stackRaw = getTableValue(content, '기술 스택')
  const stack = stackRaw.split(',').map(s => s.trim()).filter(Boolean)

  return { id, title, company, category, period, stack, rawContent: content }
}

export const PROJECTS: Project[] = Object.entries(rawFiles)
  .map(([path, content]) => parseProject(path, content))
  .sort((a, b) => getPeriodStart(b.period) - getPeriodStart(a.period))
