import { Metadata } from 'next'
import TetrisClient from './TetrisClient'

export const metadata: Metadata = {
 title: 'Tetris — MemGenius',
 description: 'Stack the blocks. Clear the lines.',
}

export default function TetrisPage() {
 return <TetrisClient />
}
