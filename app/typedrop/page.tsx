import { Metadata } from 'next'
import TypeDropClient from './TypeDropClient'

export const metadata: Metadata = {
 title: 'TypeDrop — MemGenius',
 description: 'Type the word before it hits the bottom.',
}

export default function TypeDropPage() {
 return <TypeDropClient />
}
