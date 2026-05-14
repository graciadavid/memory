import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const CATEGORIES = [
  { label: 'Memory', color: '#E91E63', games: 'Memory · Digits · Simon Says', desc: 'Train your ability to retain and recall information.' },
  { label: 'Agility', color: '#FF6F00', games: 'Stop · F1 Reaction · Pendulum', desc: 'Sharpen your reaction speed and timing precision.' },
  { label: 'Knowledge', color: '#1565C0', games: 'Flags · Higher or Lower · GeoShape', desc: 'Test and expand your world knowledge.' },
  { label: 'Logic', color: '#6A1B9A', games: 'Sudoku · Wordly · Mastermind', desc: 'Challenge your reasoning and problem solving skills.' },
]

export default function AboutPage() {
  return (
    <main style={{
      minHeight: '100dvh', background: CREAM,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 24px 100px', color: BROWN,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: `${BROWN}50`, marginBottom: 24 }}>← Back</div>
      </Link>

      <img src={`${BASE}/logomemgenius.webp`} alt="MemGenius" style={{ height: 80, objectFit: 'contain', marginBottom: 24, display: 'block' }} />

      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>About MemGenius</h1>
      <p style={{ fontSize: 14, color: `${BROWN}70`, lineHeight: 1.8, marginBottom: 32 }}>
        MemGenius is a free daily brain training platform built around one idea: Train Your Brain. 13 games across 4 categories, world rankings, group competitions and daily streaks. No login required, no ads, free forever.
      </p>

      {/* Categories */}
      <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>The 4 categories</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {CATEGORIES.map(cat => (
          <div key={cat.label} style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', border: `1px solid ${BROWN}10`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ background: cat.color, borderRadius: 8, width: 10, height: 10, marginTop: 5, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: BROWN }}>{cat.label}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, marginBottom: 2 }}>{cat.games}</div>
              <div style={{ fontSize: 12, color: `${BROWN}60`, lineHeight: 1.6 }}>{cat.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sections */}
      {[
        { title: 'Our mission', text: 'We believe brain training should be fun, free and accessible to everyone. MemGenius gives you a quick mental workout in under 5 minutes a day.' },
        { title: 'Who made this?', text: 'MemGenius was created by a small independent team passionate about brain training and good design.' },
        { title: 'Is it really free?', text: 'Yes. Completely free, no login required, no in-app purchases. Always.' },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 6 }}>{s.title}</div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: `${BROWN}75`, margin: 0 }}>{s.text}</p>
        </div>
      ))}

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 6 }}>Cookie Policy</div>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: `${BROWN}75`, margin: 0 }}>
          MemGenius uses only essential local storage to save your game profile and preferences on your device. We do not use tracking cookies or third-party advertising cookies. If we introduce advertising in the future, we will update this policy and request your consent where required by law.
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: `1px solid ${BROWN}10` }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Get in touch</div>
        <a href="mailto:hello@memgenius.com" style={{ fontSize: 14, fontWeight: 800, color: GOLD, textDecoration: 'none' }}>hello@memgenius.com</a>
      </div>
    </main>
  )
}
