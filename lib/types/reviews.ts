import type { Database } from '@/lib/database.types'

export type Review = Database['public']['Tables']['reviews']['Row']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

export type ReviewStatus = 'pending' | 'sent' | 'published'

export function getStatusLabel(status: ReviewStatus | null, rating: number | null) {
  if (status === 'published' || rating !== null) {
    return { label: 'Publié', variant: 'success' as const }
  }
  if (status === 'pending') {
    return { label: 'Rédigé', variant: 'warning' as const }
  }
  return { label: 'Envoyé', variant: 'neutral' as const }
}
