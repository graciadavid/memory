import { supabase } from './supabase'

// Count today's plays for a specific game
export async function getTodayPlays(playerName: string, gameHref: string): Promise<number> {
 const today = new Date().toISOString().split('T')[0]
 
 const tableMap: Record<string, { table: string, filter?: Record<string, any> }> = {
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

 const config = tableMap[gameHref]
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

export async function completeWodExercise(playerName: string, gameHref: string) {
  // This function is kept for backward compatibility
  // Progress is now calculated from actual plays via getTodayPlays
}
