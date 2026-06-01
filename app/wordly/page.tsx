import { Metadata } from 'next'
import WordlyClient from './WordlyClient'

export const metadata: Metadata = {
 title: 'Wordly — MemGenius',
 description: 'Guess the 5-letter word in 6 tries.',
}

export default function WordlyPage() {
 return <WordlyClient />
}
