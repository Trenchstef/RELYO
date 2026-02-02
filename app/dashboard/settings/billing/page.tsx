import Link from 'next/link'

export default function BillingPage() {
  const portalUrl = process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Facturation</h1>
        <p className="mt-2 text-slate-600">
          Gère ton plan et ton abonnement RELYO.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Plan actuel</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">Essai Gratuit</p>
          <p className="mt-1 text-sm text-slate-600">
            Passe au plan Pro pour débloquer toutes les fonctionnalités.
          </p>
        </div>

        {!portalUrl ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Ajoute <span className="font-medium">NEXT_PUBLIC_STRIPE_PORTAL_URL</span> dans
            Vercel pour activer le bouton d’abonnement.
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={portalUrl || '#'}
            className={`rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 ${
              portalUrl ? '' : 'pointer-events-none opacity-60'
            }`}
          >
            Gérer mon abonnement
          </a>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </main>
  )
}
