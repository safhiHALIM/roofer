import Link from 'next/link';
import { Product } from '@/types';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-mint/10 via-cyan-500/10 to-purple-500/10 p-8 shadow-lg shadow-mint/10">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-green-200">Outdoor Premium</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight text-white">Roofer Univers</h1>
            <p className="mt-3 text-lg text-slate-200">
              E-commerce outdoor sécurisé par vérification email. Explorez nos équipements prêts pour l'aventure.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/register" className="button-primary">Créer un compte</Link>
              <Link href="/products" className="rounded-xl border border-white/10 px-4 py-2 text-white hover:border-mint">Découvrir</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            <div className="card">
              <p className="text-3xl font-bold text-mint">Email first</p>
              <p className="mt-2 text-slate-300">Accès et commandes uniquement après confirmation email.</p>
            </div>
            <div className="card">
              <p className="text-3xl font-bold text-cyan-300">MySQL + Prisma</p>
              <p className="mt-2 text-slate-300">Schéma robuste, migrations versionnées, audit par JWT.</p>
            </div>
            <div className="card">
              <p className="text-3xl font-bold text-purple-300">NestJS + Next.js</p>
              <p className="mt-2 text-slate-300">Stack TypeScript end-to-end avec validations Zod.</p>
            </div>
            <div className="card">
              <p className="text-3xl font-bold text-orange-300">Zero paiement</p>
              <p className="mt-2 text-slate-300">Commande par email, aucune intégration paiement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Produits</h2>
          <Link href="/products" className="text-sm text-mint hover:underline">Voir tout</Link>
        </div>
        {products.length === 0 ? (
          <p className="text-slate-400">Aucun produit pour le moment.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="card hover:border-mint/40">
                <p className="text-lg font-semibold text-white">{product.name}</p>
                <p className="mt-2 text-sm text-slate-300 line-clamp-2">{product.description}</p>
                <p className="mt-4 text-mint font-bold">{product.price.toFixed(2)} €</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
