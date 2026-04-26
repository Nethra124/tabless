'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleReset() {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon auth-icon-teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-sub">
            We sent a password reset link to <strong>{email}</strong>.<br />
            Click it to choose a new password.
          </p>
          <Link href="/auth/login" className="btn-ghost auth-back">
            ← Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="landing-logo auth-logo">tabless</Link>
        <h1 className="auth-title">Reset your password</h1>
        <p className="auth-sub">
          Enter your email and we'll send you a link to choose a new password.
        </p>

        <div className="auth-fields">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReset()}
              autoFocus
            />
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="btn-primary"
          onClick={handleReset}
          disabled={loading || !email}
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>

        <p className="auth-switch">
          <Link href="/auth/login" className="auth-link">← Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
