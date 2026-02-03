'use client'

import { useEffect, useMemo, useState } from 'react'

import { createClient } from '@/lib/supabase'
import type { Review } from '@/lib/types/reviews'

type RequestRow = Pick<Review, 'id' | 'created_at' | 'client_name' | 'token'>

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [requests, setRequests] = useState<RequestRow[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.log('Dashboard: utilisateur non connecté')
        setLoading(false)
        return
      }

      setUserId(user.id)

      const { data } = await supabase
        .from('reviews')
        .select('id, created_at, client_name, token')
        .eq('artisan_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setRequests((data ?? []) as RequestRow[])
      setLoading(false)
    }

    fetchData()
  }, [])

  const magicLink = useMemo(() => {
    if (!generatedToken || typeof window === 'undefined') {
      return null
    }
    return `${window.location.origin}/avis/${generatedToken}`
  }, [generatedToken])

  const handleOpenModal = () => {
    console.log('1. Bouton Nouvelle demande cliqué')
    setModalOpen(true)
    setGeneratedToken(null)
    setError(null)
  }

  const handleGenerate = async () => {
    console.log('2. Validation formulaire')
    setError(null)

    if (!userId) {
      setError('Session expirée. Merci de te reconnecter.')
      return
    }

    if (!clientName.trim()) {
      setError('Merci de saisir le nom du client.')
      return
    }

    setSaving(true)
    const supabase = createClient()

    console.log('3. Insertion dans Supabase')
    const { data, error: insertError } = await supabase
      .from('reviews')
      .insert({
        artisan_id: userId,
        client_name: clientName.trim(),
        client_phone: clientPhone.trim() || null,
        status: 'sent',
      })
      .select('token')
      .single()

    if (insertError) {
      console.log('4. Erreur Supabase', insertError.message)
      setSaving(false)
      setError("Impossible d'enregistrer la demande.")
      return
    }

    console.log('4. Token généré', data?.token)
    setGeneratedToken(data?.token ?? null)
    setSaving(false)
  }

  const handleCopy = async () => {
    if (!magicLink) return
    console.log('5. Copie du lien')
    await navigator.clipboard.writeText(magicLink)
  }

  const handleShareWhatsApp = () => {
    if (!magicLink) return
    console.log('6. Redirection WhatsApp')
    const url = `https://wa.me/?text=${encodeURIComponent(
      `Bonjour, voici votre lien pour laisser un avis : ${magicLink}`
    )}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Tableau de bord</h1>
            <p className="text-sm text-slate-600">
              {loading ? 'Chargement...' : 'Gère tes demandes et tes clients.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenModal}
            disabled={loading}
            className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-60"
          >
            Nouvelle demande +
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200">
          <div className="grid grid-cols-3 gap-4 border-b border-slate-200 px-4 py-3 text-xs font-medium text-slate-500">
            <span>Client</span>
            <span>Date</span>
            <span>Lien</span>
          </div>
          {requests.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">Aucune demande pour le moment.</div>
          ) : (
            requests.map((request) => {
              const date = request.created_at
                ? new Date(request.created_at).toLocaleDateString('fr-FR')
                : '-'
              return (
                <div
                  key={request.id}
                  className="grid grid-cols-3 gap-4 border-t border-slate-100 px-4 py-3 text-sm text-slate-700"
                >
                  <span>{request.client_name || 'Client'}</span>
                  <span>{date}</span>
                  <span className="text-slate-500">
                    {request.token ? 'Lien généré' : '—'}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setModalOpen(false)}
            aria-label="Fermer"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Nouvelle demande</h2>
                <p className="text-sm text-slate-500">
                  Saisis les infos du client pour générer le lien.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-2xl border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
              >
                Fermer
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Nom du client</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Ex: Marie Dupont"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Mobile</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  value={clientPhone}
                  onChange={(event) => setClientPhone(event.target.value)}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={saving || !userId}
              className="mt-5 w-full rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-60"
            >
              {saving ? 'Génération...' : 'Générer le lien magique'}
            </button>

            {magicLink ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Lien magique</p>
                <p className="mt-1 break-all text-sm text-slate-900">{magicLink}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-xs text-slate-700 hover:bg-slate-100"
                  >
                    Copier le lien
                  </button>
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="rounded-2xl bg-sky-500 px-4 py-2 text-xs text-white hover:bg-sky-600"
                  >
                    Partager sur WhatsApp
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  )
}
