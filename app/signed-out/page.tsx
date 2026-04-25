import Link from 'next/link'

export default function SignedOutPage() {
  return (
    <div className="signout-page">

      <nav className="landing-nav">
        <Link href="/" className="landing-logo">tabless</Link>
      </nav>

      <div className="signout-body">
        <div className="signout-card">

          <div className="signout-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>

          <h1 className="signout-title">You've been signed out</h1>
          <p className="signout-sub">
            Your streak is saved. Come back tomorrow to keep it going.
          </p>

          <div className="signout-actions">
            <Link href="/auth/login" className="btn-hero-primary">
              Sign back in
            </Link>
            <Link href="/" className="signout-home-link">
              Back to homepage →
            </Link>
          </div>

          <div className="signout-divider" />

          <div className="signout-links">
            <p className="signout-links-label">While you're here</p>
            <div className="signout-link-grid">
              <Link href="/#pricing" className="signout-link-item">
                <span className="signout-link-title">Upgrade to Pro</span>
                <span className="signout-link-desc">AI summaries, trend charts, and exports for $5/mo</span>
              </Link>
              <Link href="/#how-it-works" className="signout-link-item">
                <span className="signout-link-title">How it works</span>
                <span className="signout-link-desc">Three questions. Once a day. That's the whole ritual.</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      <footer className="landing-footer">
        <span style={{ fontSize: '13px', fontWeight: 500 }}>tabless</span>
        <span>Built for solo workers who ship.</span>
      </footer>

    </div>
  )
}
