import { Metadata } from 'next'
import PendulumClient from './PendulumClient'

export const metadata: Metadata = {
 title: 'Pendulum — MemGenius',
 description: 'Stop the pendulum at dead center. Test your anticipatory timing.',
}

export default function PendulumPage() {
 return <PendulumClient />
}
