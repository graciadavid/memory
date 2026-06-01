import { Metadata } from 'next'
import BlackjackClient from './BlackjackClient'

export const metadata: Metadata = {
 title: 'Blackjack — MemGenius',
 description: 'Beat the dealer. Get to 21 without going bust.',
}

export default function BlackjackPage() {
 return <BlackjackClient />
}
