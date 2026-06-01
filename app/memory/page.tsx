import { Metadata } from 'next'
import MemoryClient from './MemoryClient'

export const metadata: Metadata = {
  title: 'Memory — MemGenius',
  description: 'Match the brain pairs as fast as possible.',
}

export default function MemoryPage() {
  return <MemoryClient />
}
