import { Metadata } from 'next'
import CategoryPage from '@/components/CategoryPage'

export const metadata: Metadata = {
 title: 'Memory Games — MemGenius',
 description: 'Train your working memory, recall and pattern recognition with 6 free memory games.',
}

const GAMES = [
 { label: 'Memory', icon: 'memory.png', href: '/memory', desc: 'Match connected concepts' },
 { label: 'Digits', icon: 'digits.png', href: '/digits', desc: 'Remember number sequences' },
 { label: 'Simon Says', icon: 'sequence.png', href: '/simon-says', desc: 'Repeat the color pattern' },
 { label: 'N-Back', icon: 'nback.png', href: '/nback', desc: 'Working memory challenge' },
 { label: 'Blink', icon: 'blink.png', href: '/blink', desc: 'Remember the grid' },
 { label: 'Poke', icon: 'salmon.png', href: '/poke', desc: 'Remember the bowl ingredients' },
]

export default function MemoryHubPage() {
 return <CategoryPage title="Memory" games={GAMES} />
}
