import { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export const metadata: Metadata = {
  title: 'World Capitals Quiz — Free Online | MemGenius',
  description: 'Test your knowledge of world capitals for free. How many can you name? World rankings. No login required.',
  keywords: ['world capitals quiz', 'capital cities quiz', 'capitals test', 'country capitals quiz', 'geography quiz'],
}

export default function WorldCapitalsQuizPage() {
  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 100px', fontFamily: 'var(--font-nunito), sans-serif', background: '#fff', minHeight: '100dvh' }}>

      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>World Capitals Quiz</h1>
      <p style={{ fontSize: 16, lineHeight: 1.8, color: '#555', marginBottom: 32 }}>What is the capital of Australia? Most people say Sydney. It is Canberra. That is the kind of thing this quiz does to you. 195 countries, hundreds of capitals, and a surprising number of them are not the cities you think.</p>

      <div style={{ marginBottom: 48 }}>
        <Link href="/capitals" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '24px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src={`${BASE}/capitals.png`} style={{ width: 64, height: 64, objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1C1C1E', marginBottom: 6 }}>Capitals Quiz</div>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>A country appears with 4 capital options. Pick the right one. Each correct answer leads to a harder country. The quiz covers every nation in the world including the ones nobody ever gets right. How far can you go?</div>
            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 900, color: '#2E7D32' }}>Play free →</div>
          </div>
        </Link>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>The capitals everyone gets wrong</h2>
      <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 16 }}>Australia — Canberra, not Sydney. New Zealand — Wellington, not Auckland. Brazil — Brasília, not Rio de Janeiro. Canada — Ottawa, not Toronto. South Africa has three capitals. These are the ones that separate people who think they know geography from people who actually do.</p>
      <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 32 }}>The smaller nations are where it gets really difficult. Do you know the capital of Kyrgyzstan? Burkina Faso? Vanuatu? Most people do not. A few people in our world ranking do.</p>

      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>Also try these knowledge games</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
        <Link href="/flags" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 14, padding: '16px 20px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={`${BASE}/flags.png`} style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#1C1C1E' }}>Flags Quiz</div>
            <div style={{ fontSize: 13, color: '#666' }}>Identify countries by their flags. Can you tell Chad from Romania?</div>
          </div>
        </Link>
        <Link href="/countries" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 14, padding: '16px 20px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={`${BASE}/countries.png`} style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#1C1C1E' }}>Countries by Shape</div>
            <div style={{ fontSize: 13, color: '#666' }}>Identify a country from its silhouette. A different kind of geography challenge.</div>
          </div>
        </Link>
      </div>

      <div style={{ background: '#1C1C1E', borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>How many capitals do you know?</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Free. No login. World rankings.</div>
        <Link href="/capitals" style={{ textDecoration: 'none', display: 'inline-block', background: '#2E7D32', borderRadius: 14, padding: '14px 32px', fontSize: 16, fontWeight: 900, color: '#fff' }}>
          Start the quiz →
        </Link>
      </div>

    </main>
  )
}
