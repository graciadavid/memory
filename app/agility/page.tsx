import { Metadata } from 'next'
import CategoryPage from '@/components/CategoryPage'

export const metadata: Metadata = {
 title: 'Agility Games — MemGenius',
 description: 'Train your reaction time, timing and precision with 6 free agility games.',
}

const GAMES = [
 { label: 'Stop', icon: 'precision.png', href: '/stop', desc: 'Stop at exactly 5.000s' },
 { label: 'F1 Reaction', icon: 'f1.png', href: '/f1', desc: 'React when lights go out' },
 { label: 'Pendulum', icon: 'pendulum.png', href: '/pendulum', desc: 'Tap when vertical' },
 { label: 'Ace', icon: 'padel.png', href: '/ace', desc: 'Hit the sweet spot' },
 { label: 'Letter Rain', icon: 'rain.png', href: '/letter-rain', desc: 'Count the falling letters' },
 { label: 'TypeDrop', icon: 'type.png', href: '/typedrop', desc: 'Type before it falls' },
]

export default function AgilityPage() {
 return <CategoryPage title="Agility" games={GAMES} />
}
