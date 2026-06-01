import { Metadata } from 'next'
import FlagsClient from './FlagsClient'

export const metadata: Metadata = {
  title: 'Flags — MemGenius',
  description: 'Identify countries by their flags.',
}

export default function FlagsPage() {
  return <FlagsClient />
}
