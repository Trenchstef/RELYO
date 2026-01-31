import Link from 'next/link'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase-server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const logout = async () => {
    'use server'
    const client = await createClient()
    await client.auth.signOut()
    redirect('/')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-sky-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-sky-800">Tableau de bord</h1>
        <p className="mt-2 text-sky-700">Connecté : {user.email}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-2xl border border-sky-200 text-sky-700 font-medium hover:bg-sky-100"
          >
            Retour à l’accueil
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-medium hover:bg-sky-600"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
