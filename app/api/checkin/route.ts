import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
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
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { finished_yesterday, focus_today, blockers } = body

  if (!finished_yesterday || !focus_today) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Prevent double check-in on same day
  const today = new Date().toISOString().split('T')[0]
  const { data: existing } = await supabase
    .from('checkins')
    .select('id')
    .eq('user_id', user.id)
    .gte('created_at', `${today}T00:00:00`)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Already checked in today' }, { status: 409 })
  }

  const { data, error } = await supabase.from('checkins').insert({
    user_id: user.id,
    finished_yesterday,
    focus_today,
    blockers: blockers || null,
  }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ checkin: data }, { status: 201 })
}