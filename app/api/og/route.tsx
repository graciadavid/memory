import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAF7F2',
          fontFamily: 'sans-serif',
        }}
      >
        <img
          src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/eagle.png"
          width={200}
          height={200}
          style={{ objectFit: 'contain' }}
        />
        <div style={{ fontSize: 48, fontWeight: 900, color: '#4A2C0A', marginTop: 20 }}>
          Mem<span style={{ color: '#C8960C' }}>Genius</span>
        </div>
        <div style={{ fontSize: 20, color: '#4A2C0A', opacity: 0.5, marginTop: 8 }}>
          Association Memory Game
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
