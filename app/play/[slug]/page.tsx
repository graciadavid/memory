import { supabase } from '@/lib/supabase'
import GameBoard from '@/components/GameBoard'

export default async function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const today = new Date().toISOString().split('T')[0]

  const { data: pack, error } = await supabase
    .from('packs')
    .select('*, pairs(*)')
    .eq('slug', slug)
    .single()

  if (error) return <div style={{ color: '#111', padding: 20 }}>Error: {error.message}</div>
  if (!pack) return <div style={{ color: '#111', padding: 20 }}>Pack not found</div>

  // Check if this is today's daily
  const { data: daily } = await supabase
    .from('daily_challenges')
    .select('pack_slug')
    .eq('date', today)
    .single()

  const isDaily = daily?.pack_slug === slug
  console.log('SERVER: slug:', slug, 'daily slug:', daily?.pack_slug, 'isDaily:', isDaily)

  return <GameBoard pack={{ ...pack, isDaily }} />
}
