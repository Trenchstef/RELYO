import Link from 'next/link'

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Mes clients</h1>
        <p className="mt-2 text-slate-600">
          Aperçu rapide de tes clients et des demandes en cours.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">Clients actifs</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">12</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">Demandes en attente</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">3</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">Relances à faire</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">2</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200">
          <div className="grid grid-cols-3 gap-4 border-b border-slate-200 px-4 py-3 text-xs font-medium text-slate-500">
            <span>Client</span>
            <span>Dernière demande</span>
            <span>Status</span>
          </div>
          <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm text-slate-700">
            <span>Marie Dupont</span>
            <span>12/02/2026</span>
            <span>En attente</span>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 px-4 py-3 text-sm text-slate-700">
            <span>Luc Martin</span>
            <span>09/02/2026</span>
            <span>Publié</span>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 px-4 py-3 text-sm text-slate-700">
            <span>Sarah Ng</span>
            <span>05/02/2026</span>
            <span>Rédigé</span>
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
