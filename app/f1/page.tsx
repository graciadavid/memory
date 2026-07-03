import { Metadata } from 'next'
import F1Client from './F1Client'
import F1SeoContent from './F1SeoContent'

export const metadata: Metadata = {
 title: 'F1 Reaction Time Test — How Fast Are You vs a Real F1 Start? | MemGenius',
 description: 'React the moment the real F1 start lights go out. Free reaction time test with global rankings — see how you compare to the average 250ms human reaction and real race-start benchmarks.',
}

export default function F1Page() {
 return (
   <>
     <F1Client />
     <F1SeoContent />
   </>
 )
}
