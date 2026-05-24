'use client'
import { usePathname } from 'next/navigation'
import RequireProfile from './RequireProfile'

const GAME_PATHS = [
  '/digits', '/sequence', '/flags', '/precision',
  '/ace', '/geoshape', '/sudoku', '/wordle', '/wordly',
  '/mastermind', '/2048', '/nback', '/versus', '/play',
  '/stop', '/f1', '/pendulum', '/letter-rain', '/capitals',
  '/blink', '/blackjack',
]

const EXCLUDED_PATHS = ['/g/']

export default function GameProfileGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isExcluded = EXCLUDED_PATHS.some(p => pathname.startsWith(p))
  const isGame = !isExcluded && GAME_PATHS.some(p => pathname.startsWith(p))
  if (isGame) return <RequireProfile>{children}</RequireProfile>
  return <>{children}</>
}
