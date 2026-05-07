const BROWN = '#4A2C0A'
const BLUE = '#1565C0'
const CREAM = '#FAF7F2'

export default function DigitsLoading() {
  return (
    <main style={{
      height: '100dvh',
      background: `linear-gradient(180deg, #EEF4FF 0%, ${CREAM} 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', width: '100%', gap: 12 }}>
        <img src="/icons/digits.webp" alt="" style={{ height: 60, objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BLUE, letterSpacing: -0.5 }}>Digits</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>How far can you go?</div>
        </div>
      </div>
    </main>
  )
}
