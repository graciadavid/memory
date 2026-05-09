'use client'
import { useRouter } from 'next/navigation'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'

export default function ProtectPrompt({ onDismiss }: { onDismiss: () => void }) {
  const router = useRouter()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
      fontFamily: 'var(--font-nunito), sans-serif',
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '32px 24px',
        maxWidth: 380, width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 8, letterSpacing: -0.5 }}>
          Protect your results!
        </div>
        <div style={{ fontSize: 14, color: `${BROWN}70`, fontWeight: 600, lineHeight: 1.6, marginBottom: 24 }}>
          Set a better name and a PIN so you never lose your scores and rankings.
        </div>

        <button
          onClick={() => { onDismiss(); router.push('/profile') }}
          style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
            background: BROWN, color: '#fff', fontSize: 16, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: `0 6px 0 ${BROWN}60`, marginBottom: 10,
          }}>
          Set up now →
        </button>

        <button
          onClick={onDismiss}
          style={{
            width: '100%', padding: '12px', borderRadius: 14, border: 'none',
            background: `${BROWN}10`, color: `${BROWN}60`, fontSize: 14, fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>
          Maybe later
        </button>
      </div>
    </div>
  )
}
