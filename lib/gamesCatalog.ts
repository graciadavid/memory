export interface CatalogGame {
  title: string
  href: string
}

export const GAMES_CATALOG: CatalogGame[] = [
  { title: 'Memory', href: '/memory' },
  { title: 'Digits', href: '/digits' },
  { title: 'Simon Says', href: '/simon-says' },
  { title: 'N-Back', href: '/nback' },
  { title: 'Blink', href: '/blink' },
  { title: 'Poke', href: '/poke' },
  { title: 'Stop', href: '/stop' },
  { title: 'F1 Reaction', href: '/f1' },
  { title: 'Pendulum', href: '/pendulum' },
  { title: 'Ace', href: '/ace' },
  { title: 'Letter Rain', href: '/letter-rain' },
  { title: 'TypeDrop', href: '/typedrop' },
  { title: 'Flags', href: '/flags' },
  { title: 'Capitals', href: '/capitals' },
  { title: 'Countries', href: '/countries' },
  { title: 'Higher or Lower Population', href: '/higherorlower/population' },
  { title: 'Higher or Lower Area', href: '/higherorlower/area' },
  { title: 'Sudoku', href: '/sudoku' },
  { title: 'Mastermind', href: '/mastermind' },
  { title: 'Wordly', href: '/wordly' },
  { title: '2048', href: '/2048' },
  { title: 'Blackjack', href: '/blackjack' },
]

// One flagship game per category, used to route first-time players through a variety tour.
export const ONBOARDING_TOUR: string[] = ['/memory', '/stop', '/flags', '/sudoku']
