import { Metadata } from 'next'
import SudokuClient from './SudokuClient'

export const metadata: Metadata = {
 title: 'Sudoku — MemGenius',
 description: 'Fill the grid with logic. Easy, Medium and Hard.',
}

export default function SudokuPage() {
 return <SudokuClient />
}
