import Link from 'next/link'

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Paramètres</h1>
        <p className="mt-2 text-slate-600">
          Gère ton profil et les notifications de demandes.
        </p>

        <div className="mt-6 grid gap-6">
          <div className="rounded-2xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Profil</h2>
            <p className="mt-2 text-sm text-slate-600">
              Nom affiché : <span className="font-medium">Artisan RELYO</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Email : <span className="font-medium">artisan@relyo.app</span>
            </p>
            <Link
              href="/dashboard/settings/profile"
              className="mt-4 inline-flex rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Modifier le profil entreprise
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
              <span>Relances automatiques</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                Activé
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
              <span>Résumé hebdo</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                Désactivé
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </main>
  )
}
