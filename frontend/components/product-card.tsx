import Link from 'next/link';
import { Product } from '@/types';
import { ShoppingBag, Tag, ArrowUpRight } from 'lucide-react';

export const ProductCard = ({ product }: { product: Product }) => (
  <Link
    href={`/products/${product.slug}`}
    className="group relative flex h-full flex-col rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-900/40 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:-translate-y-1 hover:border-mint/50 hover:shadow-[0_24px_70px_rgba(34,197,94,0.18)]"
  >
    <div className="flex items-center justify-between text-xs text-slate-400">
      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1">
        <Tag size={14} className="text-mint" />
        {product.category?.name || 'Produit' }
      </span>
      <ArrowUpRight size={16} className="text-slate-500 transition group-hover:text-mint" />
    </div>

    <div className="mt-4 aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900" />

    <div className="mt-4 flex flex-1 flex-col justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-white group-hover:text-mint transition-colors">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-300">{product.description}</p>
      </div>
      <div className="flex items-center justify-between text-sm font-semibold text-mint">
        <span>{product.price.toFixed(2)} €</span>
        <span className="flex items-center gap-1 text-slate-300 text-xs">
          <ShoppingBag size={16} className="text-mint" /> Voir
        </span>
      </div>
    </div>
  </Link>
);
