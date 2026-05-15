import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const CATEGORIES = [
  { key: 'memgenius', label: 'MemGenius', img: `${BASE}/brain-logo.webp`, color: '#E91E8C', slugs: ['memgenius-colors'] },
  { key: 'geography', label: 'Geography', img: `${BASE}/dubai-skyline.png`, color: '#2E7D32', slugs: ['monuments-countries', 'cities-skylines', 'skyscrapers-cities', 'phenomena-locations'] },
  { key: 'history', label: 'History', img: `${BASE}/pyramids-sphinx.png`, color: '#B71C1C', slugs: ['civilizations-landmarks', 'inventions-inventors'] },
  { key: 'music', label: 'Music', img: `${BASE}/electric-guitar.png`, color: '#6A1B9A', slugs: ['instruments-genres'] },
  { key: 'food', label: 'Food', img: `${BASE}/sushi.png`, color: '#E65100', slugs: ['foods-monuments'] },
  { key: 'science', label: 'Science', img: `${BASE}/jaguar.png`, color: '#0277BD', slugs: ['animals-habitats'] },
  { key: 'everyday', label: 'Everyday', img: `${BASE}/umbrella.png`, color: '#558B2F', slugs: ['objects-uses'] },
]

const PACK_IMGS: Record<string, string> = {
  'memgenius-colors': `${BASE}/brain-logo.webp`,
  'monuments-countries': `${BASE}/eiffel-tower.png`,
  'cities-skylines': `${BASE}/tokyo-skyline.png`,
  'skyscrapers-cities': `${BASE}/empire-state.png`,
  'phenomena-locations': `${BASE}/northern-lights.png`,
  'civilizations-landmarks': `${BASE}/great-wall.png`,
  'inventions-inventors': `${BASE}/light-bulb.png`,
  'instruments-genres': `${BASE}/grand-piano.png`,
  'foods-monuments': `${BASE}/croissant.png`,
  'animals-habitats': `${BASE}/eagle.png`,
  'objects-uses': `${BASE}/door.png`,
}

const DIFF_LABEL: Record<number, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
const DIFF_COLOR: Record<number, string> = { 1: '#2E7D32', 2: '#E65100', 3: '#B71C1C' }

export default async function CategoriesPage() {
  const { data: packs } = await supabase.from('packs').select('id, slug, title, difficulty, emoji')
  if (!packs) return null

  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, ${CREAM} 0%, #F0EBE1 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100,
    }}>
      <div style={{ padding: '32px 20px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Explore</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>Categories</div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {CATEGORIES.map(cat => {
          const catPacks = packs.filter(p => cat.slugs.includes(p.slug))
          if (catPacks.length === 0) return null

          return (
            <div key={cat.key}>
              {/* Category header */}
              <div style={{
                background: `linear-gradient(135deg, ${cat.color}, ${cat.color}CC)`,
                borderRadius: 20, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                marginBottom: 12,
                boxShadow: `0 6px 0 ${cat.color}50`,
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.2)' }}>
                  <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{cat.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{catPacks.length} pack{catPacks.length > 1 ? 's' : ''}</div>
                </div>
              </div>

              {/* Packs grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {catPacks.map(pack => (
                  <Link key={pack.slug} href={`/play/${pack.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      borderRadius: 20, overflow: 'hidden',
                      aspectRatio: '1',
                      position: 'relative',
                      boxShadow: `0 6px 0 ${cat.color}40`,
                    }}>
                      {/* Background image */}
                      <img
                        src={PACK_IMGS[pack.slug] || cat.img}
                        alt={pack.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {/* Overlay */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)',
                      }} />
                      {/* Difficulty badge */}
                      <div style={{
                        position: 'absolute', top: 10, right: 10,
                        background: DIFF_COLOR[pack.difficulty],
                        borderRadius: 8, padding: '3px 8px',
                        fontSize: 9, fontWeight: 900, color: '#fff', letterSpacing: 1,
                      }}>{DIFF_LABEL[pack.difficulty]}</div>
                      {/* Title */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '12px',
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{pack.title}</div>
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
