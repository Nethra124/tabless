'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Mode = 'password' | 'magic'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicSent, setMagicSent] = useState(false)

  async function handlePasswordLogin() {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  async function handleMagicLink() {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMagicSent(true)
    setLoading(false)
  }

  if (magicSent) {
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
            We sent a magic link to <strong>{email}</strong>.<br />
            Click it to sign in — no password needed.
          </p>
          <button className="btn-ghost auth-back" onClick={() => setMagicSent(false)}>
            ← Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="landing-logo auth-logo">tabless</Link>
        <p className="auth-sub">Sign in to your account</p>

        {/* Mode toggle */}
        <div className="auth-mode-toggle">
          <button
            className={`auth-mode-btn ${mode === 'password' ? 'active' : ''}`}
            onClick={() => { setMode('password'); setError(null) }}
          >
            Password
          </button>
          <button
            className={`auth-mode-btn ${mode === 'magic' ? 'active' : ''}`}
            onClick={() => { setMode('magic'); setError(null) }}
          >
            Magic link
          </button>
        </div>

        <div className="auth-fields">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (mode === 'password' ? handlePasswordLogin() : handleMagicLink())}
              autoFocus
            />
          </div>

          {mode === 'password' && (
            <div className="auth-field">
              <div className="auth-field-header">
                <label htmlFor="password">Password</label>
                <Link href="/auth/forgot-password" className="auth-forgot">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
              />
            </div>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        {mode === 'password' ? (
          <button
            className="btn-primary"
            onClick={handlePasswordLogin}
            disabled={loading || !email || !password}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleMagicLink}
            disabled={loading || !email}
          >
            {loading ? 'Sending...' : 'Send magic link'}
          </button>
        )}

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link href="/auth/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  )
}
