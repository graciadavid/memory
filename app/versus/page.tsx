import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const COLOR = '#C62828'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const TOPICS = [
  { href: '/versus/population', img: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/population.png', label: 'Population', sub: 'Which country has more people?' },
  { href: '/versus/area', img: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/area.png', label: 'Area km²', sub: 'Which country is bigger?' },
]

export const metadata = {
  title: 'Higher or Lower — Geography Knowledge Game | MemGenius',
  description: 'Which country has more people or larger area? Free online geography game with world ranking. Train your world knowledge. No login required.',
}

export default function VersusPage() {
  return (
    <>
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #FFEBEE 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 16px 100px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <img src={`${BASE}/higuer.png`} alt="" style={{ height: 56, objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: COLOR, letterSpacing: -0.5 }}>Higher or Lower</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Geography knowledge test</div>
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Choose a topic</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TOPICS.map(t => (
          <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: COLOR, borderRadius: 20, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: `0 8px 0 ${COLOR}60`,
            }}>
              <img src={t.img} alt="" style={{ width: 52, height: 52, objectFit: 'contain' }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>{t.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{t.sub}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>

    <section style={{
      maxWidth: 430, margin: '0 auto',
      padding: '48px 24px 120px',
      fontFamily: 'var(--font-nunito), sans-serif',
      background: '#FAF7F2',
    }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>
        Higher or Lower — Geography Knowledge Game
      </h2>
      <p style={{ fontSize: 14, color: '#4A2C0A99', lineHeight: 1.8, marginBottom: 24 }}>
        Higher or Lower is a geography challenge where two countries appear and you decide which one is bigger or more populated. Build the longest streak you can — one wrong answer ends the game. Available in two categories: Population and Area km².
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { q: 'How does Higher or Lower work?', a: 'Two countries appear on screen. Tap the one with more people (Population) or larger surface area (Area). Get it right and continue your streak. One wrong answer ends the game.' },
          { q: 'What are the two categories?', a: 'Population — guess which country has more inhabitants. Area km² — guess which country has a larger surface area. Both draw from nearly 200 countries worldwide.' },
          { q: 'Is Higher or Lower free?', a: 'Completely free, no login required. Your best streak is automatically submitted to the world ranking.' },
          { q: 'Can I play on mobile?', a: 'Yes, fully optimized for mobile with large tap targets and instant loading.' },
        ].map((item, i) => (
          <details key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A15', padding: '14px 18px' }}>
            <summary style={{ fontSize: 14, fontWeight: 800, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none' }}>{item.q}</summary>
            <p style={{ fontSize: 13, color: '#4A2C0A80', lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>{item.a}</p>
          </details>
        ))}
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 32 }}>What does Higher or Lower train?</h2>
      <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Higher or Lower trains geographic knowledge and probabilistic reasoning — the ability to estimate relative quantities and make decisions under uncertainty. Every comparison requires you to draw on your accumulated knowledge of world geography, combining facts about country size, population density and global demographics into a rapid judgment.</p>
      <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>This type of quantitative geographic reasoning is associated with stronger performance in economics, geopolitics and data literacy. People who can accurately estimate relative quantities — which country is bigger, which city is more populous — demonstrate better calibration in everyday numerical judgments across all domains.</p>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Geography knowledge and crystallized intelligence</h2>
      <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Geographic knowledge is a form of crystallized intelligence — the accumulated factual knowledge built through education and experience. Unlike fluid intelligence, which declines with age, crystallized intelligence can continue growing through the fifties and sixties. Higher or Lower provides a motivating and competitive context for expanding this knowledge base, with each session teaching you something new about the relative size and population of countries worldwide.</p>
    </section>

    </>
  )
}
