import { supabase } from '@/lib/supabase'
import SudokuRankingClient from './SudokuRankingClient'

export const revalidate = 60

export default async function SudokuRankingPage() {
  const [easy, medium, hard] = await Promise.all([
    supabase.from('sudoku_scores').select('player_name, time_ms, created_at').eq('difficulty', 'easy').order('time_ms', { ascending: true }).limit(500),
    supabase.from('sudoku_scores').select('player_name, time_ms, created_at').eq('difficulty', 'medium').order('time_ms', { ascending: true }).limit(500),
    supabase.from('sudoku_scores').select('player_name, time_ms, created_at').eq('difficulty', 'hard').order('time_ms', { ascending: true }).limit(500),
  ])

  const getBest = (data: any[]) => {
    const best: Record<string, { time: number, created_at: string }> = {}
    data?.forEach(s => {
      if (!best[s.player_name] || s.time_ms < best[s.player_name].time)
        best[s.player_name] = { time: s.time_ms, created_at: s.created_at }
    })
    return Object.entries(best)
      .map(([name, d]) => ({ name, time: d.time, created_at: d.created_at }))
      .sort((a, b) => a.time - b.time)
  }

  return (
    <main style={{
      height: '100dvh',
      background: 'linear-gradient(180deg, #F3E5F5 0%, #FAF7F2 100%)',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Social Banner */}
      <div style={{ margin: '0 16px 12px', background: 'linear-gradient(135deg, #E1306C15, #00000008)', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E1306C20', flexShrink: 0 }}>
        <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/nav-trophy.webp" alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#4A2C0A50', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>World records live on</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <a href="https://instagram.com/memgenius.app" target="_blank" style={{ textDecoration: 'none', fontSize: 13, fontWeight: 900, color: '#E1306C' }}>Instagram memgenius.app</a>
            <a href="https://tiktok.com/@memgenius" target="_blank" style={{ textDecoration: 'none', fontSize: 13, fontWeight: 900, color: '#4A2C0A' }}>TikTok memgenius</a>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 16px 12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#C8960C', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Leaderboard</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#4A2C0A', letterSpacing: -1 }}>Sudoku Ranking</div>
        </div>
        <a href="/ranking" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: '1px solid #4A2C0A15', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 800, color: '#4A2C0A60' }}>Back ✕</div>
        </a>
      </div>
      <SudokuRankingClient easyScores={getBest(easy.data || [])} mediumScores={getBest(medium.data || [])} hardScores={getBest(hard.data || [])} />
    </main>
  )
}
