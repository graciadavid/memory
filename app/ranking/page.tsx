import { supabase } from '@/lib/supabase'
import RankingClient from './RankingClient'

export const revalidate = 0

export default async function RankingPage() {
  const { data: scores } = await supabase
    .from('scores')
    .select('*, packs(title, slug, difficulty)')
    .order('time_ms', { ascending: true })
    .limit(500)

  return (
    <main style={{
      height: '100dvh',
      background: 'linear-gradient(180deg, #FAF7F2 0%, #F0EBE1 100%)',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '24px 16px 12px', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#C8960C', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
          Leaderboard
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#4A2C0A', letterSpacing: -1 }}>
          World Ranking
        </div>
      </div>
      <RankingClient scores={scores || []} />
    </main>
  )
}
