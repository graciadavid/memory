import { Metadata } from 'next'
import BlinkClient from './BlinkClient'

export const metadata: Metadata = {
 title: 'Blink — MemGenius',
 description: 'Remember which cells lit up in the grid.',
}

export default function BlinkPage() {
 return <BlinkClient />
}
