import { Metadata } from 'next'
import SequenceClient from './SequenceClient'

export const metadata: Metadata = {
  title: 'Simon Says — MemGenius',
  description: 'Repeat the color pattern. How far can you go?',
}

export default function SequencePage() {
  return <SequenceClient />
}
