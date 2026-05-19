import { supabase } from './supabase'

export async function completePlanDay(playerName: string, gameHref: string) {
  if (!playerName) return

  const { data: plans } = await supabase
    .from('brain_plans')
    .select('*')
    .eq('player_name', playerName)
    .order('created_at', { ascending: false })
    .limit(1)

  if (!plans?.[0]) return
  const plan = plans[0]
  if (plan.completed_days.length >= 7) return

  const today = new Date().toISOString().split('T')[0]
  const planDay = Math.ceil((new Date(today).getTime() - new Date(plan.start_date).getTime()) / 86400000) + 1
  const dayIndex = planDay - 1

  if (dayIndex < 0 || dayIndex >= 7) return
  if (plan.completed_days.includes(planDay)) return
  if (plan.games[dayIndex] !== gameHref) return

  const newCompleted = [...plan.completed_days, planDay]
  await supabase.from('brain_plans').update({ completed_days: newCompleted }).eq('id', plan.id)
}
