import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bgmhfsccchktnknmqkuw.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbWhmc2NjY2hrdG5rbm1xa3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NTA3NzgsImV4cCI6MjA5MzMyNjc3OH0.K0rCWa-SD60XchBK1s7SeNgRzj2MGbIittm1M_lSzH8'
)

const GAME_ROTATION = ['stop', 'blink', 'capitals', 'flags', 'pendulum', 'digits', 'nback', 'ace', 'letter-rain', 'mastermind']

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get active week
    const { data: week } = await supabase
      .from('championship_weeks')
      .select('*')
      .eq('active', true)
      .single()

    if (!week) return NextResponse.json({ error: 'No active week' }, { status: 404 })

    // Get winner
    const start = `${week.sunday_date}T00:00:00Z`
    const end = `${week.sunday_date}T23:59:59Z`

    let query = supabase.from('precision_scores').select('player_name, difference_ms').gte('created_at', start).lte('created_at', end)
    if (week.game === 'stop') query = query.is('game_type', null)
    else if (week.game === 'pendulum') query = query.eq('game_type', 'pendulum')
    else if (week.game === 'f1') query = query.eq('game_type', 'formula1')

    const { data: scores } = await query

    if (scores && scores.length > 0) {
      const best: Record<string, number> = {}
      scores.forEach((s: any) => {
        if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms
      })
      const sorted = Object.entries(best).sort((a, b) => a[1] - b[1])
      const [winner_name, score] = sorted[0]

      await supabase.from('championship_hall_of_fame').insert({
        game: week.game,
        sunday_date: week.sunday_date,
        winner_name,
        score,
        participants: sorted.length
      })
    }

    // Deactivate current week
    await supabase.from('championship_weeks').update({ active: false }).eq('id', week.id)

    // Create next week
    const currentDate = new Date(week.sunday_date)
    const nextSunday = new Date(currentDate)
    nextSunday.setUTCDate(currentDate.getUTCDate() + 7)
    const nextSundayStr = nextSunday.toISOString().split('T')[0]

    const currentIdx = GAME_ROTATION.indexOf(week.game)
    const nextGame = GAME_ROTATION[(currentIdx + 1) % GAME_ROTATION.length]

    await supabase.from('championship_weeks').insert({
      game: nextGame,
      sunday_date: nextSundayStr,
      active: true
    })

    return NextResponse.json({ success: true, winner: scores?.length ? 'saved' : 'no players', nextGame, nextSunday: nextSundayStr })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
