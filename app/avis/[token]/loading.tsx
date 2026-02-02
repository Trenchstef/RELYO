export default function AvisLoading() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 h-4 w-64 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </main>
  )
}
