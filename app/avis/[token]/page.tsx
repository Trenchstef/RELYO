import { notFound } from 'next/navigation'

import { createClient } from '@/lib/supabase-server'

import AvisForm from './AvisForm'
import { submitReviewAction } from './actions'

type AvisPageProps = {
  params: { token: string }
}

export default async function AvisPage({ params }: AvisPageProps) {
  const supabase = await createClient()
  const { data: review, error } = await supabase
    .from('reviews')
    .select('id, client_name, rating')
    .eq('token', params.token)
    .maybeSingle()

  if (error || !review) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Laisser un avis</h1>
        <p className="mt-2 text-slate-600">
          Merci de partager votre expérience avec {review.client_name || 'notre artisan'}.
        </p>

        {review.rating ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            Cet avis a déjà été envoyé. Merci !
          </div>
        ) : (
          <AvisForm token={params.token} clientName={review.client_name} action={submitReviewAction} />
        )}
      </div>
    </main>
  )
}
