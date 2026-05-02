import { supabase } from '@/lib/supabase'
import GameBoard from '@/components/GameBoard'

export default async function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const { data: pack, error } = await supabase
    .from('packs')
    .select('*, pairs(*)')
    .eq('slug', slug)
    .single()

  if (error) return <div className="text-white p-8">Error: {error.message}</div>
  if (!pack) return <div className="text-white p-8">Pack not found: {slug}</div>

  return <GameBoard pack={pack} />
}
