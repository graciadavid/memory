import GeoShapeClient from './GeoShapeClient'

export const metadata = {
  title: 'GeoShape — Country Shape Recognition Game | MemGenius',
  description: 'Can you recognize a country just from its shape? Free online geography game with world ranking. Train your spatial cognition and geographic knowledge. No login required.',
}

export default function GeoShapePage() {
  return (
    <>
      <GeoShapeClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does GeoShape train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>GeoShape trains visuospatial recognition — the ability to identify objects from their shape alone without color, text or other contextual cues. This engages the right parietal cortex and the fusiform gyrus, brain regions specialized for processing spatial information and recognizing complex visual forms.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Visuospatial ability is one of the core components of general intelligence and is particularly important for mathematics, engineering, architecture and any field requiring mental visualization. It is also one of the cognitive abilities most responsive to training — regular practice with shape recognition tasks produces measurable improvements in spatial reasoning within a few weeks.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A black silhouette of a country appears on screen. Four country names are shown as options. Tap the correct country. Each correct answer advances to the next shape. One mistake ends the game. Your score is the number of consecutive correct answers. The game includes countries from all continents at varying levels of difficulty.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Why country shapes are harder than flags</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Flags provide color, symbols and patterns as recognition cues. Country shapes provide only an outline — a much more demanding task that requires genuine spatial memory and geographic knowledge. Most people who consider themselves geographically literate fail at GeoShape within the first few countries, revealing a gap between knowing country names and truly visualizing them in space.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>With daily practice, GeoShape builds a mental map of the world that is qualitatively different from simple name recognition. You begin to see the world as a spatial system rather than a list of names — a shift that improves performance in geography, history, economics and international affairs comprehension.</p>
      </div>
    </>
  )
}
