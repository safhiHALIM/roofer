import { notFound } from 'next/navigation';
import { Product } from '@/types';
import { AddToCartButton } from '@/components/product-actions';
import { ShieldCheck, Truck, Sparkles } from 'lucide-react';

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    // Protect against empty/invalid JSON
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);
  if (!product) return notFound();

  return (
    <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint">Produit</p>
          <h1 className="text-4xl font-bold text-white">{product.name}</h1>
          <p className="text-lg text-slate-300">{product.description}</p>
        </div>
        <p className="text-3xl font-semibold text-mint">{product.price.toFixed(2)} €</p>
        <div className="flex flex-wrap gap-3">
          <AddToCartButton product={product} />
          <div className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">Livraison rapide</div>
        </div>
        <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-300 md:grid-cols-3">
          {[{ icon: <ShieldCheck size={18} className="text-mint" />, title: 'Commande email', desc: 'Validation manuelle pour la sécurité.' },
            { icon: <Truck size={18} className="text-cyan-300" />, title: 'Expédition', desc: 'Suivi communiqué après vérification.' },
            { icon: <Sparkles size={18} className="text-purple-300" />, title: 'Support', desc: 'Aide au montage et compatibilité.' }].map((item) => (
              <div key={item.title} className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-white">
                  {item.icon}
                  {item.title}
                </div>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}
