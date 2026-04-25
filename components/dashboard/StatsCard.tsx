'use client'

import { CheckIn } from '@/types'
import { thisWeeksCheckins } from '@/lib/streak'

type Props = { checkins: CheckIn[] }

export function StatsCard({ checkins }: Props) {
  if (checkins.length === 0) return null

  const thisWeek = thisWeeksCheckins(checkins).length

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const last30 = checkins.filter(
    (c) => new Date(c.created_at) >= thirtyDaysAgo
  )
  const blockersLast30 = last30.filter((c) => c.blockers && c.blockers.trim()).length
  const blockerRate = last30.length > 0
    ? Math.round((blockersLast30 / last30.length) * 100)
    : 0

  const stats = [
    { label: 'Total check-ins', value: checkins.length },
    { label: 'This week', value: thisWeek },
    { label: 'Blocker rate', value: `${blockerRate}%` },
  ]

  return (
    <div className="stats-card">
      {stats.map((s, i) => (
        <div key={i} className="stat-row">
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
