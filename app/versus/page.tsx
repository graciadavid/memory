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

export default function VersusPage() {
  return (
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
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Higher or Lower</div>
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
  )
}
