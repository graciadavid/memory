import { supabase } from './supabase'

const TABLE_MAP: Record<string, { table: string, filter?: Record<string, any> }> = {
  '/precision/stopwatch': { table: 'precision_scores', filter: { game_type: null } },
  '/precision/formula1': { table: 'precision_scores', filter: { game_type: 'formula1' } },
  '/precision/pendulum': { table: 'precision_scores', filter: { game_type: 'pendulum' } },
  '/ace': { table: 'ace_scores' },
  '/nback': { table: 'nback_scores' },
  '/digits': { table: 'number_scores' },
  '/sequence': { table: 'sequence_scores' },
  '/memory': { table: 'scores' },
  '/flags': { table: 'flag_scores' },
  '/geoshape': { table: 'shape_scores' },
  '/versus': { table: 'higher_lower_scores' },
  '/mastermind': { table: 'mastermind_scores' },
  '/sudoku': { table: 'sudoku_scores' },
  '/wordly': { table: 'wordle_scores' },
  '/2048': { table: 'game2048_scores' },
}

export async function getTodayPlays(playerName: string, gameHref: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  const config = TABLE_MAP[gameHref]
  if (!config) return 0

  let query = supabase
    .from(config.table as any)
    .select('id', { count: 'exact', head: true })
    .eq('player_name', playerName)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)

  if (config.filter) {
    for (const [k, v] of Object.entries(config.filter)) {
      if (v === null) query = (query as any).is(k, null)
      else query = (query as any).eq(k, v)
    }
  }

  const { count } = await query
  return count || 0
}

export async function getWodProgress(playerName: string, exercises: any[]): Promise<Record<string, number>> {
  const progress: Record<string, number> = {}
  await Promise.all(exercises.map(async (ex: any) => {
    progress[ex.href] = await getTodayPlays(playerName, ex.href)
  }))
  return progress
}

export async function checkAndSaveWodCompletion(playerName: string, gameHref: string): Promise<boolean> {
  // Returns true if should redirect to my-plan
  const today = new Date().toISOString().split('T')[0]

  const { data: planData } = await supabase
    .from('brain_plans')
    .select('start_date')
    .eq('player_name', playerName)
    .order('created_at', { ascending: false })
    .limit(1)

  if (!planData?.[0]) return false

  const planDiff = Math.floor((new Date().getTime() - new Date(planData[0].start_date).getTime()) / 86400000)
  const wodDay = Math.min(7, Math.max(1, planDiff + 1))

  const { data: wodData } = await supabase
    .from('wod')
    .select('*')
    .eq('day_number', wodDay)
    .limit(1)

  if (!wodData?.[0]) return false
  const wod = wodData[0]

  // Get progress for all exercises
  const progress = await getWodProgress(playerName, wod.exercises)

  // Build completed list
  const completedExercises = wod.exercises
    .filter((ex: any) => (progress[ex.href] || 0) >= ex.reps)
    .map((ex: any) => ex.href)

  const allDone = completedExercises.length === wod.exercises.length

  // Save to wod_completions
  const { data: existing } = await supabase
    .from('wod_completions')
    .select('id')
    .eq('player_name', playerName)
    .eq('date', today)
    .limit(1)

  if (existing?.[0]) {
    await supabase.from('wod_completions').update({
      completed_exercises: completedExercises,
      completed: allDone,
    }).eq('id', existing[0].id)
  } else if (completedExercises.length > 0) {
    await supabase.from('wod_completions').insert({
      player_name: playerName,
      wod_day: wodDay,
      completed_exercises: completedExercises,
      completed: allDone,
      date: today,
    })
  }

  // Check if THIS game just hit its reps target
  const ex = wod.exercises.find((e: any) => e.href === gameHref)
  if (ex && (progress[gameHref] || 0) >= ex.reps) return true

  return false
}

export async function completeWodExercise(playerName: string, gameHref: string) {
  // Kept for backward compatibility
}
