function getSpainDate(): Date {
  // Spain is UTC+1 (CET) in winter, UTC+2 (CEST) in summer
  const now = new Date()
  const jan = new Date(now.getFullYear(), 0, 1)
  const jul = new Date(now.getFullYear(), 6, 1)
  const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
  const isDST = now.getTimezoneOffset() < stdOffset
  const spainOffset = isDST ? 2 : 1 // UTC+2 summer, UTC+1 winter
  return new Date(now.getTime() + spainOffset * 3600000)
}

export function getDailyPackIndex(totalPacks: number): number {
  const today = getSpainDate()
  const seed = today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate()
  return seed % totalPacks
}

export function getSpainToday(): string {
  const d = getSpainDate()
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
