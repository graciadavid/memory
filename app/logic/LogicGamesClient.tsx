'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
  { label: 'Sudoku', icon: `${BASE}/sudoku.png`, href: '/sudoku', desc: 'Fill the grid with logic' },
  { label: 'Mastermind', icon: `${BASE}/mastermind.png`, href: '/mastermind', desc: 'Crack the color code' },
  { label: '2048', icon: `${BASE}/2048.png`, href: '/2048', desc: 'Merge tiles to reach 2048' },
  { label: 'Wordly', icon: `${BASE}/wordly.png`, href: '/wordly', desc: 'Guess the hidden word' },
  { label: 'Blackjack', icon: `${BASE}/blackjack.png`, href: '/blackjack', desc: 'Grow your stack, cash out at your peak' },
  { label: 'Tetris', icon: `${BASE}/mango.png`, href: '/tetris', desc: 'Stack blocks, clear lines, beat the world' },
]

function rand() { return Math.floor(Math.random() * (20 - 3 + 1)) + 3 }

export default function LogicGamesClient() {
  const [counts] = useState(() => GAMES.map(() => rand()))
  const [blink, setBlink] = useState(true)
  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 600); return () => clearInterval(t) }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {GAMES.map((g, i) => (
        <Link key={g.label} href={g.href} style={{ textDecoration:'none' }}>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, border:'1px solid rgba(255,255,255,0.08)' }}>
            <img src={g.icon} style={{ width:52, height:52, objectFit:'contain', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <div style={{ fontSize:17, fontWeight:900, color:'#fff' }}>{g.label}</div>
                <div style={{ fontSize:11, fontWeight:900, color: blink ? '#69F0AE' : 'transparent', transition:'color 0.6s' }}>● {counts[i]} playing</div>
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{g.desc}</div>
            </div>
            <div style={{ fontSize:18, color:'rgba(255,255,255,0.2)' }}>→</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
