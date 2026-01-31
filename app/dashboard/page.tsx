'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [status, setStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated' | 'error'
  >('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          setStatus('error')
          setErrorMessage(error.message)
          return
        }

        const user = data.session?.user ?? null
        if (!user) {
          setStatus('unauthenticated')
          return
        }

        setEmail(user.email ?? null)
        setStatus('authenticated')
      } catch (err) {
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue')
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-sky-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-sky-800">Tableau de bord</h1>
        <p className="mt-2 text-sky-700">
          {status === 'loading' && 'Chargement...'}
          {status === 'authenticated' && `Connecté${email ? ` : ${email}` : ''}`}
          {status === 'unauthenticated' && 'Non connecté'}
          {status === 'error' && 'Erreur de session'}
        </p>

        {status === 'error' && errorMessage ? (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-2xl border border-sky-200 text-sky-700 font-medium hover:bg-sky-100"
          >
            Retour à l’accueil
          </Link>
          {status === 'unauthenticated' ? (
            <Link
              href="/login"
              className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-medium hover:bg-sky-600"
            >
              Se connecter
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-medium hover:bg-sky-600"
            >
              Se déconnecter
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
