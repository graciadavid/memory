'use client'
import { useState } from 'react'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

const steps = [
  {
    emoji: '🃏',
    title: 'Flip the cards',
    desc: 'Tap any card to reveal what\'s behind it.',
  },
  {
    emoji: '🧠',
    title: 'Find the connection',
    desc: 'Each card has a pair. Not identical — but related. Eiffel Tower goes with France. Sushi goes with Japan.',
  },
  {
    emoji: '⚡',
    title: 'Beat the clock',
    desc: 'Your time is recorded. The faster you finish, the higher you rank worldwide.',
  },
  {
    emoji: '🏆',
    title: 'Climb the ranking',
    desc: 'Every game counts. Play daily to keep your streak and improve your best position.',
  },
]

export default function Tutorial({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(74,44,10,0.7)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-nunito), sans-serif',
    }}>
      <div style={{
        background: CREAM,
        borderRadius: 28, padding: '40px 28px',
        width: '100%', maxWidth: 340,
        textAlign: 'center',
        boxShadow: `0 24px 60px ${BROWN}50`,
        border: `1px solid ${GOLD}30`,
      }}>
        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6, height: 6, borderRadius: 3,
              background: i === step ? GOLD : `${BROWN}20`,
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Icon */}
        <div style={{ fontSize: 56, marginBottom: 20 }}>{current.emoji}</div>

        {/* Title */}
        <div style={{
          fontSize: 22, fontWeight: 900, color: BROWN,
          letterSpacing: -0.5, marginBottom: 12,
        }}>
          {current.title}
        </div>

        {/* Description */}
        <div style={{
          fontSize: 15, color: `${BROWN}70`, fontWeight: 600,
          lineHeight: 1.6, marginBottom: 36,
        }}>
          {current.desc}
        </div>

        {/* Button */}
        <button
          onClick={() => isLast ? onDone() : setStep(s => s + 1)}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 16, border: 'none',
            background: BROWN, color: '#fff',
            fontSize: 16, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: `0 8px 0 ${BROWN}50`,
          }}
        >
          {isLast ? "Let's play!" : 'Next'}
        </button>

        {/* Skip */}
        {!isLast && (
          <button onClick={onDone} style={{
            background: 'none', border: 'none',
            color: `${BROWN}40`, fontSize: 13, fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer',
            marginTop: 14,
          }}>
            Skip tutorial
          </button>
        )}
      </div>
    </div>
  )
}
