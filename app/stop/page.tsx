import { Metadata } from 'next'
import StopClient from './StopClient'

export const metadata: Metadata = {
 title: 'Stop — Internal Clock Precision | MemGenius',
 description: 'Stop a timer at exactly 5 seconds. No visual aid. Test your internal clock precision and rank globally.',
}

export default function StopPage() {
 return <StopClient />
}
