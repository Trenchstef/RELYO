export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-6 w-40 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-10 w-44 animate-pulse rounded-2xl bg-slate-200" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
      </div>
    </div>
  )
}
