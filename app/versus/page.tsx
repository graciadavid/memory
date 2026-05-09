import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const COLOR = '#C62828'

export default function VersusPage() {
  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #FFEBEE 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 16px 100px',
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Choose a topic</div>
      <div style={{ fontSize: 30, fontWeight: 900, color: BROWN, letterSpacing: -1, marginBottom: 24 }}>⚔️ Versus</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/versus/population" style={{ textDecoration: 'none' }}>
          <div style={{
            background: COLOR, borderRadius: 20, padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: `0 8px 0 ${COLOR}60`,
          }}>
            <div style={{ fontSize: 44 }}>🌍</div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>Population</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Which country has more people?</div>
            </div>
          </div>
        </Link>

        <Link href="/versus/area" style={{ textDecoration: 'none' }}>
          <div style={{
            background: COLOR, borderRadius: 20, padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: `0 8px 0 ${COLOR}60`,
          }}>
            <div style={{ fontSize: 44 }}>🏔️</div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>Area km²</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Which country is bigger?</div>
            </div>
          </div>
        </Link>

        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 14,
          border: `1px dashed ${BROWN}20`, opacity: 0.5,
        }}>
          <div style={{ fontSize: 44 }}>💰</div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, color: BROWN }}>GDP</div>
            <div style={{ fontSize: 12, color: `${BROWN}50`, marginTop: 2 }}>Coming soon</div>
          </div>
        </div>
      </div>
    </main>
  )
}
