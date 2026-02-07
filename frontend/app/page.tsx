import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/product-card';
import { Sparkles, ShieldCheck, MailCheck, ArrowRight } from 'lucide-react';

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
  const featured = products.slice(0, 6);

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40 p-10 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <div className="absolute left-[-10%] top-[-20%] h-60 w-60 rounded-full bg-mint/20 blur-[120px]" />
        <div className="absolute right-[-5%] bottom-[-30%] h-72 w-72 rounded-full bg-cyan-400/20 blur-[140px]" />
        <div className="relative grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-mint">
              <Sparkles size={14} /> Outdoor premium
            </span>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Équipez votre van et vos aventures, sans paiement en ligne.
            </h1>
            <p className="text-lg text-slate-200">
              Vérification email obligatoire, commandes sécurisées et support humain. Une sélection prête à installer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="button-primary">
                Découvrir le catalogue
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-white transition hover:border-mint">
                Créer mon compte <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 text-sm text-slate-200">
              {[{ icon: <MailCheck className="text-mint" size={16} />, title: 'Email first', desc: 'Validation obligatoire avant commande' },
                { icon: <ShieldCheck className="text-cyan-300" size={16} />, title: 'Secure stack', desc: 'JWT, NestJS, Prisma + MySQL' },
                { icon: <Sparkles className="text-purple-300" size={16} />, title: 'Livraison rapide', desc: 'Catalogue prêt à expédier' }].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-200">
                      {item.icon}
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]" />
            <div className="absolute inset-x-6 -bottom-10 rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <p className="font-semibold text-white">Support personnalisé</p>
              <p className="text-xs text-slate-400">On valide ensemble la compatibilité avant l’expédition.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Sélection</h2>
          <Link href="/products" className="flex items-center gap-2 text-sm text-mint hover:opacity-80">
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-slate-400">Aucun produit pour le moment.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
