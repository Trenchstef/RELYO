type AvisPageProps = {
  params: { token: string }
}

export default function AvisPage({ params }: AvisPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Laisser un avis</h1>
        <p className="mt-2 text-slate-600">
          Formulaire d’avis en cours de préparation.
        </p>
        <p className="mt-4 text-xs text-slate-400">Token : {params.token}</p>
      </div>
    </main>
  )
}
