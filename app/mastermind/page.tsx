import { Metadata } from 'next'
import MastermindClient from './MastermindClient'

export const metadata: Metadata = {
  title: 'Mastermind — MemGenius',
  description: 'Crack the color code in the fewest attempts.',
}

export default function MastermindPage() {
  return <MastermindClient />
}
