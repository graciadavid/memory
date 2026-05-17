import HomeClient from '@/components/HomeClient'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Memory — Card Matching Brain Game | MemGenius',
  description: 'Match pairs of connected concepts in the free MemGenius Memory game. Easy, Medium and Hard difficulty. World ranking. Train your semantic memory daily. No login required.',
}

export const revalidate = 0

async function getRandomPack(difficulty: number) {
  const { data } = await supabase
    .from('packs')
    .select('slug')
    .eq('difficulty', difficulty)
  if (!data || data.length === 0) return null
  return data[Math.floor(Math.random() * data.length)].slug
}

export default async function MemoryPage() {
  try {
    const [easy, medium, hard] = await Promise.all([
      getRandomPack(1),
      getRandomPack(2),
      getRandomPack(3),
    ])
    return (
      <>
        <HomeClient easy={easy} medium={medium} hard={hard} />
        <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Memory train?</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>MemGenius Memory trains semantic memory — the part of your brain that stores knowledge about the world and the relationships between concepts. Unlike traditional memory games that match identical images, MemGenius Memory requires you to connect related concepts across different categories including geography, history, science, music, food and everyday objects.</p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>This semantic association task engages the hippocampus, prefrontal cortex and temporal lobe simultaneously. It builds the neural connections between concepts that underlie general knowledge, reading comprehension and the ability to learn new information quickly.</p>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Cards are laid face down on a grid. Flip two cards at a time. If they are conceptually related — a monument and its country, an instrument and its genre, a food and its origin — they remain face up. If not, they flip back. Clear the board as fast as possible. Your time is submitted to a world ranking. Choose Easy, Medium or Hard difficulty.</p>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Why semantic memory matters</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Semantic memory is the foundation of general knowledge and one of the most resilient forms of memory — it declines later and more slowly than episodic memory. However, the speed of semantic retrieval — how quickly you can access stored knowledge — begins declining in the forties. Daily practice with semantic association tasks maintains this retrieval speed and expands your knowledge network, making it easier to learn and remember new information across all domains.</p>
        </div>
      </>
    )
  } catch(e) {
    return <HomeClient easy={null} medium={null} hard={null} />
  }
}
