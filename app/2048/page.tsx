import { Metadata } from 'next'
import Game2048Client from './Game2048Client'

export const metadata: Metadata = {
 title: '2048 — MemGenius',
 description: 'Merge tiles to reach 2048.',
}

export default function Game2048Page() {
 return <Game2048Client />
}
