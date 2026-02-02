'use client'

import { useFormState, useFormStatus } from 'react-dom'

import type { ReviewFormState } from './actions'

const initialState: ReviewFormState = {
  ok: false,
  error: null,
}

type AvisFormProps = {
  token: string
  clientName?: string | null
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 w-full rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-60"
    >
      {pending ? 'Envoi...' : 'Envoyer mon avis'}
    </button>
  )
}

export default function AvisForm({
  token,
  clientName,
  action,
}: AvisFormProps & {
  action: (state: ReviewFormState, formData: FormData) => Promise<ReviewFormState>
}) {
  const [state, formAction] = useFormState(action, initialState)

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
        Merci {clientName ? clientName : ''} ! Votre avis a bien été envoyé.
      </div>
    )
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />

      <div>
        <label className="text-sm font-medium text-slate-700">Note</label>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <input type="radio" name="rating" value={value} className="sr-only" />
              {value}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Votre avis</label>
        <textarea
          name="comment"
          rows={4}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          placeholder="Dites-nous ce que vous avez apprécié..."
        />
      </div>

      {state.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  )
}
