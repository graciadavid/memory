import { Metadata } from 'next'
import F1Client from './F1Client'

export const metadata: Metadata = {
 title: 'F1 Reaction — MemGenius',
 description: 'React the moment the F1 lights go out. Test your reaction time.',
}

export default function F1Page() {
 return <F1Client />
}
