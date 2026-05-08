const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export default function AboutPage() {
  return (
    <main style={{
      minHeight: '100dvh', background: CREAM,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 24px 100px', color: BROWN,
    }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 24 }}>About MemGenius</h1>
      <img src={`${BASE}/logomemgenius.webp`} alt="MemGenius" style={{ height: 80, objectFit: 'contain', marginBottom: 24, display: 'block' }} />
      {[
        { title: 'What is MemGenius?', text: 'MemGenius is a free daily brain training platform with four games: Memory, Digits, Sequence and Flags. All games feature world rankings so you can compete globally.' },
        { title: 'Our mission', text: 'We believe brain training should be fun, free and accessible to everyone. MemGenius gives you a quick mental workout in under 5 minutes a day.' },
        { title: 'Who made this?', text: 'MemGenius was created by a small independent team passionate about brain training and good design.' },
        { title: 'Is it really free?', text: 'Yes. Completely free, no login required, no ads, no in-app purchases.' },
        { title: 'Contact', text: 'Have feedback or found a bug? We would love to hear from you.' },
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

      <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: `1px solid ${BROWN}10`, boxShadow: `0 4px 16px ${BROWN}08` }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Get in touch</div>
        <a href="mailto:hello@memgenius.com" style={{ fontSize: 14, fontWeight: 800, color: GOLD, textDecoration: 'none' }}>hello@memgenius.com</a>
      </div>
    </main>
  )
}
