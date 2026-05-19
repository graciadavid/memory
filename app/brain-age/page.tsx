import { createClient } from '@supabase/supabase-js'
import BrainAgeClient from './BrainAgeClient'

export const metadata = {
  title: 'Your Brain Profile | MemGenius',
  description: 'Your Brain Age results, cognitive areas breakdown and 7-day training plan.',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function BrainAgePage() {
  return <BrainAgeClient />
}
