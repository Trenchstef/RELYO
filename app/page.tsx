import Link from 'next/link'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase-server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const logout = async () => {
    'use server'
    const client = await createClient()
    await client.auth.signOut()
    redirect('/')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-sky-50">
      <h1 className="text-3xl font-bold text-sky-800">RELYO</h1>
      <p className="text-sky-600 text-center">Bienvenue. Connexion Supabase configurée.</p>

      <div className="rounded-2xl bg-white px-5 py-3 text-sm text-sky-900 shadow-sm">
        {user ? (
          <span>Connecté : {user.email}</span>
        ) : (
          <span>Non connecté</span>
        )}
      </div>

      <nav className="flex flex-wrap justify-center gap-4">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-medium hover:bg-sky-600"
            >
              Accéder au tableau de bord
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="px-4 py-2 rounded-2xl border border-sky-200 text-sky-700 font-medium hover:bg-sky-100"
              >
                Se déconnecter
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-medium hover:bg-sky-600"
            >
              Connexion artisan
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-2xl border border-sky-200 text-sky-700 font-medium hover:bg-sky-100"
            >
              Créer un compte
            </Link>
          </>
        )}
      </nav>
    </main>
  )
}
