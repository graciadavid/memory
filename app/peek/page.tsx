import { Metadata } from 'next'
import PeekClient from './PeekClient'

export const metadata: Metadata = {
  title: 'Peek — MemGenius',
  description: 'A picture slowly reveals itself and letters drip in as hints. Guess the word before it fully unveils.',
}

export default function PeekPage() {
  return <PeekClient />
}
