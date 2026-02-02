'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { NewRequestState } from './actions'

const initialState: NewRequestState = {
  ok: false,
  token: null,
  error: null,
}

type NewRequestDialogProps = {
  action: (state: NewRequestState, formData: FormData) => Promise<NewRequestState>
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Génération...' : 'Générer le lien magique'}
    </Button>
  )
}

export default function NewRequestDialog({ action }: NewRequestDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [state, formAction] = useFormState(action, initialState)

  const magicLink = useMemo(() => {
    if (!state.token || typeof window === 'undefined') {
      return null
    }
    return `${window.location.origin}/avis/${state.token}`
  }, [state.token])

  useEffect(() => {
    if (state.ok) {
      router.refresh()
    }
  }, [state.ok, router])

  const handleCopy = async () => {
    if (!magicLink) return
    await navigator.clipboard.writeText(magicLink)
  }

  const whatsappLink = magicLink
    ? `https://wa.me/?text=${encodeURIComponent(
        `Bonjour, voici votre lien pour laisser un avis : ${magicLink}`
      )}`
    : '#'

  return (
    <>
      <Button onClick={() => setOpen(true)}>Nouvelle demande +</Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Nouvelle demande
                </h2>
                <p className="text-sm text-slate-500">
                  Crée un lien unique pour ton client.
                </p>
              </div>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </div>

            <form action={formAction} className="mt-5 flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Nom du client</Label>
                <Input id="client-name" name="clientName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-phone">Numéro de téléphone</Label>
                <Input id="client-phone" name="clientPhone" placeholder="+33 6 12 34 56 78" />
              </div>
              <SubmitButton />
            </form>

            {state.error ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">
                {state.error}
              </p>
            ) : null}

            {state.ok && magicLink ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Lien magique</p>
                <p className="mt-1 break-all text-sm text-slate-900">{magicLink}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={handleCopy}>
                    Copier le lien
                  </Button>
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    <Button>Envoyer par WhatsApp</Button>
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
