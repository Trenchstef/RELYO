\'use client\'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

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
  const [companyName, setCompanyName] = useState('Atelier RELYO')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [place, setPlace] = useState<PlaceResult | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

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
    })
  }, [scriptReady])

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

        <button
          type="button"
          className="mt-6 rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
        >
          Enregistrer les modifications
        </button>
      </div>
    </main>
  )
}
