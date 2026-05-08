'use client'
import { getSpainToday } from '@/lib/dailyChallenge'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateRank } from '@/lib/rankUtils'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

interface Props {
  ms: number
  pack: any
  worldRank: number | null
  lastFact: string
  onReset: () => void
}

export default function ResultOverlay({ ms, pack, worldRank, lastFact, onReset }: Props) {
  const { profile, recordGame } = usePlayer()
  const [shared, setShared] = useState(false)
  const [rank, setRank] = useState<number | null>(null)
  const saved = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (saved.current) return
    if (!profile?.name) return
    saved.current = true

    const saveAndRank = async () => {
      // 1. Save score
      const today = getSpainToday()
      // Check if this pack is today's daily directly from Supabase
      const { data: dailyCheck } = await supabase
        .from('daily_challenges')
        .select('pack_slug')
        .eq('date', today)
        .single()
      const isDaily = dailyCheck?.pack_slug === pack.slug
      console.log('isDaily check:', isDaily, 'pack:', pack.slug, 'daily:', dailyCheck?.pack_slug)
      await supabase.from('scores').insert({
        pack_id: pack.id,
        player_name: profile.name,
        time_ms: ms,
        moves: 0,
        is_daily: isDaily,
        play_date: today,
      })

      // 2. Calculate rank using unified function
      const r = await calculateRank(profile.name, pack.id, ms)
      setRank(r)
      recordGame(pack.slug, pack.pairs?.length || 6, r, ms)
    }

    saveAndRank()
  }, [profile?.name])

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const diffLabel = pack.difficulty === 1 ? 'Easy' : pack.difficulty === 2 ? 'Medium' : 'Hard'
  const diffColor = pack.difficulty === 1 ? '#2E7D32' : pack.difficulty === 2 ? '#E65100' : '#B71C1C'

  const share = async () => {
    const text = `🦅 I solved "${pack.title}" in ${fmt(ms)} on MemGenius!\nCan you beat me?\nhttps://memgenius.com`
    if (navigator.share) {
      await navigator.share({ text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Copied!')
    }
    setShared(true)
  }

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(74,44,10,0.5)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 20px 80px',
      }}>
        <div style={{
          background: CREAM,
          borderRadius: 28,
          padding: '32px 24px',
          width: '100%', maxWidth: 340,
          textAlign: 'center',
          boxShadow: `0 24px 60px ${BROWN}40`,
          border: `1px solid ${GOLD}30`,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 900, letterSpacing: 3,
            color: `${BROWN}60`, textTransform: 'uppercase', marginBottom: 8,
          }}>
            Your Time
          </div>

          <div style={{
            fontSize: 48, fontWeight: 900, color: BROWN,
            fontFamily: 'monospace', letterSpacing: 1, lineHeight: 1,
            marginBottom: 6,
          }}>
            {fmt(ms)}
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: `${BROWN}50`, marginBottom: 20 }}>
            <span style={{
              color: diffColor, fontWeight: 900,
              background: `${diffColor}15`,
              padding: '2px 8px', borderRadius: 6, marginRight: 6,
            }}>{diffLabel}</span>
            {pack.title}
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${GOLD}18, ${BROWN}10)`,
            border: `1px solid ${GOLD}40`,
            borderRadius: 16, padding: '14px 20px', marginBottom: 20,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: `${BROWN}50`,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4,
            }}>
              {diffLabel} Ranking
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>
              {rank ? `#${rank}` : '...'}
            </div>
          </div>

                    <button onClick={() => {
            (window as any).gtag?.('event', 'challenge_shared', { game: 'memory' })
              const url = `${window.location.origin}/challenge?game=memory&score=${pack?.slug}&by=${encodeURIComponent(profile?.name || 'Someone')}`
            if (navigator.share) navigator.share({ title: 'MemGenius Challenge', text: `${profile?.name} challenges you to Memory on MemGenius!`, url })
            else navigator.clipboard.writeText(url).then(() => alert('Challenge link copied!'))
          }} style={{
            width: '100%', padding: '16px', borderRadius: 16, border: 'none',
            background: '#C62828',
            color: '#fff', fontSize: 16, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 6px 0 #8B000060',
          }}>Challenge a friend</button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onReset} style={{
              flex: 1, padding: '13px', borderRadius: 14, border: 'none',
              background: GOLD, color: '#fff',
              fontSize: 13, fontWeight: 800,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: `0 6px 0 ${GOLD}50`,
            }}>Play again</button>
            <button onClick={() => router.push('/')} style={{
              flex: 1, padding: '13px', borderRadius: 14, border: 'none',
              background: '#4CAF50', color: 'white',
              fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: '0 6px 0 #2E7D3260',
            }}>New game</button>
          </div>
        </div>
      </div>

      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'rgba(250,247,242,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${BROWN}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '6px 0 16px', zIndex: 300,
      }}>
        {[
          { href: '/memory', img: '/icons/nav-home.webp' },
          { href: '/ranking', img: '/icons/nav-trophy.webp' },
          { href: '/profile', img: '/icons/nav-profile.webp' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <img src={item.img} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          </Link>
        ))}
      </nav>
    </>
  )
}
