import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase-server'

import NewRequestDialog from './NewRequestDialog'

type ReviewRow = {
  id: string
  created_at: string
  client_name: string | null
  status: string | null
  rating: number | null
  token: string | null
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, created_at, client_name, status, rating, token')
    .eq('artisan_id', user.id)
    .order('created_at', { ascending: false })
    .limit(8)

  const reviewRows = (reviews ?? []) as ReviewRow[]
  const totalReviews = reviewRows.length
  const ratings = reviewRows.map((review) => review.rating).filter(Boolean) as number[]
  const averageRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((sum, value) => sum + value, 0) / ratings.length) * 10) /
        10
      : 0
  const publishedCount = reviewRows.filter(
    (review) => review.status === 'published' || review.rating !== null
  ).length
  const conversionRate = totalReviews > 0 ? Math.round((publishedCount / totalReviews) * 100) : 0

  const statusLabel = (review: ReviewRow) => {
    if (review.status === 'published' || review.rating !== null) {
      return { label: 'Publié', variant: 'success' as const }
    }
    if (review.status === 'pending') {
      return { label: 'Rédigé', variant: 'warning' as const }
    }
    return { label: 'Envoyé', variant: 'neutral' as const }
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split('@')[0] || 'artisan'

  const appUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const createRequestAction = async (
    state: { ok: boolean; token?: string | null; error?: string | null },
    formData: FormData
  ) => {
    'use server'
    const supabaseClient = await createClient()
    const {
      data: { user: currentUser },
    } = await supabaseClient.auth.getUser()

    if (!currentUser) {
      return { ok: false, error: 'Session expirée. Merci de te reconnecter.' }
    }

    const clientName = String(formData.get('clientName') || '').trim()
    const clientPhone = String(formData.get('clientPhone') || '').trim()

    if (!clientName) {
      return { ok: false, error: 'Merci de saisir le nom du client.' }
    }

    const { data, error } = await supabaseClient
      .from('reviews')
      .insert({
        artisan_id: currentUser.id,
        client_name: clientName,
        client_phone: clientPhone || null,
        status: 'sent',
      })
      .select('token')
      .single()

    if (error) {
      return { ok: false, error: error.message }
    }

    return { ok: true, token: data?.token ?? null }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 flex h-full w-64 flex-col border-r border-slate-200 bg-white p-6">
        <div className="text-xl font-bold text-slate-900">RELYO</div>
        <nav className="mt-10 flex flex-col gap-2 text-sm">
          <Link className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-900" href="/dashboard">
            Tableau de bord
          </Link>
          <Link className="rounded-2xl px-3 py-2 text-slate-600 hover:bg-slate-100" href="/dashboard/analytics">
            Analytics
          </Link>
          <Link className="rounded-2xl px-3 py-2 text-slate-600 hover:bg-slate-100" href="/dashboard/customers">
            Mes clients
          </Link>
          <Link className="rounded-2xl px-3 py-2 text-slate-600 hover:bg-slate-100" href="/dashboard/settings">
            Paramètres
          </Link>
        </nav>

        <div className="mt-auto flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-3 text-sm text-slate-700">
          <div className="h-9 w-9 rounded-full bg-slate-200" />
          <div>
            <p className="font-medium text-slate-900">{displayName}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </aside>

      <main className="ml-64 min-h-screen px-10 pb-12 pt-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Tableau de bord</p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Bonjour, {displayName}
            </h1>
          </div>
          <NewRequestDialog action={createRequestAction} />
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Avis reçus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{totalReviews}</p>
              <p className="text-xs text-slate-500">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Note moyenne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-semibold text-slate-900">
                  {averageRating.toFixed(1)}
                </p>
                <span className="text-sm text-slate-500">/ 5</span>
              </div>
              <p className="text-xs text-slate-500">Basé sur {ratings.length} avis notés</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Taux de conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{conversionRate}%</p>
              <p className="text-xs text-slate-500">Demandes transformées en avis</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Demandes récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewRows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                  Aucune demande pour le moment. Lance ta première demande !
                </div>
              ) : (
                <Table>
                  <TableHead>
                    <tr>
                      <TableHeaderCell>Client</TableHeaderCell>
                      <TableHeaderCell>Date</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell className="text-right">Action</TableHeaderCell>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {reviewRows.map((review) => {
                      const status = statusLabel(review)
                      const dateLabel = new Date(review.created_at).toLocaleDateString('fr-FR')
                      const magicLink = review.token
                        ? `${appUrl}/avis/${review.token}`
                        : null
                      const whatsappLink = magicLink
                        ? `https://wa.me/?text=${encodeURIComponent(
                            `Bonjour, voici votre lien pour laisser un avis : ${magicLink}`
                          )}`
                        : '#'

                      return (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium text-slate-900">
                            {review.client_name || 'Client'}
                          </TableCell>
                          <TableCell className="text-slate-500">{dateLabel}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {magicLink ? (
                              <a href={whatsappLink} target="_blank" rel="noreferrer">
                                <Button variant="secondary">Relancer</Button>
                              </a>
                            ) : (
                              <Button variant="secondary" disabled>
                                Relancer
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
