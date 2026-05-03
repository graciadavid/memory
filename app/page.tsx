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
  const today = new Date().toISOString().split('T')[0]

  // Get daily slug
  const { data: daily } = await supabase
    .from('daily_challenges')
    .select('pack_slug')
    .eq('date', today)
    .single()

  let slug = daily?.pack_slug

  // Create one if missing
  if (!slug) {
    const { data: allPacks } = await supabase
      .from('packs')
      .select('id, slug, title, difficulty')
    if (!allPacks) return null
    const idx = getDailyPackIndex(allPacks.length)
    const pack = allPacks[idx]
    await supabase.from('daily_challenges').upsert({
      date: today,
      pack_id: pack.id,
      pack_slug: pack.slug,
    })
    slug = pack.slug
  }

  // Get pack details separately
  const { data: pack } = await supabase
    .from('packs')
    .select('slug, title, difficulty')
    .eq('slug', slug)
    .single()

  if (!pack) return null
  return { pack_slug: pack.slug, packs: { title: pack.title, difficulty: pack.difficulty } }
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
      dailySlug={daily?.pack_slug || null}
      dailyTitle={(Array.isArray(daily?.packs) ? daily?.packs[0]?.title : daily?.packs?.title) || null}
      dailyDifficulty={(Array.isArray(daily?.packs) ? daily?.packs[0]?.difficulty : daily?.packs?.difficulty) || 1}
    />
  )
}
