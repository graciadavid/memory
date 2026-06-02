import { Metadata } from 'next'
import CategoryPage from '@/components/CategoryPage'

export const metadata: Metadata = {
 title: 'Logic Games — MemGenius',
 description: 'Train your reasoning, strategy and problem solving with 6 free logic games.',
}

const GAMES = [
 { label: 'Sudoku', icon: 'sudoku.png', href: '/sudoku', desc: 'Fill the grid with logic' },
 { label: 'Mastermind', icon: 'mastermind.png', href: '/mastermind', desc: 'Crack the code' },
 { label: 'Wordly', icon: 'wordly.png', href: '/wordly', desc: 'Guess the word' },
 { label: '2048', icon: '2048.png', href: '/2048', desc: 'Merge tiles to 2048' },
 { label: 'Blackjack', icon: 'blackjack.png', href: '/blackjack', desc: 'Beat the dealer' },
]

export default function LogicPage() {
 return <CategoryPage title="Logic" games={GAMES} />
}
