'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      router.push('/dashboard')
      return
    }

    setMessage(
      'Compte créé. Vérifie ta boîte mail pour confirmer ton adresse.'
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-sky-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-sky-800 text-center">
          Créer un compte
        </h1>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm text-sky-900">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              className="rounded-xl border border-sky-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-sky-900">
            Mot de passe
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="rounded-xl border border-sky-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {message ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-sky-500 px-4 py-2 text-white font-medium hover:bg-sky-600 disabled:opacity-60"
          >
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-sky-700">
          <div className="flex flex-col gap-2">
            <Link href="/login" className="hover:underline">
              Déjà un compte ? Se connecter
            </Link>
            <Link href="/" className="hover:underline">
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
