import { supabase } from '@/lib/supabase'
import GroupsPageClient from './GroupsPageClient'

export const revalidate = 60

export default async function GroupsPage() {
  const { data: publicGroups } = await supabase
    .from('groups')
    .select('id, name, slug, is_public')
    .eq('is_public', true)
    .order('created_at', { ascending: true })

  const memberCounts: Record<string, number> = {}
  if (publicGroups?.length) {
    const { data: members } = await supabase
      .from('group_members')
      .select('group_id')
      .in('group_id', publicGroups.map(g => g.id))
    members?.forEach(m => {
      memberCounts[m.group_id] = (memberCounts[m.group_id] || 0) + 1
    })
  }

  return <GroupsPageClient publicGroups={publicGroups || []} memberCounts={memberCounts} />
}
