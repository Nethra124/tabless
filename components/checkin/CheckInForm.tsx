'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  { key: 'finished_yesterday', label: 'What did you finish yesterday?' },
  { key: 'focus_today',        label: "What's your main focus today?" },
  { key: 'blockers',           label: 'Any blockers or things on your mind?' },
] as const

type Field = (typeof QUESTIONS)[number]['key']

export function CheckInForm() {
  const supabase = createClient()
  const router = useRouter()

  const [values, setValues] = useState<Record<Field, string>>({
    finished_yesterday: '',
    focus_today: '',
    blockers: '',
  })
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const current = QUESTIONS[step]
  const isLast = step === QUESTIONS.length - 1

  function handleChange(value: string) {
    setValues((prev) => ({ ...prev, [current.key]: value }))
  }

  function handleNext() {
    if (step < QUESTIONS.length - 1) setStep((s) => s + 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in.'); setSubmitting(false); return }

    const { error: insertError } = await supabase.from('checkins').insert({
      user_id: user.id,
      finished_yesterday: values.finished_yesterday,
      focus_today: values.focus_today,
      blockers: values.blockers || null,
    })

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    router.push('/dashboard?submitted=true')
  }

  return (
    <div className="checkin-form">
      <div className="progress">
        {QUESTIONS.map((_, i) => (
          <div key={i} className={`dot ${i <= step ? 'active' : ''}`} />
        ))}
      </div>

      <p className="question-num">{`0${step + 1} / 0${QUESTIONS.length}`}</p>
      <p className="question-text">{current.label}</p>

      <textarea
        className="answer-area"
        value={values[current.key]}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Type your answer..."
        maxLength={280}
        rows={4}
        autoFocus
      />
      <p className="char-count">{values[current.key].length} / 280</p>

      {error && <p className="error">{error}</p>}

      {isLast ? (
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={submitting || !values.focus_today}
        >
          {submitting ? 'Submitting...' : 'Submit standup'}
        </button>
      ) : (
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!values[current.key].trim()}
        >
          Next →
        </button>
      )}
    </div>
  )
}
