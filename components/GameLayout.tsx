'use client'

const GREEN = '#2E7D32'
const GOLD = '#C8960C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

interface TopPlayer {
  name: string
  score: string
}

interface GameLayoutRulesProps {
  icon: string
  title: string
  subtitle: string
  worldRecord?: { value: string; name: string } | null
  myBest?: string | null
  top5?: TopPlayer[]
  onPlay: () => void
  children?: React.ReactNode
}

interface GameLayoutResultProps {
  result: string
  resultColor: string
  background: string
  worldRank?: number | null
  hasProfile: boolean
  onBack: () => void
  onPlayAgain: () => void
  children?: React.ReactNode
}

export function GameRulesScreen({ icon, title, subtitle, worldRecord, myBest, top5, onPlay, children }: GameLayoutRulesProps) {
  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'16px 16px 100px', overflowY:'auto' }}>
      
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
        <img src={`${BASE}/${icon}`} style={{ width:52, height:52, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:26, fontWeight:900, color:'#fff' }}>{title}</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{subtitle}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <div style={{ flex:1, background:'#252525', borderRadius:14, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:20, fontWeight:900, color:GOLD }}>{worldRecord?.value ?? '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'#252525', borderRadius:14, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>{myBest ?? '—'}</div>
        </div>
      </div>

      {/* Extra content before play */}
      {children}

      {/* Play button */}
      <button onClick={onPlay} style={{ width:'100%', padding:'20px', borderRadius:16, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 6px 0 #1B5E20', marginBottom:16 }}>
        Play →
      </button>

      {/* Top 5 */}
      {top5 && top5.length > 0 && (
        <div style={{ background:'#252525', borderRadius:14, padding:'14px', marginBottom:16 }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Top Players</div>
          {top5.map((p, i) => (
            <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
              <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
              <div style={{ fontSize:13, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.score}</div>
            </div>
          ))}
        </div>
      )}

    </main>
  )
}

export function GameResultScreen({ result, resultColor, background, worldRank, hasProfile, onBack, onPlayAgain, children }: GameLayoutResultProps) {
  return (
    <main style={{ minHeight:'100dvh', background, fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20 }}>
      
      {/* Result */}
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2, lineHeight:1 }}>{result}</div>
        {worldRank && <div style={{ fontSize:22, fontWeight:900, color:'rgba(255,255,255,0.6)', marginTop:12 }}>#{worldRank} <span style={{ fontSize:14, fontWeight:700 }}>in the world</span></div>}
      </div>

      {/* Extra content */}
      {children}

      {/* Save result if no profile */}
      {!hasProfile && (
        <a href="/profile" style={{ textDecoration:'none', display:'block', width:'100%' }}>
          <div style={{ background:'#D32F2F', borderRadius:16, padding:'16px', textAlign:'center', boxShadow:'0 4px 0 #B71C1C' }}>
            <div style={{ fontSize:15, fontWeight:900, color:'#fff' }}>💾 Save your result</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', fontWeight:700, marginTop:2 }}>Create your free profile →</div>
          </div>
        </a>
      )}

      {/* Actions */}
      <div style={{ display:'flex', gap:10, width:'100%' }}>
        <button onClick={onBack} style={{ flex:1, padding:'16px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
        <button onClick={onPlayAgain} style={{ flex:2, padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E2080' }}>Play again →</button>
      </div>
    </main>
  )
}
