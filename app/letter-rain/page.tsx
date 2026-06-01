import { Metadata } from 'next'
import LetterRainClient from './LetterRainClient'

export const metadata: Metadata = {
 title: 'Letter Rain — MemGenius',
 description: 'Count the falling letters. Test your selective attention.',
}

export default function LetterRainPage() {
 return <LetterRainClient />
}
