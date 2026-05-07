'use client'
import { useState, useEffect } from 'react'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const EAGLE = `${SUPABASE_URL}/storage/v1/object/public/storage/brain-logo.webp`

function imgUrl(f: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/storage/${f}`
}

interface TutorialProps {
  pairs: any[]
  onDone: () => void
}

function FlipCard({ img, flipped, onClick }: { img: string, flipped: boolean, onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ perspective: 600, cursor: 'pointer', width: 90, height: 120 }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        borderRadius: 12,
      }}>
        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 12,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          background: 'linear-gradient(145deg, #E8C96A, #D4A820)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 12px ${GOLD}30`,
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 2, borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)' }} />
          <img src={EAGLE} alt="" style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
        </div>
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 12,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)', overflow: 'hidden',
          background: '#fff',
          boxShadow: `0 4px 12px ${BROWN}20`,
        }}>
          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>
    </div>
  )
}

export default function Tutorial({ pairs, onDone }: TutorialProps) {
  const [step, setStep] = useState(0)
  const [cardAFlipped, setCardAFlipped] = useState(false)
  const [cardBFlipped, setCardBFlipped] = useState(false)
  const [matched, setMatched] = useState(false)

  const pair = pairs[0]

  // Auto-animate step 1
  useEffect(() => {
    if (step === 1) {
      const t1 = setTimeout(() => setCardAFlipped(true), 600)
      const t2 = setTimeout(() => setCardBFlipped(true), 1400)
      const t3 = setTimeout(() => setMatched(true), 2200)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }
  }, [step])

  const steps = [
    {
      title: 'Tap to reveal',
      desc: 'Tap a card to see what\'s behind it.',
      content: (
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '24px 0' }}>
          <FlipCard img={imgUrl(pair?.card_a_img)} flipped={cardAFlipped} onClick={() => setCardAFlipped(f => !f)} />
          <FlipCard img={imgUrl(pair?.card_b_img)} flipped={false} onClick={() => {}} />
        </div>
      ),
      hint: 'Tap the left card',
    },
    {
      title: 'Find the connection',
      desc: 'Cards are not identical — they are related. Match each concept to its pair.',
      content: (
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '24px 0', alignItems: 'center' }}>
          <FlipCard img={imgUrl(pair?.card_a_img)} flipped={cardAFlipped} onClick={() => {}} />
          <div style={{ fontSize: 20, fontWeight: 900, color: matched ? GOLD : `${BROWN}30`, transition: 'color 0.5s' }}>→</div>
          <FlipCard img={imgUrl(pair?.card_b_img)} flipped={cardBFlipped} onClick={() => {}} />
        </div>
      ),
      hint: matched ? 'Perfect match!' : 'Watch the animation...',
    },
    {
      title: 'Beat the clock',
      desc: 'The faster you find all 6 pairs, the higher you rank worldwide. Play daily to keep your streak.',
      content: (
        <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'Davitote', time: '00:13:84', gold: true },
            { name: 'Peter', time: '00:15:97', gold: false },
            { name: 'You?', time: '??:??:??', gold: false },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: row.gold ? `${GOLD}15` : '#fff',
              border: `1px solid ${row.gold ? GOLD + '40' : BROWN + '08'}`,
              borderRadius: 12, padding: '10px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: row.gold ? GOLD : `${BROWN}30`, width: 20 }}>{i + 1}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>{row.name}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: BROWN, fontFamily: 'monospace' }}>{row.time}</div>
            </div>
          ))}
        </div>
      ),
      hint: 'Ready to play?',
    },
  ]

  const current = steps[step]
  const isLast = step === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      onDone()
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(74,44,10,0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-nunito), sans-serif',
    }}>
      <div style={{
        background: CREAM,
        borderRadius: 28, padding: '28px 24px',
        width: '100%', maxWidth: 340,
        boxShadow: `0 24px 60px ${BROWN}50`,
        border: `1px solid ${GOLD}30`,
      }}>
        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6, height: 6, borderRadius: 3,
              background: i === step ? GOLD : `${BROWN}20`,
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Title */}
        <div style={{ fontSize: 22, fontWeight: 900, color: BROWN, letterSpacing: -0.5, marginBottom: 8, textAlign: 'center' }}>
          {current.title}
        </div>

        {/* Desc */}
        <div style={{ fontSize: 13, color: `${BROWN}70`, fontWeight: 600, lineHeight: 1.6, textAlign: 'center' }}>
          {current.desc}
        </div>

        {/* Content */}
        {current.content}

        {/* Hint */}
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, textAlign: 'center', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>
          {current.hint}
        </div>

        {/* Button */}
        <button onClick={handleNext} style={{
          width: '100%', padding: '14px',
          borderRadius: 16, border: 'none',
          background: BROWN, color: '#fff',
          fontSize: 15, fontWeight: 900,
          fontFamily: 'inherit', cursor: 'pointer',
          boxShadow: `0 8px 0 ${BROWN}50`,
        }}>
          {isLast ? "Let's play!" : 'Next'}
        </button>

        {!isLast && (
          <button onClick={onDone} style={{
            display: 'block', width: '100%',
            background: 'none', border: 'none',
            color: `${BROWN}40`, fontSize: 12, fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer',
            marginTop: 12, textAlign: 'center',
          }}>
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
