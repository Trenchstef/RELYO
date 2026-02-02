import Link from 'next/link'
import { redirect } from 'next/navigation'

import AnalyticsClient from './AnalyticsClient'
import { createClient } from '@/lib/supabase-server'

type ReviewRow = {
  created_at: string
  comment: string | null
}

const STOP_WORDS = new Set([
  'avec',
  'bien',
  'bon',
  'bonne',
  'car',
  'comme',
  'dans',
  'des',
  'elle',
  'et',
  'est',
  'grace',
  'merci',
  'mes',
  'nous',
  'pour',
  'plus',
  'pas',
  'par',
  'que',
  'qui',
  'sans',
  'ses',
  'son',
  'sur',
  'tres',
  'tout',
  'une',
  'vous',
  'ils',
  'elles',
  'mais',
  'avez',
  'faire',
  'fait',
  'etre',
  'trop',
  'cela',
  'ce',
  'cet',
  'cette',
])

function buildChartData(reviews: ReviewRow[]) {
  const now = new Date()
  const counts = new Map<string, number>()

  reviews.forEach((review) => {
    const date = new Date(review.created_at)
    const key = date.toISOString().slice(0, 10)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })

  const points = []
  for (let i = 29; i >= 0; i -= 1) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const key = date.toISOString().slice(0, 10)
    const label = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    })
    points.push({ date: label, count: counts.get(key) ?? 0 })
  }
  return points
}

function buildKeywords(reviews: ReviewRow[]) {
  const counts = new Map<string, number>()

  reviews.forEach((review) => {
    if (!review.comment) return
    const words = review.comment
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= 3)
      .filter((word) => !STOP_WORDS.has(word))

    words.forEach((word) => {
      counts.set(word, (counts.get(word) ?? 0) + 1)
    })
  })

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([word, count]) => ({ word, count }))
}

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('created_at, comment')
    .eq('artisan_id', user.id)
    .order('created_at', { ascending: true })

  const reviewRows = (reviews ?? []) as ReviewRow[]
  const chartData = buildChartData(reviewRows)
  const keywords = buildKeywords(reviewRows)

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Dashboard</p>
            <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Retour au tableau de bord
          </Link>
        </header>

        <div className="mt-8">
          <AnalyticsClient chartData={chartData} keywords={keywords} />
        </div>
      </div>
    </main>
  )
}
