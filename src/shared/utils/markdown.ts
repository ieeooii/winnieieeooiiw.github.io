export function getTableValue(content: string, key: string): string {
  for (const line of content.split('\n')) {
    const match = line.match(new RegExp(`^\\|\\s*${key}\\s*\\|\\s*(.+?)\\s*\\|`))
    if (match) return match[1].trim()
  }
  return ''
}

export function getPeriodStart(period: string): number {
  const match = period.match(/(\d{4})\.(\d{2})/)
  if (!match) return 0
  return parseInt(match[1]) * 100 + parseInt(match[2])
}
