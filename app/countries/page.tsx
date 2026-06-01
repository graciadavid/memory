import { Metadata } from 'next'
import CountriesClient from './CountriesClient'

export const metadata: Metadata = {
 title: 'Countries — MemGenius',
 description: 'Identify countries by their shape.',
}

export default function CountriesPage() {
 return <CountriesClient />
}
