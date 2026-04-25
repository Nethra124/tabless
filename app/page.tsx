import Link from 'next/link'

const FEATURES = [
  {
    label: '3 questions',
    desc: "What did you finish? What's your focus? Any blockers? That's it. Done in under 2 minutes.",
  },
  {
    label: 'Streak tracking',
    desc: 'A daily chain of check-ins. Missing a day breaks it. Simple pressure that actually works.',
  },
  {
    label: 'Weekly digest',
    desc: 'Every Sunday, a plain-english summary of your week lands in your inbox. No dashboard required.',
  },
  {
    label: 'Blocker patterns',
    desc: "Your recurring blockers show up in the history log. Patterns you'd never notice become obvious.",
  },
]

const FAQS = [
  {
    q: 'Who is this for?',
    a: 'Freelancers, indie hackers, and remote workers who work alone but want the accountability of a standup without the meeting.',
  },
  {
    q: 'Why not just use Notion or a journal?',
    a: "Because a blank page has no structure, no streak, and no weekly summary. Tabless gives you just enough scaffolding to make the habit stick.",
  },
  {
    q: 'Is there a team version?',
    a: 'Not right now. Tabless is deliberately personal — no shared boards, no notifications to others, no performance dashboards. Just you.',
  },
  {
    q: "What's in the Pro plan?",
    a: 'AI-generated weekly narrative summaries, blocker trend charts, CSV export, and custom check-in questions. $5/month.',
  },
]

export default function LandingPage() {
  return (
    <div className="landing">

      <nav className="landing-nav">
        <span className="landing-logo">tabless</span>
        <Link href="/auth/login" className="nav-cta">Sign in →</Link>
      </nav>

      <section className="hero-section">
        <div className="landing-inner">
          <div className="hero-eyebrow">Async standup · Solo workers</div>
          <h1 className="hero-title">
            Your daily standup,<br />
            <em>without the meeting.</em>
          </h1>
          <p className="hero-sub">
            Three questions. Once a day. A streak that keeps you honest,
            and a weekly digest that shows you where your time actually went.
          </p>
          <div className="hero-actions">
            <Link href="/auth/login" className="btn-hero-primary">Start for free</Link>
            <span className="hero-note">No credit card · Takes 30 seconds</span>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-inner">
          <p className="section-label">How it works</p>
          <div className="steps-grid">
            {['Open Tabless', 'Answer 3 questions', 'Submit and move on', 'Read your Sunday digest'].map((step, i) => (
              <div key={i} className="step-item">
                <span className="step-num">0{i + 1}</span>
                <span className="step-text">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-alt">
        <div className="landing-inner">
          <p className="section-label">What you get</p>
          <div className="features-list">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-row">
                <span className="feature-label">{f.label}</span>
                <span className="feature-desc">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-inner">
          <p className="section-label">Pricing</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <p className="pricing-tier">Free</p>
              <p className="pricing-price">$0<span>/mo</span></p>
              <ul className="pricing-list">
                <li>Unlimited check-ins</li>
                <li>Full entry history</li>
                <li>Streak tracking</li>
                <li>Weekly digest email</li>
              </ul>
              <Link href="/auth/login" className="btn-pricing-free">Get started</Link>
            </div>
            <div className="pricing-card pricing-card-pro">
              <p className="pricing-tier">Pro</p>
              <p className="pricing-price">$5<span>/mo</span></p>
              <ul className="pricing-list">
                <li>Everything in Free</li>
                <li>AI weekly narrative summary</li>
                <li>Blocker trend charts</li>
                <li>CSV + Markdown export</li>
                <li>Custom check-in questions</li>
              </ul>
              <Link href="/auth/login" className="btn-pricing-pro">Start free trial</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-alt">
        <div className="landing-inner">
          <p className="section-label">FAQ</p>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <div key={i} className="faq-row">
                <p className="faq-q">{f.q}</p>
                <p className="faq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="footer-cta">
        <p className="footer-cta-title">Start your first standup today.</p>
        <Link href="/auth/login" className="btn-hero-primary footer-cta-btn">
          Get started free →
        </Link>
      </section>

      <footer className="landing-footer">
        <span className="landing-logo" style={{ fontSize: '13px' }}>tabless</span>
        <span>Built for solo workers who ship.</span>
      </footer>

    </div>
  )
}
