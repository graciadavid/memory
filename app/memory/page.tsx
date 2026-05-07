import HomeClient from '@/components/HomeClient'
import { supabase } from '@/lib/supabase'

export const revalidate = 0

async function getRandomPack(difficulty: number) {
  const { data } = await supabase
    .from('packs')
    .select('slug')
    .eq('difficulty', difficulty)
  if (!data || data.length === 0) return null
  return data[Math.floor(Math.random() * data.length)].slug
}

export default async function MemoryPage() {
  try {
    const [easy, medium, hard] = await Promise.all([
      getRandomPack(1),
      getRandomPack(2),
      getRandomPack(3),
    ])
    return <HomeClient easy={easy} medium={medium} hard={hard} />
  } catch(e) {
    return <HomeClient easy={null} medium={null} hard={null} />
  }
}
