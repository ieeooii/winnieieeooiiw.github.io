export function getTableValue(content: string, key: string): string {
  for (const line of content.split('\n')) {
    const match = line.match(new RegExp(`^\\|\\s*${key}\\s*\\|\\s*(.+?)\\s*\\|`))
    if (match) return match[1].trim()
  }
  return ''
}

export function getPeriodEnd(period: string): number {
  const matches = [...period.matchAll(/(\d{4})\.(\d{2})/g)]
  const last = matches[matches.length - 1]
  if (!last) return 0
  return parseInt(last[1]) * 100 + parseInt(last[2])
}
