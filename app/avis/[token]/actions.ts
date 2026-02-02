'use server'

import { z } from 'zod'

import { createClient } from '@/lib/supabase-server'

export type ReviewFormState = {
  ok: boolean
  error?: string | null
}

const reviewSchema = z.object({
  token: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(1000),
})

export async function submitReviewAction(
  _state: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const supabase = await createClient()

  const raw = {
    token: String(formData.get('token') || ''),
    rating: Number(formData.get('rating')),
    comment: String(formData.get('comment') || '').trim(),
  }

  const validation = reviewSchema.safeParse(raw)
  if (!validation.success) {
    return { ok: false, error: 'Merci de remplir tous les champs.' }
  }

  const { error } = await supabase
    .from('reviews')
    .update({
      rating: validation.data.rating,
      comment: validation.data.comment,
      status: 'published',
    })
    .eq('token', validation.data.token)
    .is('rating', null)
    .select('id')
    .single()

  if (error) {
    return { ok: false, error: 'Impossible de sauvegarder votre avis.' }
  }

  return { ok: true }
}
