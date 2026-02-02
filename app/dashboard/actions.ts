'use server'

import { z } from 'zod'

import { createClient } from '@/lib/supabase-server'

export type NewRequestState = {
  ok: boolean
  token?: string | null
  error?: string | null
}

const createRequestSchema = z.object({
  clientName: z.string().min(1).max(100),
  clientPhone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide')
    .optional()
    .or(z.literal('')),
})

export async function createRequestAction(
  _state: NewRequestState,
  formData: FormData
): Promise<NewRequestState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'Session expirée. Merci de te reconnecter.' }
  }

  const rawData = {
    clientName: String(formData.get('clientName') || '').trim(),
    clientPhone: String(formData.get('clientPhone') || '').trim(),
  }

  const validation = createRequestSchema.safeParse(rawData)
  if (!validation.success) {
    return { ok: false, error: 'Données invalides.' }
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      artisan_id: user.id,
      client_name: validation.data.clientName,
      client_phone: validation.data.clientPhone || null,
      status: 'sent',
    })
    .select('token')
    .single()

  if (error) {
    return { ok: false, error: 'Erreur lors de la création de la demande.' }
  }

  return { ok: true, token: data?.token ?? null }
}
