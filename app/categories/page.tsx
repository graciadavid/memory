import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

const CATEGORIES = [
  {
    key: 'geography',
    label: 'Geography',
    emoji: '🌍',
    color: '#2E7D32',
    slugs: ['monuments-countries', 'cities-skylines', 'skyscrapers-cities', 'phenomena-locations'],
  },
  {
    key: 'history',
    label: 'History',
    emoji: '🏛️',
    color: '#B71C1C',
    slugs: ['civilizations-landmarks', 'inventions-inventors'],
  },
  {
    key: 'music',
    label: 'Music',
    emoji: '🎵',
    color: '#6A1B9A',
    slugs: ['instruments-genres'],
  },
  {
    key: 'food',
    label: 'Food',
    emoji: '🍕',
    color: '#E65100',
    slugs: ['foods-monuments'],
  },
  {
    key: 'science',
    label: 'Science',
    emoji: '🔬',
    color: '#0277BD',
    slugs: ['animals-habitats'],
  },
  {
    key: 'everyday',
    label: 'Everyday',
    emoji: '🔑',
    color: '#558B2F',
    slugs: ['objects-uses'],
  },
]

const DIFF_LABEL: Record<number, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
const DIFF_COLOR: Record<number, string> = { 1: '#2E7D32', 2: '#E65100', 3: '#B71C1C' }

export default async function CategoriesPage() {
  const { data: packs } = await supabase
    .from('packs')
    .select('id, slug, title, difficulty, emoji')

  if (!packs) return null

  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, ${CREAM} 0%, #F0EBE1 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{ padding: '32px 20px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
          Explore
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>
          Categories
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {CATEGORIES.map(cat => {
          const catPacks = packs.filter(p => cat.slugs.includes(p.slug))
          if (catPacks.length === 0) return null

          return (
            <div key={cat.key}>
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `${cat.color}15`,
                  border: `1px solid ${cat.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>
                  {cat.emoji}
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: BROWN }}>
                  {cat.label}
                </div>
              </div>

              {/* Packs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {catPacks.map(pack => (
                  <Link key={pack.slug} href={`/play/${pack.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#fff',
                      borderRadius: 16, padding: '14px 16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      boxShadow: `0 2px 8px ${BROWN}08`,
                      border: `1px solid ${BROWN}08`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 24 }}>{pack.emoji}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>{pack.title}</div>
                          <div style={{
                            fontSize: 10, fontWeight: 800,
                            color: DIFF_COLOR[pack.difficulty],
                            marginTop: 2,
                          }}>
                            {DIFF_LABEL[pack.difficulty]}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontSize: 12, fontWeight: 900, color: '#fff',
                        background: BROWN, borderRadius: 10,
                        padding: '6px 14px',
                        boxShadow: `0 4px 0 ${BROWN}50`,
                      }}>
                        Play
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
