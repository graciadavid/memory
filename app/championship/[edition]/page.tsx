'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'

export default function ChampionEditionPage() {
  const params = useParams()
  const edition = params.edition as string
  const editionNum = parseInt(edition)
  const [champion, setChampion] = useState<any>(null)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    supabase.from('championship_hall_of_fame').select('*').order('sunday_date', { ascending: true })
      .then(({ data }: any) => {
        if (!data) return
        setTotal(data.length)
        const champ = data[editionNum - 1]
        if (champ) setChampion(champ)
      })
  }, [editionNum])

  if (!champion) return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'rgba(255,255,255,0.4)', fontSize:14, fontWeight:700 }}>Loading...</div>
    </main>
  )

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'100%', maxWidth:380 }}>
        <div style={{ background:'linear-gradient(135deg,#8B6914,#C8960C,#FFD700,#C8960C,#8B6914)', borderRadius:24, padding:'28px 24px', boxShadow:'0 12px 0 rgba(100,70,0,0.5)', marginBottom:16 }}>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <img src={`${BASE}/winner.png`} style={{ width:56, height:56, objectFit:'contain', marginBottom:8 }} />
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(0,0,0,0.5)', letterSpacing:2 }}>
              SUNDAY BRAIN CHAMPIONSHIP · #{String(editionNum).padStart(3,'0')}
            </div>
            <div style={{ fontSize:32, fontWeight:900, color:'#000', marginTop:8 }}>{champion.winner_name}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:20 }}>
            <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:10, padding:'10px', textAlign:'center' }}>
              <div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Result</div>
              <div style={{ fontSize:18, fontWeight:900, color:'#000' }}>{champion.score}ms</div>
            </div>
            <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:10, padding:'10px', textAlign:'center' }}>
              <div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Game</div>
              <div style={{ fontSize:13, fontWeight:900, color:'#000', textTransform:'capitalize' }}>{champion.game}</div>
            </div>
            <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:10, padding:'10px', textAlign:'center' }}>
              <div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Players</div>
              <div style={{ fontSize:13, fontWeight:900, color:'#000' }}>{champion.participants || '—'}</div>
            </div>
          </div>
          <button onClick={() => {
            if (navigator.share) {
              navigator.share({ title:'Sunday Brain Championship', text:`${champion.winner_name} won the Sunday Brain Championship #${String(editionNum).padStart(3,'0')} with ${champion.score}ms on ${champion.game}!`, url: window.location.href })
            } else {
              navigator.clipboard.writeText(window.location.href); alert('Link copied!')
            }
          }} style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:'rgba(0,0,0,0.25)', color:'#000', fontSize:15, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer' }}>
            🔗 Share this champion
          </button>
        </div>

        <a href="/championship" style={{ textDecoration:'none', display:'block' }}>
          <div style={{ background:'#252525', borderRadius:16, padding:'14px', textAlign:'center' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'rgba(255,255,255,0.6)' }}>← Back to Championship</div>
          </div>
        </a>
      </div>
    </main>
  )
}
