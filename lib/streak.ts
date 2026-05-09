import { supabase } from './supabase'

function getMadridToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' })
}

function getMadridYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' })
}

export async function updateStreak(playerName: string): Promise<number> {
  if (!playerName) return 0

  const today = getMadridToday()
  const yesterday = getMadridYesterday()

  const { data } = await supabase
    .from('streaks')
    .select('*')
    .eq('player_name', playerName)
    .single()

  if (!data) {
    // First time playing
    await supabase.from('streaks').insert({
      player_name: playerName,
      current_streak: 1,
      longest_streak: 1,
      last_played_date: today,
    })
    return 1
  }

  if (data.last_played_date === today) {
    // Already played today - no change
    return data.current_streak
  }

  let newStreak = 1
  if (data.last_played_date === yesterday) {
    // Consecutive day
    newStreak = data.current_streak + 1
  }
  // If not yesterday, streak resets to 1

  const newLongest = Math.max(newStreak, data.longest_streak || 0)

  await supabase.from('streaks').update({
    current_streak: newStreak,
    longest_streak: newLongest,
    last_played_date: today,
    updated_at: new Date().toISOString(),
  }).eq('player_name', playerName)

  return newStreak
}

export async function getStreak(playerName: string): Promise<{ current: number, longest: number, playedToday: boolean }> {
  if (!playerName) return { current: 0, longest: 0, playedToday: false }

  const today = getMadridToday()

  const { data } = await supabase
    .from('streaks')
    .select('current_streak, longest_streak, last_played_date')
    .eq('player_name', playerName)
    .single()

  if (!data) return { current: 0, longest: 0, playedToday: false }

  // Check if streak is still alive
  const yesterday = getMadridYesterday()
  const isAlive = data.last_played_date === today || data.last_played_date === yesterday
  const current = isAlive ? data.current_streak : 0

  return {
    current,
    longest: data.longest_streak || 0,
    playedToday: data.last_played_date === today,
  }
}
