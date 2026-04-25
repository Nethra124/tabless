'use client'

import { CheckIn } from '@/types'
import { calculateStreak, thisWeeksCheckins } from '@/lib/streak'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

type Props = { checkins: CheckIn[] }

export function StreakTracker({ checkins }: Props) {
  const streak = calculateStreak(checkins)
  const weekEntries = thisWeeksCheckins(checkins)

  // Build Mon–Sun completion map for this week
  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1
  const todayIdx = dayOfWeek

  const weekDays = DAYS.map((label, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - todayIdx + i)
    const dateStr = d.toISOString().split('T')[0]
    const done = weekEntries.some(
      (c) => new Date(c.created_at).toISOString().split('T')[0] === dateStr
    )
    const isToday = i === todayIdx
    const isFuture = i > todayIdx
    return { label, done, isToday, isFuture }
  })

  return (
    <div className="streak-tracker">
      <div className="streak-header">
        <span className="streak-num">{streak}</span>
        <span className="streak-label">day streak</span>
      </div>

      <div className="streak-days">
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={[
              'streak-day',
              day.done ? 'done' : '',
              day.isToday ? 'today' : '',
              day.isFuture ? 'future' : '',
            ].join(' ')}
            title={DAYS[i]}
          >
            {day.done ? (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
                stroke="currentColor" strokeWidth="2">
                <polyline points="2,6 5,9 10,3" />
              </svg>
            ) : (
              <span>{day.label}</span>
            )}
          </div>
        ))}
      </div>

      <p className="streak-sub">
        {streak === 0
          ? 'Start your streak today'
          : streak < 7
          ? `${7 - streak} days to a full week`
          : 'Full week — keep it up'}
      </p>
    </div>
  )
}
