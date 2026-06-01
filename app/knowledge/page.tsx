import { Metadata } from 'next'
import CategoryPage from '@/components/CategoryPage'

export const metadata: Metadata = {
 title: 'Knowledge Games — MemGenius',
 description: 'Test your knowledge of flags, capitals, countries and geography.',
}

const GAMES = [
 { label: 'Flags', icon: 'flags.png', href: '/flags', desc: 'Identify world flags' },
 { label: 'Capitals', icon: 'capitals.png', href: '/capitals', desc: 'Name world capitals' },
 { label: 'Countries', icon: 'mapamundi.png', href: '/countries', desc: 'Identify countries by shape' },
 { label: 'Higher or Lower', icon: 'population.png', href: '/higherorlower/population', desc: 'Compare countries by data' },
]

export default function KnowledgePage() {
 return <CategoryPage title="Knowledge" games={GAMES} />
}
