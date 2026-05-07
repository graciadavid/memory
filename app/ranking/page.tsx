const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

export default function RankingHubPage() {
  return (
    <main style={{
      height: '100dvh',
      background: `linear-gradient(180deg, ${CREAM} 0%, #F0EBE1 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 20px',
    }}>
      <div style={{ width: '100%', marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6, textAlign: 'center' }}>
          Leaderboard
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, color: BROWN, letterSpacing: -1, textAlign: 'center', marginBottom: 32 }}>
          World Ranking
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a href="/ranking/memory" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', borderRadius: 20, padding: '20px 24px',
              background: BROWN, boxShadow: `0 8px 0 ${BROWN}60`,
              display: 'flex', alignItems: 'center', gap: 16,
              boxSizing: 'border-box',
            }}>
              <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/brain-green.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>Memory</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>Match pairs ranking</div>
              </div>
            </div>
          </a>

          <a href="/digits/ranking" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', borderRadius: 20, padding: '20px 24px',
              background: '#1565C0', boxShadow: '0 8px 0 #0D47A160',
              display: 'flex', alignItems: 'center', gap: 16,
              boxSizing: 'border-box',
            }}>
              <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/1234.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>Digits</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>Number memory ranking</div>
              </div>
            </div>
          </a>

          <a href="/sequence/ranking" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', borderRadius: 20, padding: '20px 24px',
              background: '#6A1B9A', boxShadow: '0 8px 0 #4A148C60',
              display: 'flex', alignItems: 'center', gap: 16,
              boxSizing: 'border-box',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 28, height: 28 }}>
                  {['#F44336','#2196F3','#4CAF50','#FFEB3B'].map(c => (
                    <div key={c} style={{ borderRadius: 3, background: c }} />
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>Sequence</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>Pattern memory ranking</div>
              </div>
            </div>
          </a>
          <a href="/flags/ranking" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', borderRadius: 20, padding: '20px 24px',
              background: '#00796B', boxShadow: '0 8px 0 #00695160',
              display: 'flex', alignItems: 'center', gap: 16,
              boxSizing: 'border-box',
            }}>
              <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/flags.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>Flags</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>Flag quiz ranking</div>
              </div>
            </div>
          </a>

        </div>
      </div>
    </main>
  )
}
