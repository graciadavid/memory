import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const PURPLE = '#4A148C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const TOPICS = [
  { href: '/precision/stopwatch', img: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/precision.png', label: 'Stop', sub: 'Stop exactly at 5 seconds' },
  { href: '/precision/formula1', img: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/f1.png', label: 'Formula 1', sub: 'React when the lights go out' },
  { href: '/precision/pendulum', img: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/pendulum.png', label: 'Pendulum', sub: 'Stop it at the center' },
]

export default function PrecisionPage() {
  return (
    <>
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #EDE7F6 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 16px 100px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <img src={`${BASE}/precision.png`} alt="" style={{ height: 56, objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE, letterSpacing: -0.5 }}>Precision</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Test your timing</div>
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Choose a game</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TOPICS.map(t => (
          <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: PURPLE, borderRadius: 20, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: `0 8px 0 ${PURPLE}60`,
            }}>
              <img src={(t as any).img} alt="" style={{ width: 52, height: 52, objectFit: 'contain' }} />
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
        Precision — Timing & Reaction Games
      </h2>
      <p style={{ fontSize: 14, color: '#4A2C0A99', lineHeight: 1.8, marginBottom: 24 }}>
        Precision is a collection of three timing challenges that test different aspects of your temporal awareness. Stop the clock at exactly 5 seconds, react to F1 starting lights, or stop a swinging pendulum at its center. Each game measures your performance in milliseconds.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { q: 'What games are in Precision?', a: 'Three games: Stop (stop a timer at exactly 5 seconds), F1 Reaction (react when lights go out), and Pendulum (stop a swinging pendulum at center).' },
          { q: 'What does Precision train?', a: 'Each game trains a different skill — time estimation, reaction speed, and rhythmic timing. Together they give a complete picture of your temporal awareness.' },
          { q: 'Are Precision games free?', a: 'Yes, all three games are completely free with no login required. Scores are submitted to world rankings automatically.' },
        ].map((item, i) => (
          <details key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A15', padding: '14px 18px' }}>
            <summary style={{ fontSize: 14, fontWeight: 800, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none' }}>{item.q}</summary>
            <p style={{ fontSize: 13, color: '#4A2C0A80', lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>{item.a}</p>
          </details>
        ))}
      </div>
    </section>

    </>
  )
}
