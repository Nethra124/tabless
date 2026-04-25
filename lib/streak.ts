import { CheckIn } from '@/types'

/**
 * Returns the current consecutive-day streak from an array of check-ins.
 * Expects check-ins sorted descending by created_at (newest first).
 */
export function calculateStreak(checkins: CheckIn[]): number {
  if (checkins.length === 0) return 0

  const days = checkins.map((c) =>
    new Date(c.created_at).toISOString().split('T')[0]
  )
  const unique = [...new Set(days)] // one entry per day

  let streak = 0
  const today = new Date().toISOString().split('T')[0]
  let cursor = today

  for (const day of unique) {
    if (day === cursor) {
      streak++
      // move cursor back one day
      const d = new Date(cursor)
      d.setDate(d.getDate() - 1)
      cursor = d.toISOString().split('T')[0]
    } else {
      break
    }
  }

  return streak
}

/**
 * Returns true if the user has already checked in today.
 */
export function hasCheckedInToday(checkins: CheckIn[]): boolean {
  const today = new Date().toISOString().split('T')[0]
  return checkins.some(
    (c) => new Date(c.created_at).toISOString().split('T')[0] === today
  )
}

/**
 * Returns check-ins from the current ISO week (Mon–Sun).
 */
export function thisWeeksCheckins(checkins: CheckIn[]): CheckIn[] {
  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1 // Mon=0
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek)
  monday.setHours(0, 0, 0, 0)

  return checkins.filter((c) => new Date(c.created_at) >= monday)
}
