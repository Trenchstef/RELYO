'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      setEmail(user.email ?? null)
      setLoading(false)
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-sky-50">
        <p className="text-sky-700">Chargement...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-sky-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-sky-800">Tableau de bord</h1>
        <p className="mt-2 text-sky-700">
          Connecté{email ? ` : ${email}` : ''}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-2xl border border-sky-200 text-sky-700 font-medium hover:bg-sky-100"
          >
            Retour à l’accueil
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-medium hover:bg-sky-600"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </main>
  )
}
