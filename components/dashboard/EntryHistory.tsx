'use client'

import { CheckIn } from '@/types'

type Props = { checkins: CheckIn[] }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function EntryHistory({ checkins }: Props) {
  if (checkins.length === 0) {
    return (
      <div className="empty-state">
        <p>No entries yet. Submit your first standup above.</p>
      </div>
    )
  }

  return (
    <div className="entry-history">
      {checkins.map((entry) => (
        <div key={entry.id} className="history-row">
          <div className="history-meta">
            <span className="history-date">{formatDate(entry.created_at)}</span>
            <div className="history-dot" />
          </div>
          <div className="history-content">
            <div className="history-block">
              <p className="history-q">Finished</p>
              <p className="history-text">{entry.finished_yesterday}</p>
            </div>
            <div className="history-block">
              <p className="history-q">Focus</p>
              <p className="history-text">{entry.focus_today}</p>
            </div>
            {entry.blockers && (
              <div className="history-block blocker">
                <p className="history-q">Blocker</p>
                <p className="history-text">{entry.blockers}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
