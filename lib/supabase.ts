import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/database.types'

/**
 * Client Supabase pour le navigateur (composants client, formulaires, etc.)
 * Utilise les cookies pour la session.
 */
export function createClient(): SupabaseClient<Database, 'public'> {
  return createBrowserClient<Database, 'public'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
