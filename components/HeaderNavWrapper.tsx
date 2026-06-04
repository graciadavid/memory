'use client'
import { usePathname } from 'next/navigation'
import Header from './Header'
import BottomNav from './BottomNav'

export default function HeaderNavWrapper() {
 const pathname = usePathname()
 const isExactly5 = pathname?.startsWith('/exactly5')
 if (isExactly5) return null
 return (
   <>
     <Header />
     <BottomNav />
   </>
 )
}
