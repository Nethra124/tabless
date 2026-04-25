import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { calculateStreak, thisWeeksCheckins } from '@/lib/streak'
import { CheckIn } from '@/types'

// Called by Vercel Cron every Sunday at 6pm UTC
// vercel.json: { "crons": [{ "path": "/api/digest", "schedule": "0 18 * * 0" }] }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email')

  if (!profiles) return NextResponse.json({ sent: 0 })

  let sent = 0

  for (const profile of profiles) {
    const { data: checkins } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(30)

    if (!checkins || checkins.length === 0) continue

    const weekEntries = thisWeeksCheckins(checkins as CheckIn[])
    if (weekEntries.length === 0) continue

    const streak = calculateStreak(checkins as CheckIn[])
    const html = buildDigestHtml(profile.email, weekEntries as CheckIn[], streak)

    await resend.emails.send({
      from: 'Tabless <digest@tabless.app>',
      to: profile.email,
      subject: `Your week in review · ${weekLabel()}`,
      html,
    })

    sent++
  }

  return NextResponse.json({ sent })
}

function weekLabel() {
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - 6)
  return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
}

function buildDigestHtml(email: string, entries: CheckIn[], streak: number) {
  const rows = entries
    .slice(0, 5)
    .map((e) => {
      const date = new Date(e.created_at).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'short',
      })
      return `
        <div style="margin-bottom:12px;padding:12px 14px;background:#f7f7f5;border-radius:8px;">
          <p style="margin:0 0 4px;font-size:11px;color:#888;">${date}</p>
          <p style="margin:0 0 4px;font-size:13px;color:#111;">
            <strong>Shipped:</strong> ${e.finished_yesterday}
          </p>
          ${e.blockers ? `<p style="margin:0;font-size:13px;color:#b45309;"><strong>Blocker:</strong> ${e.blockers}</p>` : ''}
        </div>`
    })
    .join('')

  return `
    <div style="max-width:520px;margin:0 auto;font-family:system-ui,sans-serif;color:#111;">
      <div style="background:#534AB7;padding:24px;border-radius:12px 12px 0 0;">
        <p style="margin:0;font-size:16px;font-weight:500;color:#EEEDFE;">tabless</p>
        <p style="margin:4px 0 0;font-size:12px;color:#AFA9EC;">Your week in review · ${weekLabel()}</p>
      </div>
      <div style="padding:24px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;">
        <p style="font-size:14px;line-height:1.6;margin:0 0 20px;">
          You checked in ${entries.length} time${entries.length !== 1 ? 's' : ''} this week and your current streak is <strong>${streak} days</strong>.
        </p>
        <p style="font-size:11px;font-weight:500;color:#888;letter-spacing:0.05em;margin:0 0 10px;">WHAT YOU SHIPPED</p>
        ${rows}
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        <p style="font-size:11px;color:#aaa;text-align:center;">
          tabless · <a href="#" style="color:#aaa;">unsubscribe</a>
        </p>
      </div>
    </div>`
}