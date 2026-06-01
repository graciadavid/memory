import { Metadata } from 'next'
import CategoryPage from '@/components/CategoryPage'

export const metadata: Metadata = {
  title: 'Knowledge Games — MemGenius',
  description: 'Test your knowledge of flags, capitals, countries and geography.',
}

const GAMES = [
  { label: 'Flags', icon: 'flags.png', href: '/flags', desc: 'Identify countries by their flag' },
  { label: 'Capitals', icon: 'capitals.png', href: '/capitals', desc: 'Name the capital of each country' },
  { label: 'Countries', icon: 'countries.png', href: '/countries', desc: 'Identify countries by their shape' },
  { label: 'Higher or Lower Population', icon: 'higher.png', href: '/higherorlower/population', desc: 'Which country has more people?' },
  { label: 'Higher or Lower Area', icon: 'area.png', href: '/higherorlower/area', desc: 'Which country has more area in km\u00b2?' },
]

export default function KnowledgePage() {
  return <CategoryPage title="Knowledge" games={GAMES} />
}
