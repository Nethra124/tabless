import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CheckInForm } from '@/components/checkin/CheckInForm'
import { StreakTracker } from '@/components/dashboard/StreakTracker'
import { EntryHistory } from '@/components/dashboard/EntryHistory'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { BlockerTrends } from '@/components/dashboard/BlockerTrends'
import { hasCheckedInToday } from '@/lib/streak'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CheckIn } from '@/types'

export default async function DashboardPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  let user
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    redirect('/auth/login')
  }
  if (!user) redirect('/auth/login')

  const { data: checkins } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(90)

  const allCheckins = (checkins ?? []) as CheckIn[]
  const alreadyDone = hasCheckedInToday(allCheckins)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recent = allCheckins.filter(
    (c) => new Date(c.created_at) >= thirtyDaysAgo
  )
  const blockerEntries = recent.filter((c) => c.blockers && c.blockers.trim())

  return (
    <main className="dashboard">
      <header className="dash-header">
        <span className="logo">tabless</span>
        <div className="dash-header-right">
          <ThemeToggle />
          <a href="/auth/signout" className="btn-ghost">Sign out</a>
        </div>
      </header>

      <div className="dash-body">
        <aside className="dash-sidebar">
          <StreakTracker checkins={allCheckins} />
          <StatsCard checkins={allCheckins} />
        </aside>

        <section className="dash-main">

          {allCheckins.length === 0 ? (
            <div className="empty-first-run">
              <p className="empty-title">Welcome to tabless.</p>
              <p className="empty-body">
                Three questions, once a day. Start your first check-in below
                and begin your streak.
              </p>
              <div className="empty-divider" />
              <CheckInForm />
            </div>
          ) : alreadyDone ? (
            <div className="done-banner">
              <p>✓ Done for today. See you tomorrow.</p>
            </div>
          ) : (
            <>
              <h2 className="section-title">Today's standup</h2>
              <CheckInForm />
            </>
          )}

          {blockerEntries.length > 0 && (
            <div>
              <h2 className="section-title">
                Blocker patterns
                <span className="section-sub">last 30 days</span>
              </h2>
              <BlockerTrends checkins={recent} />
            </div>
          )}

          <div className="history-section">
            <h2 className="section-title">
              Recent entries
              {allCheckins.length > 0 && (
                <span className="section-sub">{allCheckins.length} total</span>
              )}
            </h2>
            {allCheckins.length === 0 ? (
              <div className="empty-history">
                <p>Your entries will appear here after your first check-in.</p>
              </div>
            ) : (
              <EntryHistory checkins={allCheckins.slice(0, 20)} />
            )}
          </div>

        </section>
      </div>
    </main>
  )
}
