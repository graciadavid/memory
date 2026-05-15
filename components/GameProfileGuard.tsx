'use client'
import { usePathname } from 'next/navigation'
import RequireProfile from './RequireProfile'

const GAME_PATHS = [
  '/memory', '/digits', '/sequence', '/flags', '/precision',
  '/ace', '/geoshape', '/sudoku', '/wordle', '/wordly',
  '/mastermind', '/2048', '/nback', '/versus', '/play',
]

const EXCLUDED_PATHS = ['/g/']

export default function GameProfileGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isExcluded = EXCLUDED_PATHS.some(p => pathname.startsWith(p))
  const isGame = !isExcluded && GAME_PATHS.some(p => pathname.startsWith(p))
  if (isGame) return <RequireProfile>{children}</RequireProfile>
  return <>{children}</>
}
