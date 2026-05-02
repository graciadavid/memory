import { supabase } from '@/lib/supabase'
import GameBoard from '@/components/GameBoard'

export default async function PlayPage({ params }: { params: { slug: string } }) {
  const { data: pack } = await supabase
    .from('packs')
    .select('*, pairs(*)')
    .eq('slug', params.slug)
    .single()

  if (!pack) return <div className="text-white p-8">Pack not found</div>

  return <GameBoard pack={pack} />
}
