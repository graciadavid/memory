import { Metadata } from 'next'
import GameAceClient from './GameAceClient'

export const metadata: Metadata = {
  title: 'Ace — MemGenius',
  description: 'Tap when the ball hits the sweet spot.',
}

export default function GameAcePage() {
  return <GameAceClient />
}
