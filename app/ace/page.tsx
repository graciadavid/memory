import { Metadata } from 'next'
import AceClient from './AceClient'

export const metadata: Metadata = {
 title: 'Ace — MemGenius',
 description: 'Tap when the ball hits the sweet spot.',
}

export default function AcePage() {
 return <AceClient />
}
