import { Metadata } from 'next'
import HallOfFameClient from './HallOfFameClient'

export const metadata: Metadata = {
 title: 'Hall of Fame — Sunday Brain Championship | MemGenius',
 description: 'The all-time winners of the Sunday Brain Championship. One game. One day. One winner. Forever.',
}

export default function HallOfFamePage() {
 return <HallOfFameClient />
}
