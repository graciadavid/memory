import { Metadata } from 'next'
import SequenceClient from '../sequence/SequenceClient'

export const metadata: Metadata = {
 title: 'Simon Says — MemGenius',
 description: 'Repeat the color pattern. How far can you go?',
}

export default function SimonSaysPage() {
 return <SequenceClient />
}
