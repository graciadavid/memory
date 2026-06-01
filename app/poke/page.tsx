import { Metadata } from 'next'
import PokeClient from './PokeClient'

export const metadata: Metadata = {
 title: 'Poke — MemGenius',
 description: 'Remember the poke bowl ingredients.',
}

export default function PokePage() {
 return <PokeClient />
}
