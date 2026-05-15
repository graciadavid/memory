'use client'
import { usePathname } from 'next/navigation'
import RequireProfile from './RequireProfile'

const GAME_PATHS = [
  '/memory', '/digits', '/sequence', '/flags', '/precision',
  '/ace', '/geoshape', '/sudoku', '/wordle', '/wordly',
  '/mastermind', '/2048', '/nback', '/versus', '/play',
]

export default function GameProfileGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isGame = GAME_PATHS.some(p => pathname.startsWith(p))
  if (isGame) return <RequireProfile>{children}</RequireProfile>
  return <>{children}</>
}
