import HomeClient from '@/components/HomeClient'
import { supabase } from '@/lib/supabase'
import { getDailyPackIndex } from '@/lib/dailyChallenge'

async function getRandomPack(difficulty: number) {
  const { data } = await supabase
    .from('packs')
    .select('slug')
    .eq('difficulty', difficulty)
  if (!data || data.length === 0) return null
  return data[Math.floor(Math.random() * data.length)].slug
}

async function getDailyPack() {
  const { data } = await supabase
    .from('packs')
    .select('slug, title, difficulty')
  if (!data || data.length === 0) return null
  const idx = getDailyPackIndex(data.length)
  return data[idx]
}

export default async function Home() {
  const [easy, medium, hard, daily] = await Promise.all([
    getRandomPack(1),
    getRandomPack(2),
    getRandomPack(3),
    getDailyPack(),
  ])

  return (
    <HomeClient
      easy={easy}
      medium={medium}
      hard={hard}
      dailySlug={daily?.slug || null}
      dailyTitle={daily?.title || null}
      dailyDifficulty={daily?.difficulty || 1}
    />
  )
}
