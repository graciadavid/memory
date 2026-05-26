import { Metadata } from 'next'
import TetrisClient from './TetrisClient'

export const metadata: Metadata = {
  title: 'Tetris — Classic Block Game | MemGenius',
  description: 'Play classic Tetris free online. Stack blocks, clear lines and compete on the world ranking. No login required.',
}

export default function TetrisPage() {
  return <TetrisClient />
}
