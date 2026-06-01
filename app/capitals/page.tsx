import { Metadata } from 'next'
import CapitalsClient from './CapitalsClient'

export const metadata: Metadata = {
 title: 'Capitals — MemGenius',
 description: 'Name the capital city of each country.',
}

export default function CapitalsPage() {
 return <CapitalsClient />
}
