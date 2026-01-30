import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-sky-50">
      <h1 className="text-3xl font-bold text-sky-800">RELYO</h1>
      <p className="text-sky-600 text-center">Bienvenue. Connexion Supabase configurée.</p>
      <nav className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-medium hover:bg-sky-600"
        >
          Connexion artisan
        </Link>
      </nav>
    </main>
  )
}
