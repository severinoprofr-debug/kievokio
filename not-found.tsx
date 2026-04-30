import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
      <p className="font-display text-8xl text-gold/20 font-light mb-4">404</p>
      <h1 className="font-display text-2xl text-offwhite mb-2">Page introuvable</h1>
      <p className="font-body text-sm text-muted mb-8">Cette page n&apos;existe pas ou a été déplacée.</p>
      <Link href="/"
        className="bg-gold text-bg font-body font-semibold px-6 py-3 rounded-full press-effect text-sm">
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
