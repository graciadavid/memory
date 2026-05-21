import { supabase } from './supabase'

export async function completeWodExercise(playerName: string, gameHref: string) {
  if (!playerName) return

  const today = new Date().toISOString().split('T')[0]

  const { data: planData } = await supabase
    .from('brain_plans')
    .select('start_date')
    .eq('player_name', playerName)
    .order('created_at', { ascending: false })
    .limit(1)

  if (!planData?.[0]) return

  const startDate = new Date(planData[0].start_date)
  const todayDate = new Date(today)
  const diff = Math.floor((todayDate.getTime() - startDate.getTime()) / 86400000)
  const wodDay = Math.min(7, Math.max(1, diff + 1))

  const { data: wodData } = await supabase
    .from('wod')
    .select('*')
    .eq('day_number', wodDay)
    .limit(1)

  if (!wodData?.[0]) return
  const wod = wodData[0]

  const isInWod = wod.exercises.some((e: any) => e.href === gameHref)
  if (!isInWod) return

  const { data: compData } = await supabase
    .from('wod_completions')
    .select('*')
    .eq('player_name', playerName)
    .eq('date', today)
    .limit(1)

  const currentCompleted = compData?.[0]?.completed_exercises || []
  if (currentCompleted.includes(gameHref)) return

  const newCompleted = [...currentCompleted, gameHref]
  const allDone = wod.exercises.every((e: any) => newCompleted.includes(e.href))

  if (compData?.[0]) {
    await supabase.from('wod_completions').update({
      completed_exercises: newCompleted,
      completed: allDone,
    }).eq('id', compData[0].id)
  } else {
    await supabase.from('wod_completions').insert({
      player_name: playerName,
      wod_day: wodDay,
      completed_exercises: newCompleted,
      completed: allDone,
      date: today,
    })
  }
}
