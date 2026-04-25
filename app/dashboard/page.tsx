import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CheckInForm } from '@/components/checkin/CheckInForm'
import { StreakTracker } from '@/components/dashboard/StreakTracker'
import { EntryHistory } from '@/components/dashboard/EntryHistory'
import { hasCheckedInToday } from '@/lib/streak'
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: checkins } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const allCheckins = (checkins ?? []) as CheckIn[]
  const alreadyDone = hasCheckedInToday(allCheckins)

  return (
    <main className="dashboard">
      <header className="dash-header">
        <span className="logo">tabless</span>
        <form action="/auth/signout" method="post">
          <button type="submit" className="btn-ghost">Sign out</button>
        </form>
      </header>

      <div className="dash-body">
        <aside className="dash-sidebar">
          <StreakTracker checkins={allCheckins} />
        </aside>

        <section className="dash-main">
          {alreadyDone ? (
            <div className="done-banner">
              <p>Done for today. See you tomorrow.</p>
            </div>
          ) : (
            <>
              <h2>Today's standup</h2>
              <CheckInForm />
            </>
          )}

          <div className="history-section">
            <h3>Recent entries</h3>
            <EntryHistory checkins={allCheckins} />
          </div>
        </section>
      </div>
    </main>
  )
}