import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name') || 'Champion'
  const score = searchParams.get('score') || '0'
  const game = searchParams.get('game') || 'Stop'
  const edition = searchParams.get('edition') || '001'

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
          background: 'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, color: 'rgba(0,0,0,0.5)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8, display: 'flex' }}>
          SUNDAY BRAIN CHAMPIONSHIP · #{edition}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'rgba(0,0,0,0.4)', marginBottom: 24, display: 'flex' }}>👑</div>
        <div style={{ fontSize: 52, fontWeight: 900, color: '#000', marginBottom: 8, display: 'flex' }}>{name}</div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '12px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(0,0,0,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, display: 'flex' }}>GAME</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#000', textTransform: 'capitalize', display: 'flex' }}>{game}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: '12px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(0,0,0,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, display: 'flex' }}>RESULT</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#000', display: 'flex' }}>{score}ms</div>
          </div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(0,0,0,0.5)', display: 'flex' }}>memgenius.com/championship</div>
      </div>
    ),
    { width: 600, height: 400 }
  )
}
