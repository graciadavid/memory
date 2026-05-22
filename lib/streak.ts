import { supabase } from './supabase'

export async function updateStreak(playerName: string) {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const { data: profile } = await supabase
    .from('profiles')
    .select('streak, last_played_date')
    .eq('player_name', playerName)
    .single()

  if (!profile) return 0

  const last = profile.last_played_date
  let newStreak = 1

  if (last === today) {
    return profile.streak // Already played today
  } else if (last === yesterday) {
    newStreak = (profile.streak || 0) + 1
  }

  await supabase
    .from('profiles')
    .update({ streak: newStreak, last_played_date: today })
    .eq('player_name', playerName)

  return newStreak
}
