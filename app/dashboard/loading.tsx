export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="hidden h-screen w-64 border-r border-slate-200 bg-white p-6 lg:block">
          <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-10 space-y-3">
            <div className="h-9 w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-9 w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-9 w-full animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </aside>

        <main className="flex-1 px-10 pb-12 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-6 w-48 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-10 w-40 animate-pulse rounded-2xl bg-slate-200" />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          </div>

          <div className="mt-8 h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </main>
      </div>
    </div>
  )
}
