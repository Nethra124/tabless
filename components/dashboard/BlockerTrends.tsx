'use client'

import { CheckIn } from '@/types'

type Props = { checkins: CheckIn[] }

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function BlockerTrends({ checkins }: Props) {
  // Count blockers by day of week (0=Mon ... 6=Sun)
  const counts = Array(7).fill(0)
  const totals = Array(7).fill(0)

  checkins.forEach((c) => {
    const d = new Date(c.created_at)
    const dow = d.getDay() === 0 ? 6 : d.getDay() - 1 // Mon=0
    totals[dow]++
    if (c.blockers && c.blockers.trim()) counts[dow]++
  })

  const max = Math.max(...counts, 1)

  // Extract top keywords from blocker text
  const allBlockerText = checkins
    .filter((c) => c.blockers && c.blockers.trim())
    .map((c) => c.blockers!.toLowerCase())
    .join(' ')

  const stopWords = new Set([
    'a','an','the','and','or','but','in','on','at','to','for',
    'of','with','is','i','my','me','it','this','that','still',
    'not','no','any','some','was','are','be','been','have','has',
    'from','so','we','by','as','if','its','can','do','get','got',
    'just','also','need','waiting','on','am','very','bit','too',
  ])

  const wordCounts: Record<string, number> = {}
  allBlockerText
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w))
    .forEach((w) => { wordCounts[w] = (wordCounts[w] ?? 0) + 1 })

  const topKeywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const totalWithBlockers = checkins.filter(
    (c) => c.blockers && c.blockers.trim()
  ).length

  return (
    <div className="blocker-trends">

      {/* Summary line */}
      <p className="blocker-summary">
        {totalWithBlockers} of {checkins.length} check-ins had a blocker in the last 30 days.
      </p>

      {/* Bar chart by day */}
      <div className="blocker-chart">
        {DAY_LABELS.map((day, i) => (
          <div key={i} className="blocker-col">
            <div className="blocker-bar-track">
              <div
                className="blocker-bar-fill"
                style={{ height: `${(counts[i] / max) * 100}%` }}
              />
            </div>
            <span className="blocker-day">{day}</span>
            <span className="blocker-count">{counts[i]}</span>
          </div>
        ))}
      </div>

      {/* Top keywords */}
      {topKeywords.length > 0 && (
        <div className="blocker-keywords">
          <p className="blocker-keywords-label">Common themes</p>
          <div className="blocker-chips">
            {topKeywords.map(([word, count]) => (
              <span key={word} className="blocker-chip">
                {word} <span className="chip-count">{count}×</span>
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
