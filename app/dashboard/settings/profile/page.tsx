'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

import { createClient } from '@/lib/supabase'

declare global {
  interface Window {
    google?: any
  }
}

type PlaceResult = {
  place_id?: string
  name?: string
  formatted_address?: string
}

export default function ProfileSettingsPage() {
  const [companyName, setCompanyName] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [place, setPlace] = useState<PlaceResult | null>(null)
  const [placeQuery, setPlaceQuery] = useState('')
  const [scriptReady, setScriptReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Session expirée. Merci de te reconnecter.')
        return
      }

      setUserId(user.id)

      const { data } = await supabase
        .from('artisan_profiles')
        .select('company_name, logo_url, google_place_id, google_place_label')
        .eq('id', user.id)
        .maybeSingle()

      if (data) {
        setCompanyName(data.company_name || '')
        setLogoUrl(data.logo_url || null)
        if (data.google_place_id || data.google_place_label) {
          setPlace({
            place_id: data.google_place_id || undefined,
            name: data.google_place_label || undefined,
            formatted_address: data.google_place_label || undefined,
          })
          setPlaceQuery(data.google_place_label || '')
        }
      }
    }

    loadProfile()
  }, [])

  useEffect(() => {
    if (!scriptReady || !inputRef.current || !window.google?.maps?.places) {
      return
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'name', 'formatted_address'],
      types: ['establishment'],
    })

    autocomplete.addListener('place_changed', () => {
      const result = autocomplete.getPlace() as PlaceResult
      setPlace({
        place_id: result.place_id,
        name: result.name,
        formatted_address: result.formatted_address,
      })
      setPlaceQuery(result.formatted_address || result.name || '')
    })
  }, [scriptReady])

  const handleSave = async () => {
    setError(null)
    setSuccess(null)
    setSaving(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !userId) {
      setSaving(false)
      setError('Session expirée. Merci de te reconnecter.')
      return
    }

    let uploadedLogoUrl = logoUrl
    if (logoFile) {
      const extension = logoFile.name.split('.').pop() || 'png'
      const path = `${user.id}/logo-${Date.now()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(path, logoFile, { upsert: true })

      if (uploadError) {
        setSaving(false)
        setError("Impossible d'uploader le logo.")
        return
      }

      const { data: publicUrl } = supabase.storage.from('logos').getPublicUrl(path)
      uploadedLogoUrl = publicUrl.publicUrl
      setLogoUrl(uploadedLogoUrl)
    }

    const { error: upsertError } = await supabase
      .from('artisan_profiles')
      .upsert({
        id: user.id,
        company_name: companyName || null,
        logo_url: uploadedLogoUrl || null,
        google_place_id: place?.place_id || null,
        google_place_label: place?.formatted_address || place?.name || null,
        updated_at: new Date().toISOString(),
      })

    if (upsertError) {
      setSaving(false)
      setError('Impossible de sauvegarder le profil.')
      return
    }

    setSaving(false)
    setSuccess('Profil mis à jour.')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Profil entreprise</h1>
        <p className="mt-2 text-slate-600">
          Mets à jour le nom de ton entreprise, ton logo et ta fiche Google.
        </p>

        {!apiKey ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            La clé Google Maps API est manquante. Ajoute
            <span className="font-medium"> NEXT_PUBLIC_GOOGLE_MAPS_API_KEY </span>
            dans les variables d’environnement Vercel.
          </div>
        ) : (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
            onLoad={() => setScriptReady(true)}
          />
        )}

        <div className="mt-6 grid gap-6">
          <div className="rounded-2xl border border-slate-200 p-4">
            <label className="text-sm font-medium text-slate-700">
              Nom d’entreprise
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Ex : Atelier Dupont"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <label className="text-sm font-medium text-slate-700">Logo</label>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-2xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
              onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
            />
            {logoFile ? (
              <p className="mt-2 text-xs text-slate-500">Fichier : {logoFile.name}</p>
            ) : logoUrl ? (
              <p className="mt-2 text-xs text-slate-500">Logo actuel chargé</p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <label className="text-sm font-medium text-slate-700">
              Lier la fiche Google
            </label>
            <input
              ref={inputRef}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Rechercher un établissement"
              value={placeQuery}
              onChange={(event) => {
                setPlaceQuery(event.target.value)
                setPlace(null)
              }}
            />
            {place ? (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <p className="font-medium">{place.name}</p>
                <p className="text-xs text-slate-500">{place.formatted_address}</p>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Commence à taper pour rechercher ta fiche Google.
              </p>
            )}
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-6 rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-60"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </main>
  )
}
