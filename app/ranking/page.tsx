import { supabase } from '@/lib/supabase'
import RankingClient from './RankingClient'

export const revalidate = 0

export default async function RankingPage() {
  const { data: scores } = await supabase
    .from('scores')
    .select('*, packs(title, slug, difficulty)')
    .order('time_ms', { ascending: true })
    .limit(100)

  return (
    <main style={{
      minHeight: '100dvh', background: '#f2f2f2',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100,
    }}>
      <div style={{ padding: '24px 16px 12px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#aaa', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
          Leaderboard
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#111', letterSpacing: -1 }}>
          🏆 World Ranking
        </div>
      </div>
      <RankingClient scores={scores || []} />
    </main>
  )
}
