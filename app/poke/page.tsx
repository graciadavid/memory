import { Metadata } from 'next'
import PokeClient from './PokeClient'

export const metadata: Metadata = {
 title: 'Poke Memory — Remember the Bowl | MemGenius',
 description: 'Remember the ingredients in the poke bowl before they disappear. Free memory game. No login required.',
}

export default function PokePage() {
 return <PokeClient />
}
