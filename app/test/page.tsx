import { supabase } from '@/lib/supabase'

export default async function TestPage() {
  const { data, error } = await supabase
    .from('packs')
    .select('slug, title')

  return (
    <div className="text-white p-8">
      <h1 className="text-2xl font-black mb-4">Test</h1>
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {data && data.map(p => (
        <p key={p.slug}>{p.slug} — {p.title}</p>
      ))}
    </div>
  )
}
