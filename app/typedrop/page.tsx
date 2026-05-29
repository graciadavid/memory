import { Metadata } from 'next'
import TypeDropClient from './TypeDropClient'

export const metadata: Metadata = {
 title: 'TypeDrop — Type Before It Falls | MemGenius',
 description: 'Words fall from the sky. Type them before they hit the ground. Free typing speed game. No login required.',
}

export default function TypeDropPage() {
 return <TypeDropClient />
}
